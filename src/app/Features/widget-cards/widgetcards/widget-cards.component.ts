  import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
  import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
  import { TraineeServiceService } from '../../../core/services/trainee-service.service';
  import { FormsModule } from '@angular/forms';
  import { MessageService } from 'primeng/api';
  import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { TraineeAttendancelogService } from '../../../core/services/trainee-attendancelog.service';
  // import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';


  @Component({
    selector: 'app-widget-cards',
    standalone: true,
    imports: [WidgetCardComponent,FormsModule, RouterLink, RouterOutlet],
    templateUrl: './widget-cards.component.html',
    styleUrl: './widget-cards.component.css'
  })
  export class WidgetCardsComponent implements OnInit {
    @Output() widgetSelected = new EventEmitter<{header: string }>();

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
      private traineeAttendance : TraineeAttendancelogService
    ) {
      // Subscribe to the updated date observable
      this.dateSubscription = this.traineeAttendance.selectedDate$.subscribe(date => {
        if (date) {
          this.selectedDate = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          };
          console.log(this.selectedDate);
          this.fetchCounts(); // Ensure fetchCounts is called with the updated date
        }
      });
    }

    clickWidget(data: {header: string }, index: number) {
      this.activeCardIndex = index;
      this.widgetSelected.emit(data);
    }

  ngOnInit(): void {
    // Fetch the latest available date on component initialization
  this.traineeAttendance.getLatestDate().subscribe({
    next: (response: { latestDate: string }) => {
      if (response?.latestDate) {
        const latestDate = new Date(response.latestDate);
        this.selectedDate = {
          day: latestDate.getDate(),
          month: latestDate.getMonth() + 1,
          year: latestDate.getFullYear()
        };
        // Fetch the counts for the cards based on the latest date
        this.fetchCounts();
      }
    },
    error: (error) => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' }),
  });
    this.traineeService.getTraineesCount().subscribe({
      next: response => (this.totalTrainees = response),
      error: error => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' }),
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to avoid memory leaks
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }
  private fetchCounts() { 
    const { day, month, year } = this.selectedDate;

    // Fetch the data for all the cards
    this.traineeAttendance.onTimeLogs(day, month, year).subscribe({
      next: (data) => (this.onTimeNum = data.count),
      error: (error) => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' })
    });

    this.traineeAttendance.lateArrivalLogs(day, month, year).subscribe({
      next: (data) => (this.lateArrivals = data.count),
      error: (error) => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' })
    });

    this.traineeAttendance.absenteeLogs(day, month, year).subscribe({
      next: (data) => (this.absentees = data.count),
      error: (error) => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' })
    });

    this.traineeAttendance.earlyDeparturesLogs(day, month, year).subscribe({
      next: (data) => (this.earlyDepartures = data.count),
      error: (error) => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' })
    });
  }
}