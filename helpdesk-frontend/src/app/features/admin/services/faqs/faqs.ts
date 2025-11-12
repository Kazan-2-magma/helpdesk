import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Faq, JsonApiResponse, PaginatedResponse } from '../../../../shared/interfaces';
import { ApiEndpoints } from '../../../../shared/api_endpoints';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiService = inject(ApiService)


  getFaqs(params?: Record<string, any>): Observable<PaginatedResponse<Faq>> {
    return this.apiService.get<PaginatedResponse<Faq>>(`${ApiEndpoints.ADMIN_FAQ}`,params);
  }

  deleteFaq(faqId:number) :Observable<JsonApiResponse> {
    return this.apiService.delete<JsonApiResponse>(`${ApiEndpoints.ADMIN_FAQ}/${faqId}`);
  }

  updateFaq(faqId: number, faq: Faq): Observable<JsonApiResponse> {
    return this.apiService.put(`${ApiEndpoints.ADMIN_FAQ}/${faqId}`, faq);
  }

  addFaq(data:any) {
    return this.apiService.post<JsonApiResponse>(`${ApiEndpoints.ADMIN_FAQ}`, data);
  }
  
}
