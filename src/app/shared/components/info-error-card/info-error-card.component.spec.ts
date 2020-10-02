import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoErrorCardComponent } from './info-error-card.component';

describe('InfoErrorCardComponent', () => {
  let component: InfoErrorCardComponent;
  let fixture: ComponentFixture<InfoErrorCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoErrorCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoErrorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
