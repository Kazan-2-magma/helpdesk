import { TestBed } from '@angular/core/testing';

import { AdminTicketServiceService } from './admin-ticket-service.service';

describe('AdminTicketServiceService', () => {
  let service: AdminTicketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTicketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
