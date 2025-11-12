import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Drawer, initFlowbite } from 'flowbite';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-drawer',
  imports: [
    ButtonModule,
    DrawerModule
  ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent implements AfterViewInit,OnInit {

  @Input() buttonLabel: string = "";
  @Input() drawerHeader: string = "";
  @Input() data: any | null = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() dataChanegs = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();



  
  toggle() {
    // this.voidCallback?.();
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }


  ngOnInit(): void {
    console.group("Drawer Visibile",this.visible)
  }


  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.closed.emit(); 
 
  }
  

  

  ngAfterViewInit(): void {
    this.dataChanegs.emit(this.data)
  }



  
}
