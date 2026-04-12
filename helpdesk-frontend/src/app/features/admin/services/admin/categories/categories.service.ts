import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../../../../../shared/api_endpoints';
import { ApiService } from '../../../../../core/services/api.service';
import { Category, JsonApiResponse, PaginatedResponse } from '../../../../../shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiService = inject(ApiService);

  getCategories(params? : Record<string,any>): Observable<PaginatedResponse<Category>>{
    return this.apiService.get<PaginatedResponse<Category>>(`${ApiEndpoints.ADMIN_CATEGORY}`,params);
  }

  addCategory(data: any): Observable<JsonApiResponse> {
    return this.apiService.post<JsonApiResponse>(`${ApiEndpoints.ADMIN_CATEGORY}`, data);
  }

  updateCategory(categoryId: number, data: any): Observable<JsonApiResponse> {
    return this.apiService.put<JsonApiResponse>(`${ApiEndpoints.ADMIN_CATEGORY}/${categoryId}`, data);
  }

  deleteCategory(categoryId: number): Observable<JsonApiResponse> {
    return this.apiService.delete<JsonApiResponse>(`${ApiEndpoints.ADMIN_CATEGORY}/${categoryId}`);
  }
}
