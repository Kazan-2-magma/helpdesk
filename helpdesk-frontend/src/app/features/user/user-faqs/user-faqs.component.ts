import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Faq, PaginatedResponse } from "../../../shared/interfaces";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { AccordionComponent } from "../../../shared/components/accordion/accordion.component";
import { FaqService } from "../../admin/services/admin/faqs/faqs";

@Component({
  selector: "app-user-faqs",
  imports: [CommonModule, AccordionComponent],
  templateUrl: "./user-faqs.component.html",
  styleUrl: "./user-faqs.component.css",
})
export class UserFaqsComponent implements OnInit {
  private faqService = inject(FaqService);

  private faqsSubject = new BehaviorSubject<Faq[]>([]);
  faqs$ = this.faqsSubject.asObservable();

  loading = false;
  currentPage = 1;
  lastPage = false;

  ngOnInit(): void {
    this.getFaqs();
  }

  async getFaqs(page = 1) {
    try {
      this.loading = true;
      const params = { page, per_page: 10 };
      const response = await firstValueFrom(this.faqService.getFaqs(params));

      if (page === 1) {
        this.faqsSubject.next(response.data);
      } else {
        const current = this.faqsSubject.value;
        this.faqsSubject.next([...current, ...response.data]);
      }

      this.currentPage = page;
      this.lastPage = this.currentPage >= (response.meta?.last_page || 1);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      this.loading = false;
    }
  }

  loadMore() {
    if (!this.loading && !this.lastPage) {
      this.getFaqs(this.currentPage + 1);
    }
  }
}
