import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavepinComponent } from './havepin.component';

describe('HavepinComponent', () => {
  let component: HavepinComponent;
  let fixture: ComponentFixture<HavepinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavepinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavepinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
