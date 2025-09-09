import { TestBed } from '@angular/core/testing';

import { CampaingService } from './campaing.service';

describe('CampaingService', () => {
  let service: CampaingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampaingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
