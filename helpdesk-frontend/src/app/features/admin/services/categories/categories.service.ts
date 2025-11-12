import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Category, PaginatedResponse } from '../../../../shared/interfaces';
import { ApiEndpoints } from '../../../../shared/api_endpoints';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiService = inject(ApiService);

  getCategories(params? : Record<string,any>): Observable<PaginatedResponse<Category>>{
    return this.apiService.get<PaginatedResponse<Category>>(`${ApiEndpoints.ADMIN_CATEGORY}`,params);
  }


  
}
