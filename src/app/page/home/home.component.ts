import { Component } from '@angular/core';
import { TopHeaderComponent } from '../../ui/top-header/top-header.component';
import { CurrentDateComponent } from '../../ui/current-date/current-date.component';
import { GraphComponent } from "../../ui/graph/graph.component";
import { WidgetCardsComponent } from "../../ui/widget-cards/widget-cards.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent, CurrentDateComponent, GraphComponent, WidgetCardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
