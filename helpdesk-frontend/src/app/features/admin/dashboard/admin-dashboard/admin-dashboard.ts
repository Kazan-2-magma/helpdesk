import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { FaqService } from '../../services/faqs/faqs';
import { tap } from 'rxjs';
import { Faq, PaginatedResponse } from '../../../../shared/interfaces';


@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit{
  private faqService = inject(FaqService);
  private router = inject(Router);

  faqs: Faq[] = [];
  currentPage = 1;
  lastPage = 1;

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs() {
    this.faqService.getFaqs().subscribe((res: PaginatedResponse<Faq>) => {
      this.faqs = res.data;
      this.currentPage = res.meta.current_page;
      this.lastPage = res.meta.last_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.lastPage) {
      // this.loadFaqs(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      // this.loadFaqs(this.currentPage - 1);
    }
  }

}
