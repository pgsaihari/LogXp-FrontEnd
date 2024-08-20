import { Component, ViewChild } from '@angular/core';
import { TopHeaderComponent } from '../../ui/top-header/top-header.component';
import { CurrentDateComponent } from '../../ui/current-date/current-date.component';
import { GraphComponent } from "../../ui/graph/graph.component";
import { WidgetCardsComponent } from '../../Features/widget-cards/widgetcards/widget-cards.component';
import { TableComponent } from "../../ui/table/table.component";
import { CommonModule } from '@angular/common';
import { WidgetTableComponent } from "../../ui/widget-table/widget-table.component";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent, CurrentDateComponent, GraphComponent, WidgetCardsComponent, TableComponent, CommonModule, WidgetTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild(WidgetTableComponent) widgetTableComponent?: WidgetTableComponent;
  tableHeader!: string
  toggleField: string = 'Check-Out'; // Initialize default value
  isVisible:boolean=false;
  handleWidgetClick(dataReceived: { isClicked: boolean, header: string }) {
    // Update visibility and tableHeader based on the widget clicked
    this.isVisible = true;
    this.tableHeader = dataReceived.header;
  
    // Conditionally update toggleField based on the clicked widget card's header
    if (dataReceived.header === 'On Time' || dataReceived.header === 'Late Arrivals') {
      this.toggleField = 'Check-In';
    } else if (dataReceived.header === 'Early Departures') {
      this.toggleField = 'Check-Out';
    } else {
      this.toggleField = 'Monthly Leave Percentage';
    }
  
    // Trigger filtering based on the updated tableHeader
    this.widgetTableComponent?.filterTrainees('');
  }
  
}  