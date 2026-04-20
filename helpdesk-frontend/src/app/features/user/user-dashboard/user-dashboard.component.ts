import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { UserTicketService } from "../service/tickets/user-ticket.service";
import { Ticket } from "../../../shared/interfaces";

interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

@Component({
  selector: "app-user-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./user-dashboard.component.html",
  styleUrl: "./user-dashboard.component.css",
})
export class UserDashboardComponent implements OnInit {
  private ticketService = inject(UserTicketService);
  private router = inject(Router);

  loading = true;
  tickets: Ticket[] = [];
  recentTickets: Ticket[] = [];

  stats: DashboardStats = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.ticketService.getTickets({ per_page: 100 }).subscribe({
      next: (data) => {
        this.tickets = data.data || [];
        this.calculateStats();
        this.recentTickets = this.tickets.slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading dashboard data:", err);
        this.loading = false;
      },
    });
  }

  calculateStats(): void {
    this.stats.total = this.tickets.length;
    this.stats.open = this.tickets.filter((t) => t.status === "open").length;
    this.stats.inProgress = this.tickets.filter(
      (t) => t.status === "open",
    ).length;
    this.stats.resolved = this.tickets.filter(
      (t) => t.status === "resolved" || t.status === "closed",
    ).length;
    this.stats.highPriority = this.tickets.filter(
      (t) => t.priority === "high",
    ).length;
    this.stats.mediumPriority = this.tickets.filter(
      (t) => t.priority === "medium",
    ).length;
    this.stats.lowPriority = this.tickets.filter(
      (t) => t.priority === "low",
    ).length;
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "open":
        return `${baseClasses} bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200`;
      case "in_progress":
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200`;
      case "resolved":
      case "closed":
        return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
    }
  }

  navigateToTicket(ticketId: number): void {
    this.router.navigate(["/user/tickets", ticketId]);
  }
}
