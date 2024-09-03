  import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
  import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
  import { TraineeServiceService } from '../../../core/services/trainee-service.service';
  import { FormsModule } from '@angular/forms';
  import { MessageService } from 'primeng/api';
  import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { TraineeAttendancelogService } from '../../../core/services/trainee-attendancelog.service';
import { Batch } from '../../../core/model/batch.model';
import { WidgetAttendance } from '../../../core/interfaces/widget-attendance';
import { HttpErrorResponse } from '@angular/common/http';
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
  
    selectedDate = { day: 0, month: 0, year: 0 };
    private dateSubscription!: Subscription;
  
    constructor(
      private traineeService: TraineeServiceService,
      private messageService: MessageService,
      private traineeAttendanceLogs: TraineeAttendancelogService
    ) {}
  
    ngOnInit(): void {
      this.subscribeToDateUpdates();
      this.fetchLatestDateAndCounts();
      this.fetchTotalTrainees();
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['selectedBatch'] && this.selectedBatch) {
        console.log('Batch received in WidgetCardsComponent:', this.selectedBatch);
        this.fetchCounts(); // Fetch counts whenever the batch changes
      }
    }
  
    ngOnDestroy(): void {
      if (this.dateSubscription) {
        this.dateSubscription.unsubscribe();
      }
    }
  
    clickWidget(data: { header: string }, index: number) {
      this.activeCardIndex = index;
      this.widgetSelected.emit(data);
    }
  
    private subscribeToDateUpdates(): void {
      this.dateSubscription = this.traineeAttendanceLogs.selectedDate$.subscribe(date => {
        if (date) {
          this.selectedDate = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          };
          console.log(this.selectedDate);
          this.fetchCounts();
        }
      });
    }
  
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
            this.fetchCounts();
          }
        },
        error: (error) => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' }),
      });
    }
  
    private fetchTotalTrainees(): void {
      this.traineeService.getTraineesCount().subscribe({
        next: response => (this.totalTrainees = response),
        error: error => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' }),
      });
    }
  
    private fetchCounts(): void {
      const { day, month, year } = this.selectedDate;
  
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
    }
  
    private getFilteredCount(logs: WidgetAttendance[]): number {
      return this.selectedBatch
        ? logs.filter(log => log.batch === this.selectedBatch.batchName).length
        : logs.length;
    }

    private handleFetchError(error: HttpErrorResponse): void {
      const errorMessage = error.error?.message || 'An unknown error occurred';
      this.messageService.add({ severity: 'error', summary: errorMessage, detail: 'LogXp' });
    }
  }