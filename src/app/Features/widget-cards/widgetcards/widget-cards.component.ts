  import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
  import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
  import { TraineeServiceService } from '../../../core/services/trainee-service.service';
  import { FormsModule } from '@angular/forms';
  import { MessageService } from 'primeng/api';
  import { RouterLink, RouterOutlet } from '@angular/router';
import { count, Subscription } from 'rxjs';
import { TraineeAttendancelogService } from '../../../core/services/trainee-attendancelog.service';
import { Batch } from '../../../core/model/batch.model';
import { WidgetAttendance } from '../../../core/interfaces/widget-attendance';
import { HttpErrorResponse } from '@angular/common/http';
import { CalendarModel } from '../../../core/model/calendar.model';
import { CalendarServiceService } from '../../../core/services/calendar-service.service';
  // import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';


  @Component({
    selector: 'app-widget-cards',
    standalone: true,
    imports: [WidgetCardComponent,FormsModule, RouterLink, RouterOutlet],
    templateUrl: './widget-cards.component.html',
    styleUrl: './widget-cards.component.css'
  })
  export class WidgetCardsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() selectedBatch!: Batch; // Input to receive the selected batch
    @Output() widgetSelected = new EventEmitter<{ header: string }>();
  
    totalTrainees = 0;
    onTimeNum = 0;
    absentees = 0;
    lateArrivals = 0;
    earlyDepartures = 0;
    activeCardIndex = -1;
    holidays: CalendarModel[] = [];
    totalWorkingDays:number = 28;
    selectedGlobalDate:Date = new Date();
  
    selectedDate = { day: 0, month: 0, year: 0 };
    private dateSubscription!: Subscription;
  
    constructor(
      private traineeService: TraineeServiceService,
      private messageService: MessageService,
      private traineeAttendanceLogs: TraineeAttendancelogService,
      private calendarServiceService:CalendarServiceService
    ) {}
/**
 * Initializes the component and sets up initial data fetching.
 * It fetches the latest date and attendance counts, subscribes to date changes, and retrieves the total number of trainees.
 */
    ngOnInit(): void {
      this.fetchLatestDateAndCounts();
      this.subscribeToDateUpdates();  // Subscribe after fetching the latest date
      this.fetchTotalTrainees();
    }
/**
 * Handles changes to the `selectedBatch` input. When the selected batch changes, 
 * it triggers fetching of updated attendance counts specific to the new batch.
 *
 * @param changes Contains the changes to input properties, including the new selected batch.
 */
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['selectedBatch'] && this.selectedBatch) {
        // console.log('Batch received in WidgetCardsComponent:', this.selectedBatch);
        this.fetchCounts(); // Fetch counts whenever the batch changes
      }
    }
/**
 * Cleans up resources when the component is destroyed. Specifically, it unsubscribes
 * from the date subscription to prevent memory leaks.
 */
    ngOnDestroy(): void {
      if (this.dateSubscription) {
        this.dateSubscription.unsubscribe();
      }
    }
/**
 * Handles the selection of a widget card by emitting the selected widget's data
 * and updating the active card index.
 *
 * @param data The data related to the selected widget, including its header.
 * @param index The index of the selected widget card.
 */
    clickWidget(data: { header: string }, index: number) {
      this.activeCardIndex = index;
      this.widgetSelected.emit(data);
    }
/**
 * Subscribes to date updates from the `TraineeAttendancelogService`. Whenever the selected date changes,
 * it updates the `selectedDate` property and fetches the updated attendance counts.
 */
    private subscribeToDateUpdates(): void {
      this.dateSubscription = this.traineeAttendanceLogs.selectedDate$.subscribe(date => {
        if (date) {
          this.selectedDate = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          };
          // console.log('Date selected:', this.selectedDate);
          this.fetchCounts();
        } else {
          // console.log('Invalid date received:', date);
        }
      });
    }

/**
 * Fetches the latest available date for attendance logs and updates the selected date.
 * Once the date is retrieved, it also triggers fetching of attendance counts for that date.
 */
    private fetchLatestDateAndCounts(): void {
      this.traineeAttendanceLogs.getLatestDate().subscribe({
        next: (response: { latestDate: string }) => {
          if (response?.latestDate) {
            const latestDate = new Date(response.latestDate);
            this.selectedDate = {
              day: latestDate.getDate(),
              month: latestDate.getMonth() + 1,
              year: latestDate.getFullYear()
            };
            this.traineeAttendanceLogs.setSelectedDate(latestDate);
            this.fetchCounts();
          }
        },
        error: (error) => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' }),
      });
    }
  
/**
 * Retrieves the total number of trainees by calling the `TraineeServiceService`.
 * Updates the `totalTrainees` property with the response data.
 */
    private fetchTotalTrainees(): void {
      this.traineeService.getTraineesCount().subscribe({
        next: response => (this.totalTrainees = response),
        error: error => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' }),
      });
    }

/**
 * Fetches attendance counts for on-time arrivals, late arrivals, absentees, and early departures.
 * Uses the `selectedDate` to filter data for the selected day, month, and year.
 */
    private fetchCounts(): void {
      const { day, month, year } = this.selectedDate;
      this.selectedGlobalDate = new Date(year, month-1, day);

      this.traineeAttendanceLogs.onTimeLogs(day, month, year).subscribe({
        next: (data) => this.onTimeNum = this.getFilteredCount(data.earlyArrivals),
        error: (error) => this.handleFetchError(error),
      });
  
      this.traineeAttendanceLogs.lateArrivalLogs(day, month, year).subscribe({
        next: (data) => this.lateArrivals = this.getFilteredCount(data.lateArrivals),
        error: (error) => this.handleFetchError(error),
      });
  
      this.traineeAttendanceLogs.absenteeLogs(day, month, year).subscribe({
        next: (data) => this.absentees = this.getFilteredCount(data.absentees),
        error: (error) => this.handleFetchError(error),
      });
  
      this.traineeAttendanceLogs.earlyDeparturesLogs(day, month, year).subscribe({
        next: (data) => this.earlyDepartures = this.getFilteredCount(data.earlyDepartures),
        error: (error) => this.handleFetchError(error),
      });

      this.countTotalWorkingDays();
    }
  
/**
 * Filters the attendance logs to include only those relevant to the selected batch.
 * If a batch is selected, it returns the count of logs that match the batch; otherwise, it returns the full count.
 *
 * @param logs The attendance logs to filter based on the selected batch.
 * @returns The number of logs that match the selected batch.
 */
    private getFilteredCount(logs: WidgetAttendance[]): number {
      return this.selectedBatch
        ? logs.filter(log => log.batch === this.selectedBatch.batchName).length
        : logs.length;
    }
/**
 * Handles errors encountered during data fetching by displaying an error message
 * using the `MessageService`.
 *
 * @param error The HTTP error response containing error details.
 */
    private handleFetchError(error: HttpErrorResponse): void {
      const errorMessage = error.error?.message || 'An unknown error occurred';
      this.messageService.add({ severity: 'error', summary: errorMessage, detail: 'LogXp' });
    }

    countTotalWorkingDays(){
      let holidayCount:number = 0;
      this.calendarServiceService.getHolidaysOfAYear(new Date().getFullYear())
      .subscribe(data => {
        this.holidays = data;
        this.holidays.forEach((holiday)=>{
          const holidayDate = new Date(holiday.holidayDate)
          if(holidayDate.getMonth() == this.selectedGlobalDate.getMonth()){
            holidayCount++;
          }
        });
        const totalDaysOfMonth:number = new Date(this.selectedGlobalDate.getFullYear(), this.selectedGlobalDate.getMonth()+1, 0).getDate();
        const totalSundays:number = this.countSundaysOfMonth(this.selectedGlobalDate.getMonth(), this.selectedGlobalDate.getFullYear());        
        this.totalWorkingDays = totalDaysOfMonth - totalSundays - holidayCount;
      }); 
    }

    countSundaysOfMonth(month: number, year: number): number{
      let count = 0;
      const firstDay = new Date(year, month, 1);
      // Get the last day of the month
      const lastDay = new Date(year, month+1, 0);
      // Iterate through each day of the month
      for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === 0) { // 0 represents Sunday
          count++;
        }
      }
      return count;
    }
  }