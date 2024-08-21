import { Component, Input, OnInit } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule, } from 'primeng/table';
import { NgClass, NgIf } from '@angular/common';
import { TopHeaderComponent } from '../top-header/top-header.component';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { DatePipe } from '@angular/common';
import { SideUserProfileComponent } from "../../Features/side-user-profile/side-user-profile.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TopHeaderComponent, AutoCompleteModule, FormsModule, CalendarModule, MultiSelectModule, TableModule, NgClass, NgIf, SideUserProfileComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  private datePipe = new DatePipe('en-US');
  selectedTraineeCode: string ="";
  isSideProfileVisible?: boolean |undefined = false;
  selectedDate: Date | undefined;
  constructor(private traineeAttendancelogService: TraineeAttendancelogService) {}

  @Input() statusFilter: string = '';

  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] = [];
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


  filteredTrainees: TraineeAttendanceLogs[] = [];
  originalTraineeLogs: TraineeAttendanceLogs[] = [];
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
    this.setDefaultDateFilter();
  }

  getTraineeAttendanceLogs() {
    this.traineeAttendancelogService.getTraineeAttendanceLogs().subscribe(
      (response: any) => {
        if (response &&response.attendanceLogs && Array.isArray(response.attendanceLogs)) {
        
          this.originalTraineeLogs = response.attendanceLogs;
          this.filteredTrainees = [...this.originalTraineeLogs];
          this.filterByDate();
        } else {
          console.error('API did not return an array:', response);
          this.originalTraineeLogs = [];
          this.filteredTrainees = [];
        }
      },
      (error) => {
        console.error('Error fetching trainee attendance logs:', error);
        this.originalTraineeLogs = [];
        this.filteredTrainees = [];
      }
    );
  }    

  // applyStatusFilter() {
  //   if (this.statusFilter) {
  //     this.traineeLogs = this.traineeLogs.filter(trainee => trainee.status === this.statusFilter);
  //   }
    
  // }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    this.filterTrainees(query);
  }
  

  filterTrainees(query: string): void {
    if (query) {
      this.filteredTrainees = this.originalTraineeLogs.filter(trainee =>
        trainee.name && trainee.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // Reset to the original data if the query is empty
      this.filteredTrainees = [...this.originalTraineeLogs]; // Changed to use originalTraineeLogs
      this.filterByDate();
      
    }
  }
  
  
  
  filterByDate(): void {
    if (this.selectedDate) {
      // Transform the selected date to a string format (yyyy-MM-dd) for comparison
      const selectedDateString = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';
      // Filter the trainees based on the selected date
      this.filteredTrainees = this.originalTraineeLogs.filter(trainee =>
        this.datePipe.transform(new Date(trainee.date), 'yyyy-MM-dd') === selectedDateString
      );
    } else {
      // If no date is selected, reset to original data
      this.filteredTrainees = [...this.originalTraineeLogs];
    }
  }

  setDefaultDateFilter(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.selectedDate = yesterday;
    this.filterByDate(); // Apply the filter for yesterday's date by default
  }

  // filterByStatus(selectedOptions: any[]) {
  //   const statusCodes = selectedOptions.filter(option => !option.code.startsWith('Batch')).map(option => option.code);
  //   const batchCodes = selectedOptions.filter(option => option.code.startsWith('Batch')).map(option => option.code);

  //   if ((statusCodes.includes('ALL') || statusCodes.length === 0) && batchCodes.length === 0) {
  //     this.traineeLogs = this.traineeLogs;
  //   } else {
  //     this.traineeLogs = this.traineeLogs.filter(trainee =>
  //       (statusCodes.length === 0 || statusCodes.includes(trainee.status || '')) &&
  //       (batchCodes.length === 0 || batchCodes.includes(trainee.ilp || ''))
  //     );
  //   }
    
  // }


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

  getCheckinTimeClass(time: string, status: string): string {
    if (status === 'On Leave') {
      return ''; // No special class for absent
    }
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

  getCheckoutTimeClass(logOuttime: string, status: string): string {
    if (status === 'On Leave') {
      return ''; // No special class for absent
    }
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

  showSideProfile(employeeCode: string): void {
    this.selectedTraineeCode = employeeCode;
    this.isSideProfileVisible = true;  // Show the side profile when an employee is clicked
  }
  closeSideProfile(): void {
    this.isSideProfileVisible = false;  // Set to false when hiding the side profile
  }

  getDisplayTime(time: string, status: string): string {
    if (status === 'On Leave') {
      return '-'; // Display '-' for absent status
    }
    return time ? this.formatTime(time) : '-';
  }
  
}
