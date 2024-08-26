import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { WidgetAttendance } from '../../core/interfaces/widget-attendance';
import { AttendanceLogsService } from '../../core/services/attendance-logs.service';
import { catchError, of } from 'rxjs';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';

@Component({
  selector: 'app-widget-table',
  standalone: true,
  imports: [TableModule, CalendarModule, FormsModule, DatePipe, NgIf],
  templateUrl: './widget-table.component.html',
  styleUrls: ['./widget-table.component.css']
})
export class WidgetTableComponent implements OnChanges {
  @Input() tableHeader!: string; // Title of the table, determines the category like 'On Time', 'Late Arrivals', etc.
  @Input() toggleField: string = 'Check-In'; // Column header that toggles based on the table category

  tableDate: Date = new Date(); // Date used for fetching logs
  maxDate: Date = new Date(); // Maximum selectable date, set from the latest log date
  widgetAttendance: WidgetAttendance[] = []; // Holds attendance data fetched from the API
  manualDateSelection = false; // Tracks if the date was manually selected
  showTableHeader = false; // Controls the visibility of the table header

  constructor(
    private traineeAttendancelogService : AttendanceLogsService, // Service for attendance-related operations
    private attendanceService: TraineeAttendancelogService // Service for fetching trainee attendance logs
  ) {}

  ngOnInit() {
    // Fetch the latest available date on component initialization
    this.attendanceService.getLatestDate().subscribe((response: { latestDate: string }) => {
      if (response?.latestDate) {
        this.maxDate = new Date(response.latestDate);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // React to changes in the table header (e.g., when switching between categories)
    if (changes['tableHeader']?.currentValue !== changes['tableHeader']?.previousValue) {
      if (!this.manualDateSelection) {
        // If the date wasn't manually selected, use the latest date available
        this.attendanceService.getLatestDate().subscribe((response: { latestDate: string }) => {
          if (response?.latestDate) {
            this.tableDate = new Date(response.latestDate);
          }
          this.fetchAttendanceLogs(); // Fetch the logs after setting the date
        });
      } else {
        this.fetchAttendanceLogs(); // Fetch the logs directly if a manual date was selected
      }
    }
  }

  /**
   * Fetches attendance logs based on the selected date and table category.
   */
  fetchAttendanceLogs() {
    this.widgetAttendance = []; // Clear previous data before fetching new logs

    // Extract date parts to pass to the API
    const day = this.tableDate.getDate();
    const month = this.tableDate.getMonth() + 1;
    const year = this.tableDate.getFullYear();

    // Map table headers to their corresponding API calls
    const dataFetchMap: Record<string, () => any> = {
      'On Time': () => this.traineeAttendancelogService.onTimeLogs(day, month, year),
      'Late Arrivals': () => this.traineeAttendancelogService.lateArrivalLogs(day, month, year),
      'Absent': () => this.traineeAttendancelogService.absenteeLogs(day, month, year),
      'Early Departures': () => this.traineeAttendancelogService.earlyDeparturesLogs(day, month, year)
    };

    // Get the appropriate API call based on the table header
    const dataFetchFn = dataFetchMap[this.tableHeader];

    if (dataFetchFn) {
      // Execute the API call and handle the response
      dataFetchFn()
        .pipe(
          catchError(error => {
            this.widgetAttendance = []; // Clear data on error
            console.error('Error fetching attendance logs:', error.message);
            return of([]); // Return an empty array as fallback
          })
        )
        .subscribe((data: any) => {
          this.widgetAttendance = data[this.getAttendanceCategory()]; // Populate attendance data
        });
    } else {
      console.error('Unknown table header:', this.tableHeader);
    }
  }

  /**
   * Determines the data key based on the table category.
   */
  getAttendanceCategory(): string {
    // Maps the table header to the corresponding data key
    switch (this.tableHeader) {
      case 'On Time':
        return 'earlyArrivals';
      case 'Late Arrivals':
        return 'lateArrivals';
      case 'Absent':
        return 'absentees';
      case 'Early Departures':
        return 'earlyDepartures';
      default:
        return '';
    }
  }

  /**
   * Handles date changes from the date picker.
   */
  dateChange() {
    this.manualDateSelection = true; // Mark date selection as manual
    this.fetchAttendanceLogs(); // Fetch logs for the selected date
  }

  /**
   * Determines which time to display based on the table category.
   */
  getTime(trainee: any): string {
    // Simplifies time selection logic based on the category
    switch (this.tableHeader) {
      case 'On Time':
      case 'Late Arrivals':
        return trainee?.loginTime || '';
      case 'Early Departures':
        return trainee?.logoutTime || '';
      case 'Absent':
        return 'N/A';
      default:
        return '';
    }
  }
}
