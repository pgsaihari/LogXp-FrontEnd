import { TestBed } from '@angular/core/testing';

import { HeriService } from './heri.service';

describe('HeriService', () => {
  let service: HeriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
