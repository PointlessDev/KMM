import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModListComponent } from './mod-list.component';

describe('ModListComponent', () => {
  let component: ModListComponent;
  let fixture: ComponentFixture<ModListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});