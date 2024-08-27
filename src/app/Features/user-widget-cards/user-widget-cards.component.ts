import { Component } from '@angular/core';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { AttendanceLogsService } from '../../core/services/attendance-logs.service';

@Component({
  selector: 'app-user-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent, RouterLink, RouterOutlet],
  templateUrl: './user-widget-cards.component.html',
  styleUrl: './user-widget-cards.component.css'
})
export class UserWidgetCardsComponent {
absent= 0;
earlyDepartures= 0;
lateArrivals= 0;
onTimeNum= 0;
traineeCode=9015;

constructor(private attendanceLogsService: AttendanceLogsService) {}

ngOnInit(): void {
  this.fetchCounts();
}
  private fetchCounts() {
    const id = this.traineeCode;
    this.attendanceLogsService.getUserWidgetCount(id).subscribe(count => {
      // this.onTimeNum = count.earlyArrivalCount;
      this.absent = count.numberOfDaysAbsent;
      this.lateArrivals = count.numberOfDaysLate;
      // this.earlyDepartures = count.earlyDepartureCount;
    });
  }

}
