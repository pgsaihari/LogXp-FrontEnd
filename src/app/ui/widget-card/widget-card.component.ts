import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-widget-card',
  standalone: true,
  imports: [CardModule,ButtonModule],
  templateUrl: './widget-card.component.html',
  styleUrl: './widget-card.component.css'
})
export class WidgetCardComponent {
  card_number: Number = 456;
  header_icon: string = 'fa-solid fa-users employee-icon';
  card_header: string = 'Total Trainees';
}
