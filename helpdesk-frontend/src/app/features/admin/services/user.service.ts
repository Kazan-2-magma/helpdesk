import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { JsonApiResponse, PaginatedResponse, User } from '../../../shared/interfaces';
import { ApiEndpoints } from '../../../shared/api_endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiService = inject(ApiService)

  getUsers(params?: Record<string, any>): Observable<PaginatedResponse<User>> {
    return this.apiService.get<PaginatedResponse<User>>(`${ApiEndpoints.ADMIN_USER}`, params);
  }
  
  addUser(data: any): Observable<JsonApiResponse> {
    return this.apiService.post(`${ApiEndpoints.ADMIN_USER}`, data);
  }

  updateUser(userId:number,user:User) : Observable<JsonApiResponse> {
    return this.apiService.put(`${ApiEndpoints.ADMIN_USER}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<JsonApiResponse> {
    return this.apiService.delete(`${ApiEndpoints.ADMIN_USER}/${userId}`);
  }
}
