import { TestBed } from '@angular/core/testing';

import { SpinnerControlService } from './spinner-control.service';

describe('SpinnerControlService', () => {
  let service: SpinnerControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
