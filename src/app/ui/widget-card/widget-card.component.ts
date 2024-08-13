import { Component,Input } from '@angular/core';
import { CardModule } from "primeng/card";
@Component({
  selector: 'app-widget-card',
  standalone: true,
  imports: [CardModule],
  templateUrl: './widget-card.component.html',
  styleUrl: './widget-card.component.css'
})
export class WidgetCardComponent {
  @Input() header_icon!: string ;
@Input() card_number!: Number;
@Input() card_header!: string;
}
