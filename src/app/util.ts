export function toHumanSize(bytes) {
  if (bytes < 10e3) {
    return `${bytes} bytes`;
  }else if (bytes < 10e5) {
    return `${Math.round(bytes / 10e2)} KB`;
  }else if (bytes < 10e8) {
    return `${Math.round(bytes / 10e5)} MB`;
  }else if (bytes < 10e11) {
    return `${Math.round(bytes / 10e8)} GB`;
  }else if (bytes < 10e14) {
    return `${Math.round(bytes / 10e11)} TB`;
  }else {
    return 'A lot.'; // Shhhh
  }
}
