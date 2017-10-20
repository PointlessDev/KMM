import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacControlsComponent } from './mac-controls.component';

describe('MacControlsComponent', () => {
  let component: MacControlsComponent;
  let fixture: ComponentFixture<MacControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
