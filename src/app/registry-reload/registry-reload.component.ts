import {Component, OnDestroy, OnInit, NgZone} from '@angular/core';
import Timer = NodeJS.Timer;
import {toHumanSize} from '../util';
import {RegistryReloader, RegistryService} from '../registry.service';

const stepNames = {
  metaDownload: 'Downloading Meta...',
  unzipping: 'Extracting...',
  indexing: 'Indexing...',
  done: 'Completed!'
};

@Component({
  selector: 'app-registry-reload',
  templateUrl: './registry-reload.component.html',
  styleUrls: ['./registry-reload.component.scss']
})
export class RegistryReloadComponent implements OnInit, OnDestroy {
  progressNumber: number;
  progressText: string;
  progressType: string;
  step: string;
  interval: Timer;
  registryReloadEvent: RegistryReloader;
  state = 'running';
  failReason: string;
  showClose = false;
  constructor(private ngZone: NgZone, private registry: RegistryService) { }

  ngOnInit() {
    this.registryReloadEvent = this.registry.reload();
    let lastUpdatePercent = 0;
    this.registryReloadEvent
      .on('update', (e) => {
      if (stepNames[e.step] !== this.step) {
        this.ngZone.run(() => {
          console.log('Changing step code from, to', this.step, e.step);
          this.step = stepNames[e.step];
        });
      }
      if (e.step === 'metaDownload') {
        if (e.size) {
          const percentage = Math.round(e.progress * 100 / e.size);
          if (percentage - lastUpdatePercent >= 1) {
            lastUpdatePercent = percentage;
            this.ngZone.run(() => {
              this.progressNumber = percentage;
              this.progressText = `${toHumanSize(e.progress)} of ${toHumanSize(e.size)} - ${percentage}%`;
              this.progressType = this.registryReloadEvent.size ? 'determinate' : 'indeterminate';
            });
          }
        } else {
          this.ngZone.run(() => {
            this.progressText = `${toHumanSize(e.progress)} of unknown`;
            this.progressType = this.registryReloadEvent.size ? 'determinate' : 'indeterminate';
          })
        }
      } else if (e.step === 'unzipping') {
      } else if (e.step === 'done') {
        console.log(`Registry download complete: ${toHumanSize(e.progress)} of ${toHumanSize(e.size)}`);
        this.ngZone.run(() => {
          this.progressType = 'determinate';
          this.progressNumber = 100;
          this.progressText = `Completed download. (${toHumanSize(e.progress)})`;
          this.showClose = true;
        })
      }
    })
      .on('fail', (error: Error, text: string) => {
        this.ngZone.run(() => {
          console.error(error);
          this.state = 'failed';
          this.failReason = text;
        })
      })
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  cancel() {
    this.registryReloadEvent.abort();
  }
}
