import {Component, Input, OnInit} from '@angular/core';
import {Mod} from '../mod';

@Component({
  selector: 'app-mod-detail',
  templateUrl: './mod-detail.component.html',
  styleUrls: ['./mod-detail.component.scss']
})
export class ModDetailComponent implements OnInit {
  @Input() mod: Mod;
  constructor() { }
  ngOnInit() { }
}
