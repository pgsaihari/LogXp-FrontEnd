import { Component, Input, OnInit } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule, } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { NgClass, NgIf } from '@angular/common';
import { TopHeaderComponent } from '../top-header/top-header.component';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TopHeaderComponent,AutoCompleteModule, FormsModule,CalendarModule, MultiSelectModule, TableModule, NgClass, NgIf],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  private datePipe = new DatePipe('en-US');

  constructor(private traineeAttendancelogService: TraineeAttendancelogService) {}

  @Input() statusFilter: string = '';

  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] = [];
  date2: Date | undefined;
  todayDate: string | undefined;
  selectedOptions: any[] = [];

  filterOptions = [
    { name: 'All', code: 'ALL' },
    { name: 'Present', code: 'Present' },
    { name: 'Half Day', code: 'Half Day' },
    { name: 'Absent', code: 'Absent' },
    { name: 'Late Arrival', code: 'Late Arrival' },
    { name: 'Batch 2', code: 'Batch 2' },
    { name: 'Batch 3', code: 'Batch 3' },
    { name: 'Batch 4', code: 'Batch 4' },
  ];

  traineeLogs: TraineeAttendanceLogs[] = [];
  // filteredTrainees: TraineeAttendanceLogs[] = [];
  showTimeColumns: boolean = true;

  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd-MM-yyyy') || '';
  }

  formatTime(dateString: string): string {
    return this.datePipe.transform(dateString, 'hh:mm a') || '';
  }

  ngOnInit() {
    this.todayDate = new Date().toISOString().split('T')[0];
    this.getTraineeAttendanceLogs(); // Fetch data from the API
  }

  getTraineeAttendanceLogs() {
    this.traineeAttendancelogService.getTraineeAttendanceLogs().subscribe(
      (response: any) => {
        if (response && response.attendanceLogs && Array.isArray(response.attendanceLogs)) {
          this.traineeLogs = response.attendanceLogs;
        } else {
          console.error('API did not return an array:', response);
          this.traineeLogs = [];
        }
      },
      (error) => {
        console.error('Error fetching trainee attendance logs:', error);
        this.traineeLogs = [];
      }
    );
  }    

  applyStatusFilter() {
    if (this.statusFilter) {
      this.traineeLogs = this.traineeLogs.filter(trainee => trainee.status === this.statusFilter);
    }
    this.checkTimeColumnsVisibility();
  }

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
    // this.filterTrainees(event.query);
  }

  filterTrainees(query: string): void {
    if (query) {
      this.traineeLogs = this.traineeLogs.filter(trainee =>
        Object.values(trainee).some(value =>
          value?.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      this.traineeLogs = this.traineeLogs;
    }
    this.checkTimeColumnsVisibility();
  }

  filterByDate() {
    if (this.date2) {
      const selectedDateString = this.date2.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      console.log('Selected Date:', selectedDateString);
      this.traineeLogs = this.traineeLogs.filter(trainee => trainee.date === selectedDateString);
    } else {
      this.traineeLogs = this.traineeLogs;
    }
    this.checkTimeColumnsVisibility();
  }

  filterByStatus(selectedOptions: any[]) {
    const statusCodes = selectedOptions.filter(option => !option.code.startsWith('Batch')).map(option => option.code);
    const batchCodes = selectedOptions.filter(option => option.code.startsWith('Batch')).map(option => option.code);

    if ((statusCodes.includes('ALL') || statusCodes.length === 0) && batchCodes.length === 0) {
      this.traineeLogs = this.traineeLogs;
    } else {
      this.traineeLogs = this.traineeLogs.filter(trainee =>
        (statusCodes.length === 0 || statusCodes.includes(trainee.status || '')) &&
        (batchCodes.length === 0 || batchCodes.includes(trainee.ilp || ''))
      );
    }
    this.checkTimeColumnsVisibility();
  }

  isAbsent(status?: string): boolean {
    return status === 'Absent';
  }

  checkTimeColumnsVisibility(): void {
    if (Array.isArray(this.traineeLogs)) {
      this.showTimeColumns = this.traineeLogs.some(trainee => !this.isAbsent(trainee.status));
    } else {
      console.error('traineeLogs is not an array:', this.traineeLogs);
      this.showTimeColumns = true; // Default behavior if data is corrupted
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'status-present';
      case 'On Leave':
        return 'status-absent';
      case 'Late Arival' :
        case 'Early Departure':
          case 'Late Arival and Early Departure':
        return 'status-late-arrival';
      default:
        return '';
    }
  }

  getCheckinTimeClass(time: string): string {
    if (!time) return '';
    // Extract the time part (08:58:18) from the datetime string
    const timePart = time.split('T')[1];
    // Split the time part into hours and minutes
    const hours = parseInt(timePart.slice(0, 2), 10);
    const minutes = parseInt(timePart.slice(3, 5), 10);

    if (hours === 0 && minutes === 0) {
      return 'time-on-leave'; // Red for 00:00
    } else if (hours < 9 || (hours === 9 && minutes === 0)) {
      return 'time-on-time'; // Green for less than 9:00
    } else {
      return 'time-late'; // Yellow for later than 9:00
    }
  }

  getCheckoutTimeClass(logOuttime: string): string {
    if (!logOuttime) return '';
   
    // Extract the time part (HH:MM:SS) from the datetime string
    const timePart = logOuttime.split('T')[1];
    const [hours] = timePart.split(':').map(Number);
 
    if (hours < 18) { // Before 6 PM
      return 'time-late'; // Yellow background
    } else {
      return ''; // No additional class if after 6 PM
    }
  }
  
}
