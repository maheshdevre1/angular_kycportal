import { TestBed } from '@angular/core/testing';

import { LapsedService } from './lapsed.service';

describe('LapsedService', () => {
  let service: LapsedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LapsedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
