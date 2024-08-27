import { Component } from '@angular/core';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent, RouterLink, RouterOutlet],
  templateUrl: './user-widget-cards.component.html',
  styleUrl: './user-widget-cards.component.css'
})
export class UserWidgetCardsComponent {

}
