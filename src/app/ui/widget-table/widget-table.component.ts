import {  Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import {  DatePipe, NgClass } from '@angular/common';
import { WidgetAttendance } from '../../core/interfaces/widget-attendance';
import { AttendanceLogsService } from '../../core/services/attendance-logs.service';

@Component({
  selector: 'app-widget-table',
  standalone: true,
  imports: [TableModule, CalendarModule, AutoCompleteModule, FormsModule, NgClass, DatePipe,NgIf],
  templateUrl: './widget-table.component.html',
  styleUrl: './widget-table.component.css'
})
export class WidgetTableComponent implements OnChanges {

  @Input() tableHeader!: string;
  @Input() toggleField: string = 'Check-In';
  todayDate: string | undefined;
  date: Date | undefined;
  time: string = ''
  widgetAttendance: WidgetAttendance[] = [];
  
  constructor(private traineeAttendancelogService: AttendanceLogsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableHeader'] && this.tableHeader) {
      this.fetchAttendanceLogs();
    }
  }

  fetchAttendanceLogs() {
    switch (this.tableHeader) {
      case 'On Time':
        this.traineeAttendancelogService.onTimeLogs().subscribe(
          (response: any) => {
            this.widgetAttendance = response.earlyArrivals || [];
            console.log('On Time Logs:', response);
          },
          (error) => {
            console.error('Error fetching on time logs:', error);
            this.widgetAttendance = [];
          }
        );
        break;

      case 'Late Arrivals':
        this.traineeAttendancelogService.lateArrivalLogs().subscribe(
          (response: any) => {
            this.widgetAttendance = response.lateArrivals || [];
            console.log('Late Arrival Logs:', response);
          },
          (error) => {
            console.error('Error fetching late arrival logs:', error);
            this.widgetAttendance = [];
          }
        );
        break;

      case 'Absent':
        this.traineeAttendancelogService.absenteeLogs().subscribe(
          (response: any) => {
            this.widgetAttendance = response.absentees || [];
            console.log('Absent Logs:', response);
          },
          (error) => {
            console.error('Error fetching absentee logs:', error);
            this.widgetAttendance = [];
          }
        );
        break;

      case 'Early Departures':
        this.traineeAttendancelogService.earlyDeparturesLogs().subscribe(
          (response: any) => {
            this.widgetAttendance = response.earlyDepartures || [];
            console.log('Early Departure Logs:', response);
          },
          (error) => {
            console.error('Error fetching early departure logs:', error);
            this.widgetAttendance = [];
          }
        );
        break;

      default:
        this.widgetAttendance = [];
        console.error('Unknown table header:', this.tableHeader);
    }
  }

  getTime(trainee: any): string {  
    const result = this.tableHeader === 'On Time' || this.tableHeader === 'Late Arrivals'
      ? trainee?.loginTime
      : this.tableHeader === 'Early Departures'
      ? trainee?.logoutTime
      : this.tableHeader === 'Absent'
      ? 'N/A'
      : '';
    return result;
  }
}