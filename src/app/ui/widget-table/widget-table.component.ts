import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { WidgetAttendance } from '../../core/interfaces/widget-attendance';
import { catchError, map, Observable, of } from 'rxjs';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { CurrentDateComponent } from "../current-date/current-date.component";
import { Batch } from '../../core/model/batch.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-widget-table',
  standalone: true,
  imports: [TableModule, CalendarModule, FormsModule, DatePipe, NgIf, CurrentDateComponent],
  templateUrl: './widget-table.component.html',
  styleUrls: ['./widget-table.component.css']
})
export class WidgetTableComponent implements OnChanges {
  @Input() selectedBatch!: Batch;
  @Input() tableHeader: string = 'Met Work Hours'; // Title of the table, determines the category like 'On Time', 'Late Arrivals', etc.
  @Input() toggleField: string = 'Check-In'; // Column header that toggles based on the table category

  tableDate: Date = new Date(); // Date used for fetching logs
  widgetAttendance: WidgetAttendance[] = []; // Holds attendance data fetched from the attendanceService
  sortableColumn: string = 'loginTime';

  constructor(private attendanceService: TraineeAttendancelogService) {}

 /**
 * Initializes the component by fetching logs when the date changes
 * and when the component is first loaded.
 */
  ngOnInit() {
    this.attendanceService.selectedDate$.subscribe(date => {
      this.tableDate = date || this.attendanceService.getSelectedDate();
      this.fetchAttendanceLogs();
    });
    this.fetchAttendanceLogs();
  }

  /**
   * Handles changes to input properties like selected batch or table header
   * and updates the sortable column or reloads attendance logs if needed.
   *
   * @param changes The changes in input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedBatch'] || changes['tableHeader']) {
      this.setSortableColumn();
      this.fetchAttendanceLogs();
    }
  }
  /**
   * Sets the sortable column for the table based on the table header.
   * If the table is for 'Early Departures', the sortable column will be 'logoutTime'.
   * Otherwise, it defaults to 'loginTime'.
   */
  private setSortableColumn() {
    this.sortableColumn = this.tableHeader === 'Early Departures' ? 'logoutTime' : 'loginTime';
  }


  /**
   * Fetches attendance logs from the `attendanceService` based on the selected date
   * and table category (e.g., 'On Time', 'Late Arrivals', 'Absent', 'Early Departures').
   * Filters the fetched logs based on the selected batch.
   */
  private fetchAttendanceLogs() {
    const { day, month, year } = this.extractDateParts(this.tableDate);
    this.attendanceService.updateSelectedDate({ day, month, year });

    const dataFetchFn = this.getDataFetchFunction(day, month, year);
    if (dataFetchFn) {
      dataFetchFn()
        .pipe(catchError(this.handleFetchError.bind(this)))
        .subscribe(data => this.widgetAttendance = this.filterByBatch(data));
    } else {
      console.error('Unknown table header:', this.tableHeader);
    }
  }
  
  /**
   * Extracts the day, month, and year from a Date object for easier usage.
   *
   * @param date The Date object to extract values from.
   * @returns An object containing the day, month, and year.
   */
  private extractDateParts(date: Date) {
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }
  /**
   * Returns the appropriate data fetch function based on the selected table category.
   * Maps the response to filter logs by batch and format date fields properly.
   *
   * @param day The day of the selected date.
   * @param month The month of the selected date.
   * @param year The year of the selected date.
   * @returns A function to fetch data or undefined if the table header is unknown.
   */
  private getDataFetchFunction(day: number, month: number, year: number) {
    const filterByBatch = (logs: WidgetAttendance[]) =>
      logs.filter(log => log.batch === this.selectedBatch?.batchName)
        .map(log => ({
          ...log,
          loginTime: new Date(log.loginTime),
          logoutTime: new Date(log.logoutTime)
        }));

    return {
      'Met Work Hours': () => this.attendanceService.onTimeLogs(day, month, year).pipe(map(response => filterByBatch(response.earlyArrivals))),
      'Late Arrivals': () => this.attendanceService.lateArrivalLogs(day, month, year).pipe(map(response => filterByBatch(response.lateArrivals))),
      'Absent': () => this.attendanceService.absenteeLogs(day, month, year).pipe(map(response => filterByBatch(response.absentees))),
      'Early Departures': () => this.attendanceService.earlyDeparturesLogs(day, month, year).pipe(map(response => filterByBatch(response.earlyDepartures)))
    }[this.tableHeader];
  }
  /**
   * Filters the fetched logs to include only those that match the selected batch.
   *
   * @param logs The array of fetched attendance logs.
   * @returns The filtered logs for the selected batch or all logs if no batch is selected.
   */
  private filterByBatch(logs: WidgetAttendance[]) {
    return this.selectedBatch
      ? logs.filter(log => log.batch === this.selectedBatch.batchName)
      : logs;
  }

  /**
   * Handles errors encountered while fetching attendance logs.
   * Logs the error message and clears the `widgetAttendance` array.
   *
   * @param error The HTTP error response encountered during the data fetch.
   * @returns An observable of an empty array.
   */
  private handleFetchError(error: HttpErrorResponse): Observable<WidgetAttendance[]> {
    console.error('Error fetching attendance logs:', error.message);
    this.widgetAttendance = [];
    return of([]);
  }

  /**
   * Returns the correct time (either login or logout) for display based on the table header.
   * If the table is for 'Early Departures', the logout time is returned. Otherwise, the login time.
   *
   * @param trainee The attendance log entry for a trainee.
   * @returns The login or logout time as a Date object, or null if the time is invalid.
   */
  getTime(trainee: WidgetAttendance): Date | null {
    const time = this.tableHeader === 'Early Departures' ? trainee.logoutTime : trainee.loginTime;
    return time instanceof Date && !isNaN(time.getTime()) ? time : null;
  }
}
