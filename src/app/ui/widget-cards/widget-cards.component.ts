import { Component } from '@angular/core';
import { WidgetCardComponent } from "../widget-card/widget-card.component";

@Component({
  selector: 'app-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent],
  templateUrl: './widget-cards.component.html',
  styleUrl: './widget-cards.component.css'
})
export class WidgetCardsComponent {

}
