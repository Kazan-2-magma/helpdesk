import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  Category,
  DropDownContent,
  Ticket,
  User,
} from "../../../../shared/interfaces";
import { BasicTableThreeComponent } from "../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { TableDropdownComponent } from "../../../../shared/components/common/table-dropdown/table-dropdown.component";
import { AdminTicketServiceService } from "../../services/admin/tickets/admin-ticket-service.service";
import { CategoriesService } from "../../services/admin/categories/categories.service";
import { UserService } from "../../services/admin/users/user.service";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  Subject,
  takeUntil,
} from "rxjs";
import {
  ROLE,
  TICKET_STATUS,
  TICKET_STATUS_LIST,
} from "../../../../shared/enum/enumes";
import { FilterButtonsComponent } from "../../../../shared/components/filter-buttons/filter-buttons.component";
import { DrawerComponent } from "../../../../shared/components/drawer/drawer.component";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-admin-tickets",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableDropdownComponent,
    BasicTableThreeComponent,
    FilterButtonsComponent,
    DrawerComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./admin-tickets.html",
  styleUrl: "./admin-tickets.css",
})
export class AdminTickets implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.ticketStatus = TICKET_STATUS_LIST;
    this.initializeForm();
    this.loadCategories();
    this.loadAgents();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((text) => this.getTickets(1, false, text));

    this.getTickets().finally(() => this.filterTickets());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loading: boolean = false;
  loadingMore = false;
  lastPage = false;
  currentPage = 1;
  visible: boolean = false;
  totalTickets = 0;
  resolvedTickets = 0;
  openTickets = 0;
  closedTickets = 0;
  ticketStatus: any[] = [];
  formMode: string = "update";
  ticketToUpdate?: Ticket;
  ticketForm!: FormGroup;

  categories: Category[] = [];
  agents: User[] = [];

  private searchSubject = new Subject<string | undefined>();
  searchText: string = "";

  private formBuilder = inject(FormBuilder);
  private ticketService = inject(AdminTicketServiceService);
  private categoryService = inject(CategoriesService);
  private userService = inject(UserService);
  private ticketSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketSubject.asObservable();
  private messageService = inject(MessageService);

  initializeForm() {
    this.ticketForm = this.formBuilder.group({
      status: ["open", Validators.required],
      priority: ["low", Validators.required],
      category_id: ["", Validators.required],
      agent_id: [null],
    });
  }

  loadCategories() {
    this.categoryService.getCategories({ per_page: 100 }).subscribe({
      next: (data) => (this.categories = data.data || []),
      error: (err) => console.error("Failed to load categories", err),
    });
  }

  loadAgents() {
    this.userService.getUsers({ role: ROLE.AGENT, per_page: 100 }).subscribe({
      next: (data) => (this.agents = data.data || []),
      error: (err) => console.error("Failed to load agents", err),
    });
  }

  onLoadMore() {
    if (!this.loadingMore && !this.lastPage) {
      this.getTickets(this.currentPage + 1, true);
    }
  }

  onSearchChange(text: string) {
    const trimmed = text.trim();
    this.currentPage = 1;
    this.loading = true;
    this.searchSubject.next(trimmed || undefined);
  }

  onFilterChange(filter: string) {
    if (filter === "All") {
      this.getTickets();
    } else {
      this.getTickets(1, false, undefined, filter.toLowerCase());
    }
  }

  filterTickets() {
    const data = this.ticketSubject.getValue();
    this.openTickets = data.filter(
      (ticket) => ticket.status === TICKET_STATUS.OPEN,
    ).length;
    this.resolvedTickets = data.filter(
      (ticket) => ticket.status === TICKET_STATUS.RESOLVED,
    ).length;
    this.closedTickets = data.filter(
      (ticket) => ticket.status === TICKET_STATUS.CLOSED,
    ).length;
    this.totalTickets = data.length;
  }

  dropDownContents: DropDownContent[] = [
    {
      id: 1,
      label: "Edit",
      action: (ticket: Ticket) => this.onTicketUpdate(ticket),
    },
    {
      id: 2,
      label: "Delete",
      action: (ticket: Ticket) => this.deleteTicket(ticket.id),
    },
  ];

  async getTickets(
    page: number = 1,
    append = false,
    search?: string,
    status?: string,
    priority?: string,
  ) {
    try {
      if (page === 1) this.loading = true;
      else this.loadingMore = true;

      const params: any = {
        include: "category,user,agent",
        titleSearch: search,
        status: status,
        priority: priority,
        page,
        per_page: 15,
      };

      const res = await firstValueFrom(this.ticketService.getTickets(params));

      if (!append || page === 1 || search) {
        this.ticketSubject.next(res.data as Ticket[]);
      } else {
        const current = this.ticketSubject.value;
        this.ticketSubject.next([...current, ...res.data]);
      }

      this.lastPage = !res.links?.next;
      this.currentPage = page;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
      this.loadingMore = false;
      this.filterTickets();
    }
  }

  deleteTicket(ticketId: number) {
    this.ticketService.deleteTicket(ticketId).subscribe({
      next: () => {
        const current = this.ticketSubject.value;
        this.ticketSubject.next(current.filter((t) => t.id !== ticketId));
        this.filterTickets();
        this.messageService.add({
          severity: "success",
          summary: "Ticket Deleted",
          detail: "Ticket deleted successfully",
        });
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete ticket",
        });
      },
    });
  }

  onTicketUpdate(ticket: Ticket) {
    this.visible = true;
    this.formMode = "update";
    this.ticketToUpdate = ticket;

    this.ticketForm.patchValue({
      status: ticket.status,
      priority: ticket.priority,
      category_id: ticket.includes?.category?.id ?? "",
      agent_id: ticket.includes?.agent?.id ?? null,
    });
  }

  onDrawerClosed() {
    this.visible = false;
    this.ticketToUpdate = undefined;
    this.ticketForm.reset({
      status: "open",
      priority: "low",
      category_id: "",
      agent_id: null,
    });
  }

  updateTicket() {
    if (!this.ticketToUpdate || this.ticketForm.invalid) return;

    const payload: any = {
      status: this.ticketForm.value.status,
      priority: this.ticketForm.value.priority,
      category_id: this.ticketForm.value.category_id,
      agent_id: this.ticketForm.value.agent_id || null,
    };

    this.ticketService
      .updateTicket(this.ticketToUpdate.id, payload)
      .subscribe({
        next: (response: any) => {
          const updated = (response.data as Ticket) ?? this.ticketToUpdate!;
          const current = this.ticketSubject.value;
          this.ticketSubject.next(
            current.map((t) => (t.id === updated.id ? updated : t)),
          );
          this.filterTickets();
          this.visible = false;
          this.onDrawerClosed();
          this.messageService.add({
            severity: "success",
            summary: "Ticket Updated",
            detail: "Ticket updated successfully",
          });
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update ticket",
          });
        },
      });
  }
}
