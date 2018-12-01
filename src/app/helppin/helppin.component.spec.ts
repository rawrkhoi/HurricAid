import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelppinComponent } from './helppin.component';

describe('HelppinComponent', () => {
  let component: HelppinComponent;
  let fixture: ComponentFixture<HelppinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelppinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelppinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
