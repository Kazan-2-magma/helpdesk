import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropDownContent, Ticket } from '../../../../shared/interfaces';
import { BasicTableThreeComponent } from '../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component';
import { TableDropdownComponent } from '../../../../shared/components/common/table-dropdown/table-dropdown.component';
import { AdminTicketServiceService } from '../../services/admin-ticket-service.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { TICKET_STATUS, TICKET_STATUS_LIST } from '../../../../shared/enum/enumes';
import { FilterButtonsComponent } from '../../../../shared/components/filter-buttons/filter-buttons.component';

@Component({
  selector: 'app-admin-tickets',
  imports: [
    CommonModule,
    FormsModule,
    TableDropdownComponent,
    BasicTableThreeComponent,
    FilterButtonsComponent,
  ],
  templateUrl: './admin-tickets.html',
  styleUrl: './admin-tickets.css'
})

export class AdminTickets implements OnInit {

  ngOnInit(): void {

    this.ticketStatus = TICKET_STATUS_LIST
    this.ticketStatus.unshift({ label: 'All', value: undefined, active: true })
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(text => this.getTickets(this.currentPage, false, text));

    this.getTickets().finally(() => this.filterTickets());
    

    
  }



  loading: boolean = false;
  loadingMore = false;
  lastPage = false;
  currentPage = 1;
  totalTickets = 0;
  resolvedTickets = 0;
  openTickets = 0;
  closedTickets = 0;
  ticketStatus: any[] = [];

  private searchSubject = new Subject<string>();
  searchText: string = "";
  
  private ticketService = inject(AdminTicketServiceService);
  private ticketSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketSubject.asObservable();

  onLoadMore() {
    if (!this.loadingMore && !this.lastPage) {
      this.getTickets(this.currentPage + 1, true);
    }
  }

  onSearchChange(text: string) {
    console.log("Text From onSearchChange ",text)
    this.searchSubject.next(text);
    this.getTickets(1, true);
  }

  onFilterChange(filter: string) {
    if (filter === "All") {
      this.getTickets()
    } else {
      this.getTickets(1, false, undefined, filter.toLowerCase())
    }
  }

  filterTickets() {
    console.log(this.ticketSubject.getValue())
    const data = this.ticketSubject.getValue()
    this.openTickets = data.filter((ticket) => ticket.status === TICKET_STATUS.OPEN).length
    this.resolvedTickets = data.filter((ticket) => ticket.status === TICKET_STATUS.RESOLVED).length
    this.closedTickets = data.filter((ticket) => ticket.status === TICKET_STATUS.CLOSED).length
    this.totalTickets = data.length;
  }

  
  dropDownContents: DropDownContent[] = [
    {
      id: 1,
      label: "Edit",
      action: (ticket : Ticket) => console.log(ticket)
    },
    {
      id: 2,
      label: "Delete",
      action: (ticket: Ticket) => console.log(ticket)
    }
  ]

  async getTickets(page: number = 1, append = false,search?:string,status?:string,priority?:string) {

    try {

      if (page === 1) this.loading = true;
      else this.loadingMore = true;

      
      
      if (search?.length === 0) {
        page = 1;
        search = undefined;
      }


      const params: any = {
        include: "category,user,agent",
        titleSearch: search,
        status: status,
        priority : priority,
        page,
        per_page:15
      }
      
      
      const res = await firstValueFrom(this.ticketService.getTickets(params));
      

      if (!append || page === 1 || search) {
        this.ticketSubject.next(res.data as Ticket[])
      } else {
        const current = this.ticketSubject.value;
        this.ticketSubject.next([...current,...res.data])
      }



      this.lastPage = !res.links?.next;
      this.currentPage = page;

      status = undefined;



    } catch (err) {
      console.error(err)
    }
    // this.ticketService.getTickets().subscribe({
    //   next: (response) => {
    //     this.ticketSubject.next([response.data as Ticket[]])
    //   },
    // })
  }


  
}
