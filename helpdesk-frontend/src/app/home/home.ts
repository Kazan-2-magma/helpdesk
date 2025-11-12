import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { ApiEndpoints } from '../shared/api_endpoints';
import { tap } from 'rxjs';
import { User } from '../shared/interfaces';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeCompenent implements OnInit{

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.apiService.get<User>(ApiEndpoints.LOAD_USER).pipe(
      tap((response: User) => {
        console.log(response.email)
      })
    ).subscribe();

  }
  

}
