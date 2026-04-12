import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { User } from "../../../shared/interfaces";
import { AppLayoutComponent } from "../../../shared/layout/app-layout/app-layout.component";

@Component({
  selector: "app-user-layout",
  imports: [CommonModule, RouterModule,AppLayoutComponent],
  templateUrl: "./user-layout.component.html",
  styleUrl: "./user-layout.component.css",
})
export class UserLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;
  sidebarOpen = false;

  ngOnInit() {
    // this.authService.currentUser$.subscribe((user) => {
    //   this.currentUser = user || null;
    // });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
