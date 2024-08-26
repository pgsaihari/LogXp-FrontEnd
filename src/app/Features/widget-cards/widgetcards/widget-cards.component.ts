  import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
  import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
  import { TraineeServiceService } from '../../../core/services/trainee-service.service';
  import { FormsModule } from '@angular/forms';
  import { MessageService } from 'primeng/api';
  import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';
  import { RouterLink, RouterOutlet } from '@angular/router';
  // import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';


  @Component({
    selector: 'app-widget-cards',
    standalone: true,
    imports: [WidgetCardComponent,FormsModule, RouterLink, RouterOutlet],
    templateUrl: './widget-cards.component.html',
    styleUrl: './widget-cards.component.css'
  })
  export class WidgetCardsComponent implements OnInit {
    @Output() widgetSelected = new EventEmitter<{ isClicked: boolean, header: string }>();

    totalTrainees = 0;
    onTimeNum = 0;
    absentees = 0;
    lateArrivals = 0;
    earlyDepartures = 0;
    activeCardIndex = -1;

    constructor(
      private traineeService: TraineeServiceService,
      private messageService: MessageService,
      private attendanceLogsService: AttendanceLogsService
    ) {}

    clickWidget(data: { isClicked: boolean, header: string }, index: number) {
      this.activeCardIndex = index;
      this.widgetSelected.emit(data);
    }

    ngOnInit(): void {
      this.traineeService.getTraineesCount().subscribe({
        next: response => (this.totalTrainees = response),
        error: error => this.messageService.add({ severity: 'error', summary: error.error.message, detail: 'LogXp' })
      });

      this.fetchCounts();
    }

    private fetchCounts() {
      this.attendanceLogsService.getWidgetCount().subscribe(count => {
        this.onTimeNum = count.earlyArrivalCount;
        this.absentees = count.absentCount;
        this.lateArrivals = count.lateArrivalCount;
        this.earlyDepartures = count.earlyDepartureCount;
      });
    }
  }