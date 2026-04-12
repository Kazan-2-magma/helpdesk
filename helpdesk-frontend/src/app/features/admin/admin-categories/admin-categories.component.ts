import { ChangeDetectorRef, Component, inject, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BasicTableThreeComponent } from '../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { TableDropdownComponent } from '../../../shared/components/common/table-dropdown/table-dropdown.component';

import { Category, DropDownContent, JsonApiResponse } from '../../../shared/interfaces';
import { CategoriesService } from '../services/admin/categories/categories.service';

@Component({
  selector: 'app-admin-categories',
  imports: [
    BasicTableThreeComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    DrawerComponent,
    TableDropdownComponent,
    DrawerModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {

  private categoryService = inject(CategoriesService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);

  @ViewChild('categoryDrawer') categoryDrawer!: DrawerComponent;

  dropDownContents: DropDownContent[] = [
    {
      id: 1,
      label: "Edit",
      action: (category: Category) => this.onCategoryUpdate(category)
    },
    {
      id: 2,
      label: "Delete",
      action: (category: Category) => this.deleteCategory(category.id)
    }
  ];

  searchText: string = "";
  private searchSubject = new Subject<string>();

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  categoryToUpdate?: Category;
  categoryForm!: FormGroup;
  currentPage = 1;
  loading = false;
  loadingMore = false;
  formMode: string = "add";
  lastPage = false;
  visible: boolean = false;

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(text => this.getCategories(this.currentPage, false, text));

    this.getCategories();
    this.formData();
  }

  onDrawerClosed() {
    this.formMode = 'add';
    this.categoryToUpdate = undefined;
    this.categoryForm.reset();
  }

  onSearchChange(text: string) {
    this.searchSubject.next(text);
    this.loading = true;
    this.getCategories(1, false,text);

  }

  formData() {
    this.categoryForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  addCategory() {
    this.loading = true;

    if (!this.categoryForm.valid) {
      this.loading = false;
      return;
    }

    this.categoryService.addCategory(this.categoryForm.value).subscribe({
      next: (response: JsonApiResponse) => {
        if (response.success) {
          const current = this.categoriesSubject.value;
          this.categoriesSubject.next([...current, response.data as Category]);
          this.visible = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Category Added',
            detail: 'Your category has been successfully added.'
          });

          this.onDrawerClosed();
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add category'
        });
      },
      complete: () => {
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  onLoadMore() {
    if (!this.lastPage && !this.loadingMore) {
      this.getCategories(this.currentPage + 1, true);
    }
  }

  async getCategories(page: number = 1, append = false, search?: string) {
    try {
      if (page === 1) this.loading = true;
      else this.loadingMore = true;

      if (search?.length === 0) {
        page = 1;
        search = undefined;
      }

      const params: any = {
        category: search,
        page,
        per_page: 15,
      };

      const res = await firstValueFrom(this.categoryService.getCategories(params));

      if (!append || page === 1 || search) {
        this.categoriesSubject.next(res.data as Category[]);
      } else {
        const current = this.categoriesSubject.value || [];
        this.categoriesSubject.next([...current, ...res.data]);
      }

      this.lastPage = !res.links?.next;
      this.currentPage = page;

    } catch (err) {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load categories'
      });
    } finally {
      this.loading = false;
      this.loadingMore = false;
    }
  }

  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response: JsonApiResponse) => {
        const current = this.categoriesSubject.value;
        this.categoriesSubject.next(current.filter(c => c.id !== categoryId));
        this.messageService.add({
          severity: 'success',
          summary: "Category Deleted",
          detail: "Category deleted successfully"
        });
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete category'
        });
      }
    });
  }

  onCategoryUpdate(category: Category) {
    this.visible = true;
    this.formMode = "update";
    this.categoryToUpdate = category;
    this.categoryForm.patchValue(category);
  }

  updateCategory(category: Category) {
    this.loading = true;

    this.categoryService.updateCategory(category.id, this.categoryForm.value).subscribe({
      next: (response: JsonApiResponse) => {
        if (response.success) {
          const updatedCategory = response.data as Category;
          const current = this.categoriesSubject.value;
          const updatedList = current.map(c => c.id === category.id ? updatedCategory : c);
          this.categoriesSubject.next([...updatedList]);
          this.messageService.add({
            severity: 'success',
            summary: "Category Updated",
            detail: "Category updated successfully"
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update category'
        });
      },
      complete: () => {
        this.loading = false;
        this.loadingMore = false;
        this.visible = false;
        this.onDrawerClosed();
      }
    });
  }
}
