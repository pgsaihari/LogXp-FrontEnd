import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule, } from 'primeng/calendar';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { DailyAttendanceOfMonth } from '../../core/interfaces/daily-attendance-of-month';
import { catchError, of } from 'rxjs';

 
@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChartModule, FormsModule, CalendarModule ],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent  {
  error: any;
  constructor(private api: TraineeAttendancelogService) {}
  graphDataMonth: Date | undefined;
  numberOfWorkingDays: number = 25;
  data: any;
  options: any;
  monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  maxDate!: Date;
  dailyAttendanceData?:DailyAttendanceOfMonth[] | never[];
  isAttendanceLogEmpty?: boolean;
  noDataDate?:Date;

  ngOnInit() {
    this.graphDataMonth = new Date();
    this.maxDate = this.graphDataMonth;
    this.getAttendanceData(this.graphDataMonth.getMonth()+1, this.graphDataMonth.getFullYear());
  }
  /**
   * function to get the data containing number of absenties and the total number of traineers of a month.
   * After getting the data, the graph is initialized.
   * @param day 
   * @param month 
   */
  getAttendanceData(day:number, month:number){
    this.api.getAttendanceOfAMonth(day, month)
    .pipe(
      catchError(error => {
        this.error = error.message;
        return of([]);
      })
    )
    .subscribe(data => {
      this.dailyAttendanceData = data;
      if(this.dailyAttendanceData.length == 0 ){
        this.isAttendanceLogEmpty = true;
        this.noDataDate = this.graphDataMonth;       
      }
      else{this.isAttendanceLogEmpty = false;}
      this.graphInit();
    });   
  }
  /**
   * uses the response from the api call to get the days in which attendance logs are preset to be used as the X-axis of the graph
   * @returns an array of string containing the X-axis of the graph 
   */
  generateXaxisLabel(): string[] {
    const result: string[] = []; 
      this.dailyAttendanceData?.forEach(item => {
        let convertToDate = new Date(<any>item.day);
        result.push(convertToDate.getDate() + " " + this.monthNames[convertToDate.getMonth()])
      });
    return result;
  }
  /**
   * calculates the percentage of each working day to be set as the Y-axis
   * @returns array of numbers containting attendance percentage of each day of the month
   */
  generateYaxisData():number[]{
    let result: number[] = []; 
    this.dailyAttendanceData?.forEach(item => {
      let total:any = item.totalEmployees;
      let absent:any = item.absentees;
      let percentage:number = ((total - absent)/total) * 100;
      result.push(percentage);
    });
    return result
  }
  /**
   * Function to call getAttendanceData() with the new month and year data.
   * Is called when the month picker registers a new month selection.
   * @param graphDataMonth 
   */
  monthSelection(graphDataMonth:any) {
    this.getAttendanceData(graphDataMonth.getMonth()+1, graphDataMonth.getFullYear());    
  }
  /**
   * Initializes the graph with X and Y cordinates as well as other configurations and settings.
   */
  graphInit(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.generateYaxisData();
    this.data = {
      labels: this.generateXaxisLabel(),
      datasets: [
        {
          label: 'Present',
          data: this.generateYaxisData(),
          fill: true,
          borderColor: "#EA454C",
          tension: 0.4,
          backgroundColor: 'rgba(234, 69, 76, 0.1)'
        },
      ]
    };
    //remove aspect ration to alter height, or change it to alter height
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'Attendance %' 
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}        