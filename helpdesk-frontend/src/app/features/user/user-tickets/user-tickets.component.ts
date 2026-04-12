import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AdminTicketServiceService } from "../../admin/services/admin/tickets/admin-ticket-service.service";
import { Ticket, Category } from "../../../shared/interfaces";
import { MessageService } from "primeng/api";
import { CategoriesService } from "../../admin/services/admin/categories/categories.service";
import { UserTicketService } from "../service/tickets/user-ticket.service";

@Component({
  selector: "app-user-tickets",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: "./user-tickets.component.html",
  styleUrl: "./user-tickets.component.css",
})

export class UserTicketsComponent implements OnInit {
  private ticketService = inject(UserTicketService);
  private categoryService = inject(CategoriesService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  tickets: Ticket[] = [];
  categories: Category[] = [];
  ticketForm!: FormGroup;
  showCreateForm = false;
  loading = true;
  loadingError = "";
  searchText = "";
  filterStatus = "all";

  ngOnInit(): void {
    this.loadTickets();
    this.initializeForm();
  }

  initializeForm() {
    this.ticketForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      category_id: ["", Validators.required],
      priority: ["low", Validators.required],
    });
  }

  loadTickets() {
    console.log("Called");
    
    this.loading = true;
    this.ticketService.getTickets({ per_page: 100 }).subscribe({
      next: (data) => {
        this.tickets = data.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading tickets:", err);
        this.loadingError = "Failed to load tickets";
        this.loading = false;
      },
    });
  }

  createTicket() {
    if (!this.ticketForm.valid) return;

    // this.ticketService.addTicket(this.ticketForm.value).subscribe({
    //   next: () => {
    //     this.messageService.add({
    //       severity: "success",
    //       summary: "Ticket Created",
    //       detail: "Your support ticket has been created successfully.",
    //     });
    //     this.ticketForm.reset();
    //     this.showCreateForm = false;
    //     this.loadTickets();
    //   },
    //   error: (err) => {
    //     console.error("Error creating ticket:", err);
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: "Failed to create ticket.",
    //     });
    //   },
    // });
  }

  getFilteredTickets() {
    return this.tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        ticket.description
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      const matchesStatus =
        this.filterStatus === "all" || ticket.status === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-100";
      case "closed":
        return "text-gray-600 bg-gray-100";
      case "open":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
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

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.ticketForm.reset();
    }
  }

  viewTicketDetail(ticketId: number) {
    this.router.navigate(["/user/tickets", ticketId]);
  }
}
