import { HostListener, Component } from '@angular/core';
import { remote } from 'electron';
const window = remote.getCurrentWindow();

@Component({
  selector: 'app-mac-controls',
  templateUrl: './mac-controls.component.html',
  styleUrls: ['./mac-controls.component.scss']
})
export class MacControlsComponent {
  focused: boolean = document.hasFocus();
  constructor() { }

  @HostListener('window:focus', ['$event'])
  onFocus() {
    this.focused = true;
  }
  @HostListener('window:blur', ['$event'])
  onBlur() {
    this.focused = false;
  }

  close() {
    window.close()
  }

  min() {
    window.minimize()
  }

  max() {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
}
