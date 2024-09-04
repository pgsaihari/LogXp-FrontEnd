import { Component, OnInit } from '@angular/core';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent, RouterLink, RouterOutlet],
  templateUrl: './user-widget-cards.component.html',
  styleUrls: ['./user-widget-cards.component.css'] // Corrected the styleUrl to styleUrls
})
export class UserWidgetCardsComponent implements OnInit {
  absent!: number;
  earlyDepartures!: number;
  lateArrivals!: number;
  onTimeNum!: number;
  traineeCode!: number;
  currentUser!: string;

  constructor(
    private attendanceLogsService: TraineeAttendancelogService,
    private route: ActivatedRoute // Inject ActivatedRoute service
  ) {}

  ngOnInit(): void {
    this.currentUser = this.attendanceLogsService.getCurrentUser();
    console.log('Current User:', this.currentUser);
    this.route.params.subscribe(params => {
      this.currentUser = params['id']; 
      console.log(this.currentUser)
      this.fetchCounts(this.currentUser);
    });
  }
  

  private fetchCounts(currentUser : string) {
    const id = currentUser;
    this.attendanceLogsService.getUserWidgetCount(id).subscribe(count => {
      this.absent = count['absentDaysCount'];
      this.lateArrivals = count['lateArrivalDaysCount'];
      this.onTimeNum = count['onTimeDaysCount'];
      this.earlyDepartures = count['earlyDepartureDaysCount'];
      console.log(count);
    });
  }
}
