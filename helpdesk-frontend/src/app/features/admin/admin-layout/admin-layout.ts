import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ADMIN_ROUTES } from '../admin.routes';
import { AppLayoutComponent } from '../../../shared/layout/app-layout/app-layout.component';


@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule,
    AppLayoutComponent
    // BreadcrumbComponent
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit{
  


  ngOnInit(): void {
    console.log("kjkfj")
  }

  

}
