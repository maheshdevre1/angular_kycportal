import { TestBed } from '@angular/core/testing';

import { PendingRecordService } from './pending-record.service';

describe('PendingRecordService', () => {
  let service: PendingRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
