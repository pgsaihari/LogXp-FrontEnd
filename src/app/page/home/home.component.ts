import { Component, ViewChild } from '@angular/core';
import { TopHeaderComponent } from '../../shared/top-header/top-header.component';
import { CurrentDateComponent } from '../../ui/current-date/current-date.component';
import { GraphComponent } from "../../ui/graph/graph.component";
import { WidgetCardsComponent } from '../../Features/widget-cards/widgetcards/widget-cards.component';
import { TableComponent } from "../../ui/table/table.component";
import { CommonModule } from '@angular/common';
import { WidgetTableComponent } from "../../ui/widget-table/widget-table.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { SpinnerService } from '../../core/services/spinner-control.service';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { Batch } from '../../core/model/batch.model';
//import for the spinner , which runs by the interceptor
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent, CurrentDateComponent, GraphComponent, WidgetCardsComponent, TableComponent, CommonModule, WidgetTableComponent,SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  selectedBatch!: Batch;

  onBatchSelected(batch: Batch) {
    this.selectedBatch = batch;
  }

  tableHeader: string = 'Working Days';
  toggleField: string = 'Check-Out'; // Initialize default value
  isVisible:boolean=false;
  
  constructor(public spinnerService:SpinnerService){}

  handleWidgetClick(dataReceived: {header: string }) {
    // Update visibility and tableHeader based on the widget clicked
    // this.isVisible = true;
    this.tableHeader = dataReceived.header;
      // Check if the header is 'Working Days'
    if (this.tableHeader === 'Working Days') {
      this.isVisible = false;  // Do not show the table
    } else {
      this.isVisible = true;   // Show the table for other headers
    }
  
    // Conditionally update toggleField based on the clicked widget card's header
    if (this.tableHeader === 'On Time' || this.tableHeader === 'Late Arrivals') {
      this.toggleField = 'Check-In';
    } else if (this.tableHeader === 'Early Departures') {
      this.toggleField = 'Check-Out';
    } else if (this.tableHeader === 'Absent') {
    this.toggleField = 'Monthly Leave Percentage';
    }
  }
}