export interface Mod { // TODO Finalize this
  spec_version: 1;
  name: string;
  abstract: string;
  identifier: string;
  download?: string; // Required unless metaPackage (?)
  license: string;
  version: string;

  author?: any;
  description?: string;
  release_status?: string;
  ksp_version?: string;
  resources?: {
    homepage: string;
    repository: string;
  };
  install?: {
    file: string;
    install_to: string;
  }[];
  depends?: {
    name: string;
    min_version: string;
  }[];
  recommends?: {
    name: string;
  }[];
}
