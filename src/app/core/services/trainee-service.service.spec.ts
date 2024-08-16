import { TestBed } from '@angular/core/testing';

import { TraineeServiceService } from './trainee-service.service';

describe('TraineeServiceService', () => {
  let service: TraineeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
