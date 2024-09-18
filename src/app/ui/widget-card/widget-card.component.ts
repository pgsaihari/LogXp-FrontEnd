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
  @Input() header_icon!: string;
  @Input() card_number!: number;
  @Input() card_header!: string;
  @Input() isActive = false;
  @Output() onBtnClick = new EventEmitter<{header: string}>();

  constructor(private elementRef: ElementRef) {}
  /**
   * Emits the `card_header` to the parent component when the card is clicked.
   * This function is triggered by the (click) event on the card.
   */
  onClick() {
    this.onBtnClick.emit({header: this.card_header });
  }
  
    /**
   * Listens for clicks inside the card component. If the click happens inside
   * the card, the `isActive` property is set to `false`.
   * 
   * @param event The DOM event triggered by the user's click action.
   */

  @HostListener('document:click', ['$event'])
  onClickInside(event: Event) {
    if (this.elementRef.nativeElement.contains(event.target)) {
      this.isActive = false;
    }
  }
}