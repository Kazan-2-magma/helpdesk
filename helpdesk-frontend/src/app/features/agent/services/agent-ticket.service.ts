import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { ApiEndpoints } from "../../../shared/api_endpoints";
import { Observable } from "rxjs";
import {
  PaginatedResponse,
  Ticket,
  JsonApiResponse,
} from "../../../shared/interfaces";

@Injectable({
  providedIn: "root",
})
export class AgentTicketService {
  private apiService = inject(ApiService);

  getTickets(
    params?: Record<string, any>,
  ): Observable<PaginatedResponse<Ticket>> {
    return this.apiService.get<PaginatedResponse<Ticket>>(
      `${ApiEndpoints.AGENT_TICKETS}`,
      params,
    );
  }

  getTicketDetail(ticketId: number): Observable<JsonApiResponse> {
    return this.apiService.get<JsonApiResponse>(
      `${ApiEndpoints.TICKETS}/${ticketId}?include=comments`,
    );
  }
}
