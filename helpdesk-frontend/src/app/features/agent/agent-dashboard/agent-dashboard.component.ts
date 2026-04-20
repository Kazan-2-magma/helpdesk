import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgentTicketService } from "../services/agent-ticket.service";
import { AuthService } from "../../../core/services/auth.service";
import { Ticket } from "../../../shared/interfaces";

@Component({
  selector: "app-agent-dashboard",
  imports: [CommonModule],
  templateUrl: "./agent-dashboard.component.html",
  styleUrl: "./agent-dashboard.component.css",
})
export class AgentDashboardComponent implements OnInit {
  private ticketService = inject(AgentTicketService);
  public authService = inject(AuthService);

  loading = true;
  tickets: Ticket[] = [];
  totalTickets = 0;
  openTickets = 0;
  resolvedTickets = 0;
  closedTickets = 0;
  currentAgentName = "";
  currentAgentId?: number;

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.currentAgentName = user?.name || "Agent";
    this.currentAgentId = user?.id;
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService
      .getTickets({ include: "category,user,agent", per_page: 100 })
      .subscribe({
        next: (data) => {
          this.tickets = (data.data || []).filter(
            (ticket) => ticket.includes.agent?.id === this.currentAgentId,
          );
          this.filterTickets();
          this.loading = false;
        },
        error: (err) => {
          console.error("Error loading agent tickets:", err);
          this.loading = false;
        },
      });
  }

  private filterTickets(): void {
    this.totalTickets = this.tickets.length;
    this.openTickets = this.tickets.filter(
      (ticket) => ticket.status === "open",
    ).length;
    this.resolvedTickets = this.tickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length;
    this.closedTickets = this.tickets.filter(
      (ticket) => ticket.status === "closed",
    ).length;
  }
}
