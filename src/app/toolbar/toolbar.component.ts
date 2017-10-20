import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {TypographyComponent} from '../typography/typography.component';
import is from 'electron-is';
import {RegistryReloadComponent} from '../registry-reload/registry-reload.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  isMac = is.macOS();

  constructor(public dialog: MatDialog) { }

  openTypography() {
    this.dialog.open(TypographyComponent, {
      height: '600px',
      width: '700px'
    })
  }

  reloadRegistry() {
    this.dialog.open(RegistryReloadComponent, {
      disableClose: true,
      height: '200px',
      width: '410px'
    })
  }

  ngOnInit() {
  }

}
