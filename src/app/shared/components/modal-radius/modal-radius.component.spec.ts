import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRadiusComponent } from './modal-radius.component';

describe('ModalRadiusComponent', () => {
  let component: ModalRadiusComponent;
  let fixture: ComponentFixture<ModalRadiusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRadiusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRadiusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
