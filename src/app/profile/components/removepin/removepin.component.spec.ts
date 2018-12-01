import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovepinComponent } from './removepin.component';

describe('RemovepinComponent', () => {
  let component: RemovepinComponent;
  let fixture: ComponentFixture<RemovepinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovepinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovepinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
