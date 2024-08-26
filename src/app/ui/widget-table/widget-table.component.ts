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
  // private datePipe = new DatePipe('en-US');
  @Input() tableHeader!: string;
  @Input() toggleField: string = 'Check-In';
  date = new Date();
  currentDay: Date = new Date();
  day:number = 0;
  month:number = 0;
  year:number = 0;
  time: string = ''
  widgetAttendance: WidgetAttendance[] = [];
  error: any;
  // containerVisibility:string = '';
  manualDateSelection = false;
  yesterday : Date = new Date();
  dataFetched: number = 0;  
  showTableHeader!:boolean ;

  constructor(private traineeAttendancelogService: AttendanceLogsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableHeader'] && changes['tableHeader'].currentValue !== changes['tableHeader'].previousValue) {
      // this.date.setDate(this.currentDay.getDate() - 1);
      this.day = this.date.getDate();
      this.month = this.date.getMonth()+1;
      this.year = this.date.getFullYear()
      if (!this.manualDateSelection) {
        console.log(this.manualDateSelection)
        this.date.setDate(this.currentDay.getDate() - 1);
      }
      this.fetchAttendanceLogs();
    }
  }

  /**
   * fuction to make API calls and assign the data to the desired table.
   */
  fetchAttendanceLogs() {
    this.widgetAttendance = [];
    switch (this.tableHeader) {
      case 'On Time':
        // this.containerVisibility = '';
        this.traineeAttendancelogService.onTimeLogs(this.day,this.month,this.year)
        .pipe(
          catchError(error => {
            this.error = error.message;
            return of([]);
          })
        )
        .subscribe((data:any) =>{
          this.widgetAttendance = data.earlyArrivals;
          this.dataFetched = this.widgetAttendance.length;
          this.showTableHeaderfn();
          
          // if(this.widgetAttendance.length != 0){
          //   console.log(this.widgetAttendance.length)
          //   const loginTime = this.widgetAttendance[0].date;
          //   if(loginTime != null){this.updateDateFromLoginTime(loginTime);}
          //   else{console.log("no data");}
          // }
          // else{ this.widgetAttendance = []; }
        });

        
        break;
      case 'Late Arrivals':
        // this.containerVisibility = '';
        this.traineeAttendancelogService.lateArrivalLogs(this.day,this.month,this.year)
        .pipe(
          catchError(error => {
            this.error = error.message;
            this.widgetAttendance = [];
            return of([]);
          })
        )
        .subscribe((data:any)=>{
          this.widgetAttendance = data.lateArrivals; 
          this.dataFetched = this.widgetAttendance.length;
          this.showTableHeader = true;
          console.log(this.showTableHeader);
          // if(this.widgetAttendance.length != 0){
          //   const loginTime = this.widgetAttendance[0].date;
          //   if(loginTime != null){this.updateDateFromLoginTime(loginTime);}
          //   else{console.log("no data");} 
          // }
          // else{ this.widgetAttendance = []; }
        });
        break;
      case 'Absent':
        // this.containerVisibility = '';
        this.traineeAttendancelogService.absenteeLogs(this.day,this.month,this.year)
        .pipe(
          catchError(error => {
            this.error = error.message;
            this.widgetAttendance = [];
            return of([]);
          })
        )
        .subscribe((data:any)=>{
          this.widgetAttendance = data.absentees;
          this.dataFetched = this.widgetAttendance.length; 
          this.showTableHeader = true;
          console.log(this.showTableHeader);
          // if(this.widgetAttendance.length != 0){
          //   const loginTime = this.widgetAttendance[0].date;
          //   if(loginTime != null){this.updateDateFromLoginTime(loginTime);}
          //   else{console.log("no data");}
          // }
          // else{ this.widgetAttendance = []; }
        });
        break;
      case 'Early Departures':
        // this.containerVisibility = '';
        this.traineeAttendancelogService.earlyDeparturesLogs(this.day,this.month,this.year)
        .pipe(
          catchError(error => {
            this.error = error.message;
            this.widgetAttendance = [];
            return of([]);
          })
        )
        .subscribe((data:any)=>{
          this.showTableHeader = true;
          console.log(this.showTableHeader);
          this.widgetAttendance = data.earlyDepartures;
          this.dataFetched = this.widgetAttendance.length; 
          // if(this.widgetAttendance.length != 0){
          //   const loginTime = this.widgetAttendance[0].date;
          //   if(loginTime != null){this.updateDateFromLoginTime(loginTime);}
          //   else{console.log("no data");} 
          // }
          // else{ this.widgetAttendance = []; }
        });
        break;
      default:
        // this.containerVisibility = "invisible";
        // this.widgetAttendance = [];
        console.error('Unknown table header:', this.tableHeader);
    }
  }

  updateDateFromLoginTime(loginTime: string) {
    if (loginTime && !this.manualDateSelection) {
      console.log(loginTime)
      // debugger;
      this.date = new Date(loginTime);
    }
  }
  showTableHeaderfn(){
    this.showTableHeader = true;
    console.log("inside fn");
    
          console.log(this.showTableHeader);
  }
  
  /**
   * function to assign day,month and year variables and to call the fetchAttendanceLogs() function to make API calls for the specific date and to display its data in the table.
   */
  dateChange(){
    console.log(this.date);
    this.day = this.date.getDate();
    this.month = this.date.getMonth()+1;
    this.year = this.date.getFullYear()
    this.manualDateSelection = true;
    this.fetchAttendanceLogs();
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