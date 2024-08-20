import { TestBed } from '@angular/core/testing';

import { TraineeAttendancelogService } from './trainee-attendancelog.service';

describe('TraineeAttendancelogService', () => {
  let service: TraineeAttendancelogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineeAttendancelogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
