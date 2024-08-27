import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CallenderComponent } from '../../ui/callender/callender.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserTableComponent } from "../../ui/user-table/user-table.component";
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-callender-page',
  standalone: true,
  imports: [CommonModule, CallenderComponent, ButtonModule, CardModule, UserTableComponent, TabMenuModule, RippleModule],
  providers: [MessageService],
  templateUrl: './edit-callender-page.component.html',
  styleUrl: './edit-callender-page.component.css'
})
export class EditCallenderPageComponent implements OnInit {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  traineeDiv = true;
  holidayDiv = false;
  batchDiv = false;

  totalFullHolidays: number = 0;
  totalHalfHolidays: number = 0;

  ngOnInit() {
      this.items = [
          { label: 'Trainee Control', icon: 'pi pi-user-edit', command: () => this.onTraineeClick() },
          { label: 'Calendar', icon: 'pi pi-calendar-plus', command: () => this.onCalendarClick() },
          { label: 'Batch Control', icon: 'pi pi-users', command: () => this.onBatchClick() }
          
      ];
      this.activeItem = this.items[0];
  }

  onTraineeClick() {
    console.log('Trainee tab clicked');
    this.holidayDiv = false;
    this.traineeDiv = true;
    this.batchDiv = false;
  }

  onCalendarClick() {
    console.log('Calendar tab clicked');
    this.holidayDiv = true;
    this.traineeDiv = false;
    this.batchDiv = false;
  }

  onBatchClick() {
    console.log('Batch tab clicked');
    this.holidayDiv = false;
    this.traineeDiv = false;
    this.batchDiv = true;
  }

  constructor(private messageService: MessageService) { }

  downloadAttendanceReport() {

      const reportData = {
          // ... report data
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' }); // Create a Blob from the report data
      const url = URL.createObjectURL(blob);  // Create a URL for the Blob
      const a = document.createElement('a');  // Create a download link
      a.href = url;
      a.download = 'attendance_report.json';  // Set the desired filename
      a.click();  // Trigger the download
      window.URL.revokeObjectURL(url);  // Clean up
      this.messageService.add({ severity: 'success', summary: 'Report Downloaded', detail: 'Attendance report has been downloaded successfully.' });  // Show a success message using MessageService
  }
  
}