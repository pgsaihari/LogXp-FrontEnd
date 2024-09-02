import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { WidgetAttendance } from '../../core/interfaces/widget-attendance';
import { catchError, map, Observable, of } from 'rxjs';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { CurrentDateComponent } from "../current-date/current-date.component";

@Component({
  selector: 'app-widget-table',
  standalone: true,
  imports: [TableModule, CalendarModule, FormsModule, DatePipe, NgIf, CurrentDateComponent],
  templateUrl: './widget-table.component.html',
  styleUrls: ['./widget-table.component.css']
})
export class WidgetTableComponent implements OnChanges {
  @Input() tableHeader: string = 'On Time'; // Title of the table, determines the category like 'On Time', 'Late Arrivals', etc.
  @Input() toggleField: string = 'Check-In'; // Column header that toggles based on the table category

  tableDate: Date = new Date(); // Date used for fetching logs
  maxDate: Date = new Date(); // Maximum selectable date, set from the latest log date
  widgetAttendance: WidgetAttendance[] = []; // Holds attendance data fetched from the attendanceService
  showTableHeader = false; // Controls the visibility of the table header

  constructor( // Service for attendance-related operations
    private attendanceService: TraineeAttendancelogService // Service for fetching trainee attendance logs
  ) {
    this.attendanceService.selectedDate$.subscribe(date => {
      if (date) {
        this.tableDate = date;
        this.fetchAttendanceLogs(); // Fetch logs whenever the date changes
      }
    });
  }

  ngOnInit() {
    // Subscribe to the selected date from the service
    this.attendanceService.selectedDate$.subscribe((date) => {
      if (date) {
        this.tableDate = date;
      } else {
        // If no date is selected, use the latestLogDate as the default
        this.tableDate = this.attendanceService.getSelectedDate();
      }
    });
  }
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableHeader']?.currentValue) {
      this.fetchAttendanceLogs(); // Only fetch logs if the header is defined
    }
  }

  /**
   * Fetches attendance logs based on the selected date and table category.
   */
  fetchAttendanceLogs() {
    if (!this.tableHeader) {
      console.error('Unknown table header:', this.tableHeader);
    }
    
    this.widgetAttendance = []; // Clear previous data before fetching new logs

    // Extract date parts to pass to the attendanceService
    const day = this.tableDate.getDate();
    const month = this.tableDate.getMonth() + 1;
    const year = this.tableDate.getFullYear();

    this.attendanceService.updateSelectedDate({ day: day, month: month, year: year })

    // Map table headers to their corresponding attendanceService calls
    // Map table headers to their corresponding attendanceService calls
    const dataFetchMap: Record<string, () => Observable<WidgetAttendance[]>> = {
      'On Time': () => this.attendanceService.onTimeLogs(day, month, year).pipe(map(response => response.earlyArrivals)),
      'Late Arrivals': () => this.attendanceService.lateArrivalLogs(day, month, year).pipe(map(response => response.lateArrivals)),
      'Absent': () => this.attendanceService.absenteeLogs(day, month, year).pipe(map(response => response.absentees)),
      'Early Departures': () => this.attendanceService.earlyDeparturesLogs(day, month, year).pipe(map(response => response.earlyDepartures))
    };

    // Get the appropriate attendanceService call based on the table header
    const dataFetchFn = dataFetchMap[this.tableHeader];

    if (dataFetchFn) {
      // Execute the attendanceService call and handle the response
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
