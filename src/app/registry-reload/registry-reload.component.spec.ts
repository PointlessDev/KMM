import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryReloadComponent } from './registry-reload.component';

describe('RegistryReloadComponent', () => {
  let component: RegistryReloadComponent;
  let fixture: ComponentFixture<RegistryReloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryReloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryReloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
