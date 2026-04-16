import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../../../core/services/api.service";
import {
  JsonApiResponse,
  PaginatedResponse,
  Ticket,
} from "../../../../shared/interfaces";
import { Observable } from "rxjs";
import { ApiEndpoints } from "../../../../shared/api_endpoints";

@Injectable({
  providedIn: "root",
})
export class UserTicketService {
  private apiService = inject(ApiService);

  getTickets(
    params?: Record<string, any>,
  ): Observable<PaginatedResponse<Ticket>> {
    return this.apiService.get<PaginatedResponse<Ticket>>(
      `${ApiEndpoints.USER_TICKETS}`,
      params,
    );
  }

  getTicketDetail(ticketId: number): Observable<JsonApiResponse> {
    return this.apiService.get<JsonApiResponse>(
      `${ApiEndpoints.TICKETS}/${ticketId}?include=comments`,
    );
  }

  addComment(ticketId: number, data: any): Observable<JsonApiResponse> {
    return this.apiService.post(
      `${ApiEndpoints.USER_COMMENT}/${ticketId}/comments`,
      data,
    );
  }

  addTicket(data: any): Observable<JsonApiResponse> {
    return this.apiService.post(`${ApiEndpoints.TICKETS}`, data);
  }

  addUser(data: any): Observable<JsonApiResponse> {
    return this.apiService.post(`${ApiEndpoints.ADMIN_USER}`, data);
  }

  updateUser(
    userId: number,
    user: Partial<Ticket>,
  ): Observable<JsonApiResponse> {
    return this.apiService.put(`${ApiEndpoints.ADMIN_USER}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<JsonApiResponse> {
    return this.apiService.delete(`${ApiEndpoints.ADMIN_USER}/${userId}`);
  }
}
