import { TestBed } from '@angular/core/testing';

import { CommonstoreService } from './commonstore.service';

describe('CommonstoreService', () => {
  let service: CommonstoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonstoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
