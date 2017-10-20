import { Injectable } from '@angular/core';
import {get as httpGet} from 'http';
import {get as httpsGet} from 'https';
import {ClientRequest, IncomingMessage} from 'http';
import * as EventEmitter from 'events';
import * as unzip from 'adm-zip';
import * as rimraf from 'rimraf';
import * as fs from 'graceful-fs';
import * as path from 'path';
import {Mod} from './mod';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const KMM_DIR = '/Users/asher/Desktop/kmm';
const REGISTRY_META_DIR = KMM_DIR + '/meta';
const REGISTRY_DOWNLOAD_URL = 'https://codeload.github.com/KSP-CKAN/CKAN-meta/zip/master';
const PARSEABLE_EXTENSIONS = ['.ckan', '.kerbalstuff', '.frozen'];

if (!recursivlyCheckIfDirExists(KMM_DIR)) {
  recursivlyMkdir(KMM_DIR);
}
console.log(`Registry dir: ${KMM_DIR}`);


@Injectable()
export class RegistryService extends EventEmitter {
  dataChange: BehaviorSubject<Mod[]> = new BehaviorSubject<Mod[]>([]);
  get mods(): Mod[] {return this.dataChange.value}
  kspVersion = '1.3.0';
  constructor() {
    super();
    new RegistryReloader(this).reindex().then((mods: Mod[]) => {
      this.dataChange.next(mods);
      console.log(`Reindexed (Now with ${mods.length} mods!)`)
    });
  }

  reload(): RegistryReloader {
    return new RegistryReloader(this).redownload(REGISTRY_DOWNLOAD_URL);
  }
}

export class RegistryReloader extends EventEmitter {
  httpRequest: ClientRequest;
  size: number;
  progress = 0;
  step: string;
  aborted = false;
  abortionConfirmed = false;
  constructor(private registry: RegistryService) {
    super();
  }
  redownload(url: string): this {
    if (this.httpRequest) {
      return this;
    }
    this.httpRequest = (url.startsWith('https:') ? httpsGet : httpGet)(url, (res: IncomingMessage) => {
      if (res.statusCode !== 200) {
        return this.emit('fail',
          new Error('Meta archive responded with a non-200 code'),
          `Failed to download meta (Error ${res.statusCode})`
        )
      }
      this.step = 'metaDownload';
      this.size = parseInt(res.headers['content-length'] || 0, 10);
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => {
        this.progress += chunk.length;
        chunks.push(chunk);
        this.emit('update', this)
      });
      res.on('end', () => {
        const data = Buffer.concat(chunks);
        this.step = 'unzipping';
        this.emit('update', this);
        if (!this.aborted) {
          setTimeout(() => this.unzipMeta(data));
        } else {
          this.confirmAbort();
        }
      });
      res.on('error', e => {
        this.emit('fail', e, 'Failed to download metadata');
      })
    }).on('error', e => {
      this.emit('fail', e, 'Failed to download metadata')
    });
    return this;
  }
  reindex(): Promise<Mod[]> {
    console.log(`[REGISTRY] Reindexing meta...`);
    return new Promise<Mod[]>((resolve, reject) => {
      fs.readdir(REGISTRY_META_DIR, (err, modDirs) => {
        if (err) {
          this.emit('error', err, 'Failed to index meta dir');
          return reject(err);
        }
        Promise.all<Mod[]>(modDirs.map((dir: string) => {
          if (this.aborted) {
            this.confirmAbort();
            return Promise.reject(new Error('Aborted while indexing meta dir'));
          }
          dir = REGISTRY_META_DIR + '/' + dir;
          if (fs.statSync(dir).isDirectory()) {
            return this.indexModDir(dir);
          }
        })).then((modListList: Mod[][]) => {
          const fullList = [];
          modListList.forEach(modList => fullList.push(...modList));
          resolve(fullList);
        }, e => reject(e));
      })
    });
  }
  abort() {
    this.aborted = true;
    if (typeof this.httpRequest.abort === 'function') {
      this.httpRequest.abort();
    }
  }
  private indexModDir(dir: string): Promise<Mod[]> {
    console.log(`[REGISTRY] Indexing mod dir ${dir}`);
    return new Promise<Mod[]>((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        Promise.all<Mod>(files.map(filename => {
          if (this.aborted) {
            this.confirmAbort();
            return Promise.reject(new Error('Aborted while indexing mod dir'));
          }
          const filePath = dir + '/' + filename;
          const extension = path.extname(filePath);
          if (!PARSEABLE_EXTENSIONS.includes(extension)) {
            return Promise.reject(new Error('Unparseable file encountered: ' + filePath));
          }
          return this.indexFile(filePath);
        })).then(mods => {
          mods = mods.filter(m => m);
          resolve()
        }, e => reject(e));
      });
    });
  }
  private unzipMeta(zippedBuffer: Buffer) {
    console.log('Unzipping!');
    if (fs.existsSync(REGISTRY_META_DIR)) {
      if (fs.statSync(REGISTRY_META_DIR).isDirectory()) {
        if (!this.aborted) {
          rimraf.sync(REGISTRY_META_DIR, {disableGlob: true});
        }
      }else {
        return this.emit('fail',
          new Error('File is in place of meta dir'),
          'File is in place of meta dir, please remove before retrying'
        )
      }
    } // Get rid of the meta dir.
    unzip(zippedBuffer).extractAllTo(KMM_DIR + '/meta-temp');
    fs.renameSync(KMM_DIR + '/meta-temp/CKAN-meta-master', REGISTRY_META_DIR);
    rimraf.sync(KMM_DIR + '/meta-temp');
    console.log('Unzipped!');
    this.step = 'indexing';
    this.emit('update', this);
    setTimeout(() => this.reindex())
  }
  private indexFile(path: string): Promise<Mod> {
    return new Promise<Mod|void>(((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          this.emit('fail', err, 'Failed to read file: ' + path);
          return reject(err);
        }
        let mod: Mod;
        try {
          mod = JSON.parse(data.toString());
        } catch (e) {
          console.error('Failed to parse mod: ', path);
          console.error(e);
          resolve(null);
        }
        resolve(mod.ksp_version === this.registry.kspVersion ? mod : null);
      })
    }));
  }
  private confirmAbort() {
    this.abortionConfirmed = true;
    this.emit('abort');
  }
}

function recursivlyCheckIfDirExists(dir) {
  const sep = path.sep;
  const initDir = path.isAbsolute(dir) ? sep : '';
  const checks: string[] = [];
  dir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(parentDir, childDir);
    checks.push(curDir);
    return curDir;
  }, initDir);

  return !checks.some(checkDir => {
    return !(fs.existsSync(checkDir) && fs.statSync(checkDir).isDirectory())
  })
}
function recursivlyMkdir(dir) {
  // Thanks, https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
  const sep = path.sep;
  const initDir = path.isAbsolute(dir) ? sep : '';
  dir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(parentDir, childDir);
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir);
    }

    return curDir;
  }, initDir);
}
