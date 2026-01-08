import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiPendingRecordsComponent } from './indi-pending-records.component';

describe('IndiPendingRecordsComponent', () => {
  let component: IndiPendingRecordsComponent;
  let fixture: ComponentFixture<IndiPendingRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndiPendingRecordsComponent]
    });
    fixture = TestBed.createComponent(IndiPendingRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
