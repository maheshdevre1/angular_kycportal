import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiLapsedComponent } from './indi-lapsed.component';

describe('IndiLapsedComponent', () => {
  let component: IndiLapsedComponent;
  let fixture: ComponentFixture<IndiLapsedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndiLapsedComponent]
    });
    fixture = TestBed.createComponent(IndiLapsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
