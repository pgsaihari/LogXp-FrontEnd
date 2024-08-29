import { Component } from '@angular/core';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';

@Component({
  selector: 'app-user-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent, RouterLink, RouterOutlet],
  templateUrl: './user-widget-cards.component.html',
  styleUrl: './user-widget-cards.component.css'
})
export class UserWidgetCardsComponent {
absent!: number;
earlyDepartures!: number;
lateArrivals!: number;
onTimeNum!: number;
traineeCode=9030;

constructor(private attendanceLogsService: TraineeAttendancelogService) {}

ngOnInit(): void {
  this.fetchCounts();
}
  private fetchCounts() {
    const id = this.traineeCode;
    this.attendanceLogsService.getUserWidgetCount(id).subscribe(count => {
      // this.onTimeNum = count.earlyArrivalCount;
      this.absent = count['absentDaysCount'];
      this.lateArrivals = count['lateArrivalDaysCount'];
      this.onTimeNum = count['onTimeDaysCount'];
      this.earlyDepartures = count['earlyDepartureDaysCount'];
      console.log(count)
      // this.earlyDepartures = count.earlyDepartureCount;
    });
  }

}
