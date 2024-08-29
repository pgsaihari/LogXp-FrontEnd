import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { WidgetAttendance } from '../../core/interfaces/widget-attendance';
import { catchError, map, Observable, of } from 'rxjs';
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

  constructor( // Service for attendance-related operations
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

    this.attendanceService.setUpdatedData(day, month, year )

    // Map table headers to their corresponding API calls
    // Map table headers to their corresponding API calls
    const dataFetchMap: Record<string, () => Observable<WidgetAttendance[]>> = {
      'On Time': () => this.attendanceService.onTimeLogs(day, month, year).pipe(map(response => response.earlyArrivals)),
      'Late Arrivals': () => this.attendanceService.lateArrivalLogs(day, month, year).pipe(map(response => response.lateArrivals)),
      'Absent': () => this.attendanceService.absenteeLogs(day, month, year).pipe(map(response => response.absentees)),
      'Early Departures': () => this.attendanceService.earlyDeparturesLogs(day, month, year).pipe(map(response => response.earlyDepartures))
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
        .subscribe((data: WidgetAttendance[]) => {
          this.widgetAttendance = data; // Populate attendance data
        });
    } else {
      console.error('Unknown table header:', this.tableHeader);
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
  getTime(trainee: WidgetAttendance): string {
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
