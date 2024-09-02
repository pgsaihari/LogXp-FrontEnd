import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import {

  AutoCompleteModule,
} from 'primeng/autocomplete';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TopHeaderComponent } from '../../shared/top-header/top-header.component';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { DatePipe } from '@angular/common';
import { SideUserProfileComponent } from '../../Features/side-user-profile/side-user-profile.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { SpinnerComponent } from "../spinner/spinner.component";
import { SpinnerService } from '../../core/services/spinner-control.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TopHeaderComponent,
    AutoCompleteModule,
    FormsModule,
    MatListModule,
    CalendarModule,
    MultiSelectModule,
    TableModule,
    NgClass,
    NgIf,
    NgFor,
    SideUserProfileComponent,
    OverlayPanelModule,
    DatePipe,
    SpinnerComponent
],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  private datePipe = new DatePipe('en-US');
  selectedTraineeCode: string = '';
  isSideProfileVisible?: boolean | undefined = false;
  selectedDate: Date | undefined;
  searchQuery: string = '';
  selectedStartDate: any;
  selectedEndDate: any;

  constructor(
    private traineeAttendancelogService: TraineeAttendancelogService,
    public spinnerService:SpinnerService,
    private elementRef: ElementRef, private renderer: Renderer2
  ) {}

  selectedItem: any;
  suggestions: any[] = [];
  todayDate: string | undefined;
  selectedOptions: any[] = [];
  yesterday: Date = new Date();
  selectedDateRange: Date[] = [];

  selectedStatuses: string[] = [];

  showList = false; // Controls the visibility of the mat-selection-list
  showBatchList = false;
  statuses = [
    'Present',
    'On Leave',
    'Late Arrival',
    'Early Departure',
    'Late Arrival and Early Departure',
  ]; // List of statuses
  batches = ['Batch 3','Batch 4'];
  selectedBatches: string[] = [];

  toggleVisibility(section: string) {
    if (section === 'status') {
      this.showList = !this.showList;
      this.showBatchList = false; // Optionally hide the batch section
    } else if (section === 'batch') {
      this.showBatchList = !this.showBatchList;
      this.showList = false; // Optionally hide the status section
    }
  }

  filteredTrainees: TraineeAttendanceLogs[] = [];
  originalTraineeLogs: TraineeAttendanceLogs[] = [];

  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd-MM-yyyy') || '';
  }

  formatTime(dateString: string): string {
    return this.datePipe.transform(dateString, 'hh:mm a') || '';
  }

  ngOnInit() {
    this.todayDate = new Date().toISOString().split('T')[0];
    this.getLatestDate();
    this.getTraineeAttendanceLogs(); // Fetch data from the API
   

    this.renderer.listen('document', 'click', (event: Event) => {
      // Check if the click is outside both the table component and the side profile
      const isInsideTable = this.elementRef.nativeElement.contains(event.target);
      const isInsideSideProfile = event.target instanceof HTMLElement && event.target.closest('app-side-user-profile');      

      if (this.isSideProfileVisible && !isInsideTable && !isInsideSideProfile) {
        this.closeSideProfile();
      }
    });
  }

  getTraineeAttendanceLogs() {
    if (this.selectedDate) {
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';
      this.traineeAttendancelogService.getFilteredTraineeAttendanceLogs([], formattedDate, formattedDate, [])
        .subscribe({
          next: (response: any) => {
            if (response && Array.isArray(response.logs)) {
              this.originalTraineeLogs = response.logs; // Save original data
              this.filteredTrainees = [...this.originalTraineeLogs]; // Initialize filtered data
            } else {
              console.error('API did not return an array:', response);
              this.originalTraineeLogs = [];
              this.filteredTrainees = [];
            }
          },
          error: (error) => {
            console.error('Error fetching trainee attendance logs:', error);
            this.originalTraineeLogs = [];
            this.filteredTrainees = [];
          },
        });
    }
  }
  

  search(query: string): void {
    this.searchQuery = query; // Update the search query
    this.filterTrainees(query); // Call filter method with the new query
  }

  getLatestDate(): void {
    this.traineeAttendancelogService.getLatestDate().subscribe({
      next: (response) => {
        this.selectedDate = new Date(response.latestDate);
        this.filterByDate(); // Fetch data from the API after getting the latest date
      },
      error: (error) => {
        console.error('Error fetching latest date:', error);
      },
    });
  }
  
  filterTrainees(query: string): void {
    if (query) {
      // Filter trainees based on the search query applied to the date-filtered data
      this.filteredTrainees = this.originalTraineeLogs.filter(
        (trainee) =>
          trainee.name &&
          trainee.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // Reset to the date-filtered data if the query is empty
      this.filteredTrainees = [...this.originalTraineeLogs];
    }
  }
  

  filterByDate(): void {
    if (this.selectedDateRange && this.selectedDateRange.length === 2) {
      const startDateString = this.datePipe.transform(this.selectedDateRange[0], 'yyyy-MM-dd') || '';
      const endDateString = this.datePipe.transform(this.selectedDateRange[1], 'yyyy-MM-dd') || '';
  
      this.traineeAttendancelogService
        .getFilteredTraineeAttendanceLogs(
          this.selectedStatuses, // Pass the selected statuses
          startDateString,
          endDateString,
          this.selectedBatches // Pass the selected batches
        )
        .subscribe({
          next: (response: { logs: TraineeAttendanceLogs[]; count: number; message: string }) => {
            if (response && Array.isArray(response.logs)) {
              this.originalTraineeLogs = response.logs; // Save the filtered data
              this.filteredTrainees = [...this.originalTraineeLogs]; // Initialize filtered data
            } else {
              console.error('API did not return an array:', response);
              this.originalTraineeLogs = [];
              this.filteredTrainees = [];
            }
          },
          error: (error) => {
            console.error('Error fetching filtered trainee logs:', error);
            this.originalTraineeLogs = [];
            this.filteredTrainees = [];
          },
        });
    }  else {
      // No date range selected, use the selected date (latest date) to filter the data
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';
  
      this.traineeAttendancelogService
        .getFilteredTraineeAttendanceLogs(
          this.selectedStatuses, // Pass the selected statuses
          formattedDate,
          formattedDate,
          this.selectedBatches // Pass the selected batches
        )
        .subscribe({
          next: (response: { logs: TraineeAttendanceLogs[]; count: number; message: string }) => {
            if (response && Array.isArray(response.logs)) {
              this.originalTraineeLogs = response.logs; // Save the filtered data
              this.filteredTrainees = [...this.originalTraineeLogs]; // Initialize filtered data
            } else {
              console.error('API did not return an array:', response);
              this.originalTraineeLogs = [];
              this.filteredTrainees = [];
            }
          },
          error: (error) => {
            console.error('Error fetching filtered trainee logs:', error);
            this.originalTraineeLogs = [];
            this.filteredTrainees = [];
          },
        });
    }
  }
  applyStatusFilter(event: MatSelectionListChange) {
    // Update selected statuses based on the selected options
    this.selectedStatuses = event.source.selectedOptions.selected.map(
      (option) => option.value
    );

    // Apply filters based on selected statuses
    this.applyFilters();
  }

  applyBatchFilter(event: MatSelectionListChange) {
    this.selectedBatches = event.source.selectedOptions.selected.map(
      (option) => option.value
    );
    this.applyFilters();
  }

  applyFilters() {
    this.filterByDate();
}



  downloadData() {
    // Convert the filteredTrainees data into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      this.filteredTrainees.map((trainee) => ({
        Date: this.formatDate(trainee.date ?? ''), // Format the date
        Name: trainee.name ?? 'N/A', // Default to 'N/A' if name is undefined
        Status: trainee.status ?? 'N/A', // Default to 'N/A' if status is undefined
        'Check-in Time': this.getDisplayTime(
          trainee.checkin ?? '',
          trainee.status ?? ''
        ), // Format check-in time
        'Check-out Time': this.getDisplayTime(
          trainee.checkout ?? '',
          trainee.status ?? ''
        ), // Format check-out time
        'Work Hours': trainee.workhours ?? '0', // Use default '0' if work hours are undefined
      }))
    );

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Logs');

    // Generate a buffer and save the file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Trainee_Attendance_Logs.xlsx');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'status-present';
      case 'On Leave':
        return 'status-absent';
      case 'Late Arrival':
      case 'Early Departure':
      case 'Late Arrival and Early Departure':
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
    } else if (hours < 9 || (hours === 9 && minutes < 6)) {
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

    if (hours < 18) {
      // Before 6 PM
      return 'time-late'; // Yellow background
    } else {
      return ''; // No additional class if after 6 PM
    }
  }

  formatWorkHours(workHours: string): string {
    if (!workHours) return '';
  
    // Assuming the workHours is in the format "HH:mm:ss"
    const timeParts = workHours.split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];
  
    // Return formatted time as "HH:mm"
    return `${hours}:${minutes}`;
  }

  showSideProfile(employeeCode: string, event: MouseEvent): void {

    event.stopPropagation();

    this.selectedTraineeCode = employeeCode;
    if (this.isSideProfileVisible == false){
      this.isSideProfileVisible = true; // Show the side profile when an employee is clicked
    }
    else if(this.isSideProfileVisible == true){
      this.isSideProfileVisible = false;
      setTimeout(() => {
        this.isSideProfileVisible = true; // Reopen the side profile for the new trainee
      }, 10);
    } 
  }
  closeSideProfile(): void {
    this.isSideProfileVisible = false; // Set to false when hiding the side profile
  }

  handleTableClick(event: MouseEvent): void {
    event.stopPropagation();  // Prevent click event from closing the side profile immediately
    this.closeSideProfile();
  }

  getDisplayTime(time: string, status: string): string {
    if (status === 'On Leave') {
      return '-'; // Display '-' for absent status
    }
    return time ? this.formatTime(time) : '-';
  }
}
