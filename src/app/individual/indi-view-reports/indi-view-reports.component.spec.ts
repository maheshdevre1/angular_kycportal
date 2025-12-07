import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiViewReportsComponent } from './indi-view-reports.component';

describe('IndiViewReportsComponent', () => {
  let component: IndiViewReportsComponent;
  let fixture: ComponentFixture<IndiViewReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndiViewReportsComponent]
    });
    fixture = TestBed.createComponent(IndiViewReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
