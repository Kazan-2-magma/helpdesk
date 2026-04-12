import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AdminTicketServiceService } from "../../services/admin/tickets/admin-ticket-service.service";
import { UserService } from "../../services/admin/users/user.service";
import { Faq, Ticket, User, Category } from "../../../../shared/interfaces";
import { forkJoin } from "rxjs";
import { FaqService } from "../../services/admin/faqs/faqs";
import { CategoriesService } from "../../services/admin/categories/categories.service";

@Component({
  selector: "app-admin-dashboard",
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin-dashboard.html",
  styleUrl: "./admin-dashboard.css",
})
export class AdminDashboard implements OnInit {
  private faqService = inject(FaqService);
  private ticketService = inject(AdminTicketServiceService);
  private userService = inject(UserService);
  private categoryService = inject(CategoriesService);
  private router = inject(Router);

  // Statistics
  totalFaqs = 0;
  totalTickets = 0;
  totalUsers = 0;
  totalCategories = 0;
  resolvedTickets = 0;
  openTickets = 0;

  // Data Lists
  recentTickets: Ticket[] = [];
  recentFaqs: Faq[] = [];
  allUsers: User[] = [];
  allCategories: Category[] = [];

  loading = true;
  loadingError = "";

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    forkJoin({
      faqs: this.faqService.getFaqs({ per_page: 100 }),
      tickets: this.ticketService.getTickets({ per_page: 100 }),
      users: this.userService.getUsers({ per_page: 100 }),
      categories: this.categoryService.getCategories({ per_page: 100 }),
    }).subscribe({
      next: (data) => {
        // FAQs
        this.totalFaqs = data.faqs.meta?.total || data.faqs.data?.length || 0;
        this.recentFaqs = data.faqs.data?.slice(0, 5) || [];

        // Tickets
        this.totalTickets =
          data.tickets.meta?.total || data.tickets.data?.length || 0;
        this.recentTickets = data.tickets.data?.slice(0, 5) || [];
        this.resolvedTickets = this.recentTickets.filter(
          (t: Ticket) => t.status === "resolved",
        ).length;
        this.openTickets = this.recentTickets.filter(
          (t: Ticket) => t.status === "open",
        ).length;

        // Users
        this.totalUsers =
          data.users.meta?.total || data.users.data?.length || 0;
        this.allUsers = data.users.data || [];

        // Categories
        this.totalCategories =
          data.categories.meta?.total || data.categories.data?.length || 0;
        this.allCategories = data.categories.data || [];

        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading dashboard data:", err);
        this.loadingError = "Failed to load dashboard data";
        this.loading = false;
      },
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "resolved":
      case "closed":
        return "text-green-600 bg-green-100";
      case "open":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }
}
