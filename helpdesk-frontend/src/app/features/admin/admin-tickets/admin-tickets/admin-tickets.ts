import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
import { DropDownContent, Ticket } from "../../../../shared/interfaces";
import { BasicTableThreeComponent } from "../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { TableDropdownComponent } from "../../../../shared/components/common/table-dropdown/table-dropdown.component";
import { AdminTicketServiceService } from "../../services/admin/tickets/admin-ticket-service.service";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  Subject,
  takeUntil,
} from "rxjs";
import {
  TICKET_STATUS,
  TICKET_STATUS_LIST,
} from "../../../../shared/enum/enumes";
import { FilterButtonsComponent } from "../../../../shared/components/filter-buttons/filter-buttons.component";
import { MessageService } from "primeng/api";
import { tick } from "@angular/core/testing";

@Component({
  selector: "app-admin-tickets",
  imports: [
    CommonModule,
    FormsModule,
    TableDropdownComponent,
    BasicTableThreeComponent,
    FilterButtonsComponent,
  ],
  providers: [MessageService],
  templateUrl: "./admin-tickets.html",
  styleUrl: "./admin-tickets.css",
})
export class AdminTickets implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.ticketStatus = TICKET_STATUS_LIST;

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
  formMode: string = "add";
  ticketToUpdate?: Ticket;
  loginForm!: FormGroup;

  private searchSubject = new Subject<string | undefined>();
  searchText: string = "";

  private ticketService = inject(AdminTicketServiceService);
  private ticketSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketSubject.asObservable();
  private messageService = inject(MessageService);

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
    console.log(this.ticketSubject.getValue());
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

      status = undefined;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
      this.loadingMore = false;
    }
  }

  deleteTicket(ticketId: number) {
    this.ticketService.deleteTicket(ticketId).subscribe({
      next: (response) => {
        const current = this.ticketSubject.value;
        this.ticketSubject.next(current.filter((t) => t.id !== ticketId));
        this.messageService.add({
          severity: "success",
          summary: "FAQ Deleted",
          detail: "FAQ deleted Successfully",
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onTicketUpdate(ticket: Ticket) {
    this.visible = true;

    this.formMode = "update";

    this.ticketToUpdate = ticket;

    console.log("Ticket FROM EDIT", ticket);

    this.loginForm.patchValue(ticket);
  }
}
