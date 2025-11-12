import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { TableDropdownComponent } from '../../../common/table-dropdown/table-dropdown.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@Component({
  selector: 'app-basic-table-three',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    ProgressSpinnerModule
  ],
  templateUrl: './basic-table-three.component.html',
})
export class BasicTableThreeComponent {

  @Input() data: any[] = [];
  @Input() loadingMore: boolean = false;


  @Output() loadMore = new EventEmitter<void>();

  onScrollDown() {
    if (!this.loadingMore) {
      this.loadMore.emit();
    }
  }

  // @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  // @ContentChild('tableRow', { static: false }) rowTemplate!: TemplateRef<any>;

  // @Input() data: any[] = [];
  // @Input() loadData!: (page: number, searchText?: string) => Promise<any[]>;

  // page = 1;
  // loadingMore = false;
  // endReached = false;

  // async ngOnInit() {
  //   if (this.loadData) {
  //     const items = await this.loadData(this.page);
  //     this.data = items;
  //   }
  // }

  // async onTableScroll(event: any): Promise<void> {
  //   const { scrollTop, scrollHeight, offsetHeight } = event.target;

  //   if (scrollHeight - (scrollTop + offsetHeight) < 100 && !this.loadingMore && !this.endReached) {
  //     this.loadingMore = true;
  //     this.page++;

  //     const newItems = await this.loadData(this.page);

  //     if (newItems.length === 0) {
  //       this.endReached = true;
  //     } else {
  //       this.data.push(...newItems);
  //     }

  //     this.loadingMore = false;
  //   }
  // }


}
