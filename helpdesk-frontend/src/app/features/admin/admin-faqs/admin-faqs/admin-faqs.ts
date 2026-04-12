import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { BasicTableThreeComponent } from "../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { AccordionComponent } from "../../../../shared/components/accordion/accordion.component";
import {
  Category,
  DropDownContent,
  Faq,
  JsonApiResponse,
} from "../../../../shared/interfaces";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  Subject,
} from "rxjs";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DrawerComponent } from "../../../../shared/components/drawer/drawer.component";
import { TableDropdownComponent } from "../../../../shared/components/common/table-dropdown/table-dropdown.component";
import { DrawerModule } from "primeng/drawer";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { FaqService } from "../../services/admin/faqs/faqs";
import { CategoriesService } from "../../services/admin/categories/categories.service";

@Component({
  selector: "app-admin-faqs",
  imports: [
    BasicTableThreeComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    DrawerComponent,
    TableDropdownComponent,
    DrawerModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./admin-faqs.html",
  styleUrl: "./admin-faqs.css",
})
export class AdminFaqs implements OnInit {
  private faqService = inject(FaqService);
  private categoryService = inject(CategoriesService);
  private formBulder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild("faqDrawer") faqDrawer!: DrawerComponent;

  dropDownContents: DropDownContent[] = [
    {
      id: 1,
      label: "Edit",
      action: (faq: Faq) => this.onFaqUpdate(faq),
    },
    {
      id: 2,
      label: "Delete",
      action: (faq: Faq) => this.deleteFaq(faq.id),
    },
  ];

  searchText: string = "";
  searchLoading: boolean = false;
  private searchSubject = new Subject<string>();

  private faqsSubject = new BehaviorSubject<Faq[]>([]);
  faqs$ = this.faqsSubject.asObservable();

  categories: Category[] = [];
  faqToUpdate?: Faq;
  loginForm!: FormGroup;
  currentPage = 1;
  loading = false;
  loadingMore = false;
  formMode: string = "add";
  lastPage = false;
  drawer: any;

  visible: boolean = false;

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => this.getFaqs(this.currentPage, false, text));

    this.getFaqs();
    this.formData();
    this.getCategories();
  }

  onDrawerClosed() {
    this.formMode = "add";
    this.faqToUpdate = undefined;
    this.loginForm.reset();
  }

  onSearchChange(text: string) {
    this.searchLoading = true;
    this.loading = true;
    this.searchSubject.next(text);
    this.getFaqs(1, false, text);
  }

  formData() {
    this.loginForm = this.formBulder.group({
      question: ["", Validators.required],
      answer: ["", Validators.required],
      category_id: ["", Validators.required],
    });
  }

  addFAQ() {
    this.loading = true;

    if (!this.loginForm.valid) return;
    this.faqService.addFaq(this.loginForm.value).subscribe({
      next: (response: JsonApiResponse) => {
        if (response.success) {
          const current = this.faqsSubject.value;
          this.faqsSubject.next([...current, response.data as Faq]);
          this.visible = false;

          this.messageService.add({
            severity: "success",
            summary: "FAQ Added",
            detail: "Your FAQ has been successfully added.",
          });
        }
      },
      error: ( err : any) => {
        console.log(err);
        
      },
      complete: () => {
        this.loading = false;
        this.loadingMore = false;
      },
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data as Category[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onLoadMore() {
    console.log(this.lastPage);
    if (!this.lastPage && !this.loadingMore) {
      this.getFaqs(this.currentPage + 1, true);
    }
  }

  async getFaqs(page: number = 1, append = false, search?: string) {
    try {
      if (page === 1) this.loading = true;
      else this.loadingMore = true;
      this.cdr.markForCheck();

      if (search?.length === 0) {
        page = 1;
        search = undefined;
      }

      const params: any = {
        include: "category",
        q: search,
        page,
        per_page: 15,
      };

      const res = await firstValueFrom(this.faqService.getFaqs(params));

      if (!append || page === 1 || search) {
        this.faqsSubject.next(res.data as Faq[]);
      } else {
        const current = this.faqsSubject.value || [];
        this.faqsSubject.next([...current, ...res.data]);
      }

      this.lastPage = !res.links?.next;
      this.currentPage = page;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
      this.loadingMore = false;
      this.searchLoading = false;
      this.cdr.markForCheck();
    }
  }

  deleteFaq(faqId: number) {
    this.faqService.deleteFaq(faqId).subscribe({
      next: (response) => {
        const current = this.faqsSubject.value;
        this.faqsSubject.next(current.filter((f) => f.id !== faqId));
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

  onFaqUpdate(faq: Faq) {
    this.visible = true;

    this.formMode = "update";

    this.faqToUpdate = faq;

    console.log("FAQ FROM EDIT", faq);

    this.loginForm.patchValue(faq);
  }

  updateFaq(faq: Faq) {
    console.log(this.loginForm.value);

    this.faqService.updateFaq(faq.id, this.loginForm.value).subscribe({
      next: (response: JsonApiResponse) => {
        if (response.success) {
          const updatedFaq = response.data as Faq;
          const current = this.faqsSubject.value;
          const updatedList = current.map((f) =>
            f.id === faq.id ? updatedFaq : f,
          );
          this.faqsSubject.next([...updatedList]);
          this.messageService.add({
            severity: "success",
            summary: "FAQ updated",
            detail: "FAQ updated Successfully",
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loading = false;
        this.loadingMore = false;
        this.visible = false;
        this.onDrawerClosed();
      },
    });
  }
}
