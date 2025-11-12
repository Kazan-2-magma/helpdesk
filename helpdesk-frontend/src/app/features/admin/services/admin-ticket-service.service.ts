import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { catchError, Observable, of } from 'rxjs';
import { PaginatedResponse, Ticket } from '../../../shared/interfaces';
import { ApiEndpoints } from '../../../shared/api_endpoints';


@Injectable({
  providedIn: 'root'
})
export class AdminTicketServiceService {
  
  private apiService = inject(ApiService);

  getTickets(params?: Record<string, any>): Observable<PaginatedResponse<Ticket>>{
    return this.apiService.get<PaginatedResponse<Ticket>>(`${ApiEndpoints.TICKETS}`, params)
      .pipe(
        catchError(err => {
          console.error('Error fetching tickets', err);
          return of({} as PaginatedResponse<Ticket>);
        })
      );
  }

}