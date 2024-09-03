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
  @Input() tableHeader: string = 'On Time'; // Title of the table, determines the category like 'On Time', 'Late Arrivals', etc.
  @Input() toggleField: string = 'Check-In'; // Column header that toggles based on the table category

  tableDate: Date = new Date(); // Date used for fetching logs
  widgetAttendance: WidgetAttendance[] = []; // Holds attendance data fetched from the attendanceService
  sortableColumn: string = 'loginTime';

  constructor(private attendanceService: TraineeAttendancelogService) {}

  ngOnInit() {
    // Subscribe to selectedDate$ and fetch logs when the date changes
    this.attendanceService.selectedDate$.subscribe(date => {
      this.tableDate = date || this.attendanceService.getSelectedDate();
      this.fetchAttendanceLogs();
    });

    // Fetch logs initially when the component is first loaded
    this.fetchAttendanceLogs();
  }

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedBatch'] || changes['tableHeader']) {
      this.setSortableColumn();
      this.fetchAttendanceLogs();
    }
  }

  private setSortableColumn() {
    this.sortableColumn = this.tableHeader === 'Early Departures' ? 'logoutTime' : 'loginTime';
  }


  /**
   * Fetches attendance logs based on the selected date and table category.
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

  private extractDateParts(date: Date) {
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

  private getDataFetchFunction(day: number, month: number, year: number) {
    const filterByBatch = (logs: WidgetAttendance[]) =>
      logs.filter(log => log.batch === this.selectedBatch?.batchName)
        .map(log => ({
          ...log,
          loginTime: new Date(log.loginTime),
          logoutTime: new Date(log.logoutTime)
        }));

    return {
      'On Time': () => this.attendanceService.onTimeLogs(day, month, year).pipe(map(response => filterByBatch(response.earlyArrivals))),
      'Late Arrivals': () => this.attendanceService.lateArrivalLogs(day, month, year).pipe(map(response => filterByBatch(response.lateArrivals))),
      'Absent': () => this.attendanceService.absenteeLogs(day, month, year).pipe(map(response => filterByBatch(response.absentees))),
      'Early Departures': () => this.attendanceService.earlyDeparturesLogs(day, month, year).pipe(map(response => filterByBatch(response.earlyDepartures)))
    }[this.tableHeader];
  }

  private filterByBatch(logs: WidgetAttendance[]) {
    return this.selectedBatch
      ? logs.filter(log => log.batch === this.selectedBatch.batchName)
      : logs;
  }

  private handleFetchError(error: HttpErrorResponse): Observable<WidgetAttendance[]> {
    console.error('Error fetching attendance logs:', error.message);
    this.widgetAttendance = [];
    return of([]);
  }

  /**
   * Determines which time to display based on the table category.
   */
  getTime(trainee: WidgetAttendance): Date | null {
    const time = this.tableHeader === 'Early Departures' ? trainee.logoutTime : trainee.loginTime;
    return time instanceof Date && !isNaN(time.getTime()) ? time : null;
  }
}
