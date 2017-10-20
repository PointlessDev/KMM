import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {Mod} from '../mod';
import * as Chance from 'chance';
import {RegistryService} from '../registry.service';

const chance = new Chance();

@Component({
  selector: 'app-mod-list',
  templateUrl: './mod-list.component.html',
  styleUrls: ['./mod-list.component.scss']
})
export class ModListComponent implements OnInit {
  modDataSource: ModDataSource;
  focusedMod: Mod | null;
  enabledColumns = ['enabled', 'name', 'abstract', 'version'];
  @ViewChild('installCheckbox') checkbox: ElementRef;
  constructor(private registry: RegistryService) { }

  ngOnInit() {
    this.modDataSource = new ModDataSource(this.registry);
  }
  handleRowClick($event: MouseEvent, mod: Mod): void {
    if (!(this.checkbox.nativeElement as HTMLElement).contains(<Node>$event.target)) {
      this.focusedMod = mod;
    }
  }
}

export class ModDataSource extends DataSource<any> {
  constructor(private registry: RegistryService) {
    super();
  }

  connect(): Observable<Mod[]> {
    return this.registry.dataChange;
  }

  disconnect() {}
}

export function generateMod(): Mod {
  return {
    spec_version: 1,
    abstract: chance.sentence(),
    identifier: chance.syllable(),
    license: 'MIT',
    name: chance.sentence({words: 3}),
    version: (Math.round(Math.random() * 100) / 10).toString()
  };
}
