import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-buttons',
  imports: [
    CommonModule
  ],
  templateUrl: './filter-buttons.component.html',
  styleUrl: './filter-buttons.component.css'
})
export class FilterButtonsComponent {

  @Input() filtersList: any[] = []
  @Output() activeFilter = new EventEmitter<string>();

  toggle(item: any) {
    this.filtersList.map((i) => i.label === item.label ? i.active = true : i.active = false);
    this.activeFilter.emit(item.label);
  }


}
