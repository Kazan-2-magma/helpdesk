// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginResponse, User } from '../../shared/interfaces';
import { ApiEndpoints } from '../../shared/api_endpoints';
import { Constants } from '../../shared/constants';

@Injectable({ providedIn: 'root' })
export class AuthService {



  user$ = new BehaviorSubject<any | null>(this.getUser());

  constructor(private apiService:ApiService) { }

  login(credentials: { email: string; password: string }) {

    return this.apiService.post<LoginResponse>(ApiEndpoints.LOGIN, credentials).pipe(
      tap((response: any) => {
          console.log(response.data.token)
          localStorage.setItem(Constants.TOKEN_KEY, response.data.token);
          localStorage.setItem(Constants.USER_KEY, JSON.stringify(response.data.user));
          this.user$.next(response.user);
        })
      );
  }

  logout() {
    localStorage.removeItem(Constants.TOKEN_KEY);
    localStorage.removeItem(Constants.USER_KEY);
    this.user$.next(null);
  }

  getToken() : string | null {
    return localStorage.getItem(Constants.TOKEN_KEY);
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  getUser() {
    const user = localStorage.getItem(Constants.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  
  async loadUser() {

    
    const token = this.getToken();
    console.log("Token ",token)
    if (!token) return Promise.resolve(false);

    return this.apiService.get<User>(`${ApiEndpoints.LOAD_USER}`)
      .toPromise()
      .then(user => {
        this.user$.next(user);
        localStorage.setItem(Constants.USER_KEY, JSON.stringify(user));
        return true;
      })
      .catch(() => {
        console.log("Error ")
        this.logout();
        return false;
      });
}


  isAuthenticated() {
    return !!this.getToken();
  }
}
