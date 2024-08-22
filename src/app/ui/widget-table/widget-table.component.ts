import {  Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import {  DatePipe, NgClass,NgIf } from '@angular/common';
import { WidgetAttendance } from '../../core/interfaces/widget-attendance';
import { AttendanceLogsService } from '../../core/services/attendance-logs.service';
import { catchError, of } from 'rxjs';

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
  error: any;
  containerVisibility:string = '';

  constructor(private traineeAttendancelogService: AttendanceLogsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableHeader'] && this.tableHeader) {
      this.fetchAttendanceLogs();
    }
  }

  fetchAttendanceLogs() {
    switch (this.tableHeader) {
      case 'On Time':
        this.containerVisibility = '';
        this.traineeAttendancelogService.onTimeLogs()
        .pipe(
          catchError(error => {
            this.error = error.message;
            return of([]);
          })
        )
        .subscribe((data:any) =>{
          this.widgetAttendance = data.earlyArrivals || [];
          const loginTime = this.widgetAttendance[0].loginTime;
          if(loginTime != null){this.updateDateFromLoginTime(loginTime);}
          else{console.log("no data");
          }
          
        });
        break;
      case 'Late Arrivals':
        this.containerVisibility = '';
        this.traineeAttendancelogService.lateArrivalLogs()
        .pipe(
          catchError(error => {
            this.error = error.message;
            this.widgetAttendance = [];
            return of([]);
          })
        )
        .subscribe((data:any)=>{
          this.widgetAttendance = data.lateArrivals || [];
        });
        break;
      case 'Absent':
        this.containerVisibility = '';
        this.traineeAttendancelogService.absenteeLogs()
        .pipe(
          catchError(error => {
            this.error = error.message;
            this.widgetAttendance = [];
            return of([]);
          })
        )
        .subscribe((data:any)=>{
          this.widgetAttendance = data.absentees || [];
        });
        break;
      case 'Early Departures':
        this.containerVisibility = '';
        this.traineeAttendancelogService.earlyDeparturesLogs()
        .pipe(
          catchError(error => {
            this.error = error.message;
            this.widgetAttendance = [];
            return of([]);
          })
        )
        .subscribe((data:any)=>{
          this.widgetAttendance = data.earlyDepartures || [];
        });
        break;
      default:
        this.containerVisibility = "invisible";
        this.widgetAttendance = [];
        console.error('Unknown table header:', this.tableHeader);
    }
  }

  updateDateFromLoginTime(loginTime: string) {
    if (loginTime) {
      console.log('Login Time:', loginTime);
      this.date = new Date(loginTime); // Set the date using the loginTime value from the API response
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