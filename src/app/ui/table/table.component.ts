import { Component, OnInit } from '@angular/core';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TopHeaderComponent } from '../top-header/top-header.component';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { DatePipe } from '@angular/common';
import { SideUserProfileComponent } from '../../Features/side-user-profile/side-user-profile.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';

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
    DatePipe

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

  constructor(
    private traineeAttendancelogService: TraineeAttendancelogService
  ) {}

  selectedItem: any;
  suggestions: any[] = [];
  todayDate: string | undefined;
  selectedOptions: any[] = [];
  yesterday: Date = new Date();

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
  batches = ['Batch 4'];
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
    this.getTraineeAttendanceLogs(); // Fetch data from the API
    this.getLatestDate();
  }

  getTraineeAttendanceLogs() {
    this.traineeAttendancelogService.getTraineeAttendanceLogs().subscribe({
      next: (response: any) => {
        if (
          response &&
          response.attendanceLogs &&
          Array.isArray(response.attendanceLogs)
        ) {
          this.originalTraineeLogs = response.attendanceLogs;
          this.filteredTrainees = [...this.originalTraineeLogs];
          this.filterByDate();
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
      complete: () => {
        console.log('Trainee attendance logs fetched successfully.');
      },
    });
  }

  search(query: string): void {
    // const query = this.searchQuery;
    this.filterTrainees(query);
  }

  getLatestDate(): void {
    this.traineeAttendancelogService.getLatestDate().subscribe({
      next: (response) => {
        this.selectedDate = new Date(response.latestDate);
        this.getTraineeAttendanceLogs(); // Fetch data from the API after getting the latest date
      },
      error: (error) => {
        console.error('Error fetching latest date:', error);
      },
    });
  }

  filterTrainees(query: string): void {
    if (query) {
      this.filteredTrainees = this.originalTraineeLogs.filter(
        (trainee) =>
          trainee.name &&
          trainee.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // Reset to the original data if the query is empty
      this.filteredTrainees = [...this.originalTraineeLogs]; // Changed to use originalTraineeLogs
      this.filterByDate();
    }
  }

  filterByDate(): void {
    if (this.selectedDate) {
      const selectedDateString =
        this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';

      this.traineeAttendancelogService
        .getFilteredTraineeAttendanceLogs('', selectedDateString, [])
        .subscribe({
          next: (response: {
            logs: TraineeAttendanceLogs[];
            count: number;
            message: string;
          }) => {
            if (response && Array.isArray(response.logs)) {
              this.filteredTrainees = response.logs;
            } else {
              console.error('API did not return an array:', response);
              this.filteredTrainees = [];
            }
          },
          error: (error) => {
            console.error('Error fetching filtered trainee logs:', error);
            this.filteredTrainees = [];
          },
        });
    } else {
      this.filteredTrainees = [...this.originalTraineeLogs]; // Reset to original data if no date is selected
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
    const dateFilter = this.selectedDate
      ? this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')
      : '';

    // Apply status and batch filters
    const filteredByStatusAndBatches = this.originalTraineeLogs.filter(
      (trainee) => {
        const statusMatch =
          this.selectedStatuses.length > 0
            ? this.selectedStatuses.includes(trainee.status)
            : true;
        const batchMatch =
          this.selectedBatches.length > 0
            ? this.selectedBatches.includes(trainee.batch)
            : true;
        return statusMatch && batchMatch;
      }
    );

    // Apply date filter to the already filtered data
    if (dateFilter) {
      this.filteredTrainees = filteredByStatusAndBatches.filter((trainee) => {
        const traineeDate = this.datePipe.transform(
          new Date(trainee.date),
          'yyyy-MM-dd'
        );
        return traineeDate === dateFilter;
      });
    } else {
      this.filteredTrainees = filteredByStatusAndBatches;
    }
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

    if (hours < 18) {
      // Before 6 PM
      return 'time-late'; // Yellow background
    } else {
      return ''; // No additional class if after 6 PM
    }
  }

  showSideProfile(employeeCode: string): void {
    this.selectedTraineeCode = employeeCode;
    this.isSideProfileVisible = true; // Show the side profile when an employee is clicked
  }
  closeSideProfile(): void {
    this.isSideProfileVisible = false; // Set to false when hiding the side profile
  }

  getDisplayTime(time: string, status: string): string {
    if (status === 'On Leave') {
      return '-'; // Display '-' for absent status
    }
    return time ? this.formatTime(time) : '-';
  }
}
