import { Component } from '@angular/core';
import { TopHeaderComponent } from '../../ui/top-header/top-header.component';
import { CurrentDateComponent } from '../../ui/current-date/current-date.component';
import { GraphComponent } from "../../ui/graph/graph.component";
import { WidgetCardsComponent } from '../../Features/widget-cards/widgetcards/widget-cards.component';
import { TableComponent } from "../../ui/table/table.component";
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent, CurrentDateComponent, GraphComponent, WidgetCardsComponent, TableComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // constructor(public serv:InteractiveCardService){}
  isVisible:boolean=false;
  handleWidgetClick(a: boolean) {
    if (a) {
      this.isVisible = !this.isVisible;
    }
  }
}
