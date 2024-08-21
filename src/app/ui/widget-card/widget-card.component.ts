import { NgClass } from '@angular/common';
import { Component,ElementRef,EventEmitter,HostListener,Input, Output, output } from '@angular/core';
import { CardModule } from "primeng/card";
@Component({
  selector: 'app-widget-card',
  standalone: true,
  imports: [CardModule, NgClass],
  templateUrl: './widget-card.component.html',
  styleUrl: './widget-card.component.css'
})
export class WidgetCardComponent {
@Input() header_icon!: string ;
@Input() card_number!: Number;
@Input() card_header!: string;
@Input() isActive: boolean = false;
@Output() onBtnClick = new EventEmitter<{isClicked:boolean, header:string}>();

constructor(private elementRef: ElementRef) {}

onClick(){
    this.onBtnClick.emit({isClicked: true,header: this.card_header});
    this.isActive = !this.isActive;
}

@HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
  // If the click is outside the component, deactivate the card
  if (!this.elementRef.nativeElement.contains(event.target)) {
    this.isActive = false;
  }
}

}