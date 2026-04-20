import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { AgentTicketService } from "../services/agent-ticket.service";
import { Ticket } from "../../../shared/interfaces";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-agent-tickets",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./agent-tickets.component.html",
  styleUrl: "./agent-tickets.component.css",
})
export class AgentTicketsComponent implements OnInit {
  private ticketService = inject(AgentTicketService);
  private router = inject(Router);
  private authService = inject(AuthService);

  tickets: Ticket[] = [];
  loading = true;
  search = "";

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService
      .getTickets({ include: "category,user,agent", per_page: 100 })
      .subscribe({
        next: (data) => {
          this.tickets = (data.data || []).filter(
            (ticket) =>
              ticket.includes.agent?.id === this.authService.getUser()?.id,
          );
          this.loading = false;
        },
        error: (err) => {
          console.error("Error loading agent tickets:", err);
          this.loading = false;
        },
      });
  }

  filteredTickets(): Ticket[] {
    if (!this.search.trim()) {
      return this.tickets;
    }
    return this.tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(this.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(this.search.toLowerCase()) ||
        ticket.includes.user?.name
          .toLowerCase()
          .includes(this.search.toLowerCase()),
    );
  }

  viewTicket(ticketId: number): void {
    this.router.navigate(["/agent/tickets", ticketId]);
  }
}
