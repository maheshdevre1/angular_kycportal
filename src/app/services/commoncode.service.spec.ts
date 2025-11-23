import { TestBed } from '@angular/core/testing';

import { CommoncodeService } from './commoncode.service';

describe('CommoncodeService', () => {
  let service: CommoncodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommoncodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
