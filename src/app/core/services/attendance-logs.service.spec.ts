import { TestBed } from '@angular/core/testing';

import { AttendanceLogsService } from './attendance-logs.service';

describe('AttendanceLogsService', () => {
  let service: AttendanceLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
