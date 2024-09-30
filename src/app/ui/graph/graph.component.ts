import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule, } from 'primeng/calendar';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { DailyAttendanceOfMonth } from '../../core/interfaces/daily-attendance-of-month';
import { catchError, of } from 'rxjs';
import { WidgetSummary } from '../../core/interfaces/widget-attendance';
import { Batch } from '../../core/model/batch.model';

 
@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChartModule, FormsModule, CalendarModule ],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent  {
  constructor(private api: TraineeAttendancelogService) {}
  
  @Input() selectedBatch!: Batch; // Input to receive the selected batch
  error: any;
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
  latestSummary!:WidgetSummary | never[];

  ngOnInit() {
    // this.getLatestDate();// function to get the lates date on which attendance logs are stored    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedBatch'] && this.selectedBatch) {
      this.getLatestDate();
    }
  }
  /**
   * function to get the data containing number of absenties and the total number of traineers of a month.
   * After getting the data, the graph is initialized.
   * @param day 
   * @param month 
   */
  getAttendanceData(day:number, month:number){
    this.api.getAttendanceOfAMonth(day, month, this.selectedBatch.batchName)
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
      this.bargraphInit();
    });   
  }

  getLatestDate(){
      this.api.selectedDate$
      .pipe(
        catchError(error => {
          this.error = error.message;
          this.graphDataMonth = new Date();
          this.maxDate = this.graphDataMonth;
          this.getAttendanceData(this.graphDataMonth.getMonth()+1, this.graphDataMonth.getFullYear());
          return of([]);
        })
      )
      .subscribe(value => {
        this.graphDataMonth = value as Date;
        this.maxDate = this.graphDataMonth;
        this.getAttendanceData(this.graphDataMonth.getMonth()+1, this.graphDataMonth.getFullYear());
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
    if (result.length < 8){
      const nullsToAdd = 8 - result.length;
      for (let i = 1; i <= nullsToAdd; i++) {
        const date = (this.graphDataMonth ?? new Date()).getDate();
        const month = (this.graphDataMonth ?? new Date()).getMonth();
        result.push(`${date + i} ${this.monthNames[month]}`);
      }
    }  
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
      // result.push(Math.round(percentage * Math.pow(10, 2)) / Math.pow(10, 2));
      result.push(total-absent)
    });
    return result
  }
  /**
   * calculates the percentage of late arrivals of each working day to be set as the Y-axis
   * @returns array of numbers containting percentage of late arrivals of each day of the month
   */
  generateYaxisDataLateArrivals():number[]{
    let result: number[] = []; 
    this.dailyAttendanceData?.forEach(item => {
      let total:any = item.totalEmployees;
      let lateArrivals:any = item.lateArrivals;
      let percentage:number = ((lateArrivals)/total) * 100;
      // result.push(Math.round(percentage * Math.pow(10, 2)) / Math.pow(10, 2));
      result.push(lateArrivals)
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
  bargraphInit(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.data = {
      labels: this.generateXaxisLabel(),
      datasets: [
        {
          label: 'Present',
          backgroundColor: documentStyle.getPropertyValue('--secondary-color'),
          borderColor: documentStyle.getPropertyValue('--secondary-color'),
          data: this.generateYaxisData()
        },
        {
          label: 'Late arrivals',
          backgroundColor: documentStyle.getPropertyValue('--primary-color'),
          borderColor: documentStyle.getPropertyValue('--primary-color'),
          data: this.generateYaxisDataLateArrivals()
        }
      ]
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
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
            color: textColorSecondary,
            font: {
                weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'No. of trainees' 
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