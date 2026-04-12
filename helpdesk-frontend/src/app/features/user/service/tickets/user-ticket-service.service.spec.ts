import { TestBed } from '@angular/core/testing';

import { UserTicketServiceService } from './tickets/user-ticket-service.service';

describe('UserTicketServiceService', () => {
  let service: UserTicketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTicketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
