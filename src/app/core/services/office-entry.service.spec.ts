import { TestBed } from '@angular/core/testing';

import { OfficeEntryService } from './office-entry.service';

describe('OfficeEntryService', () => {
  let service: OfficeEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficeEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
