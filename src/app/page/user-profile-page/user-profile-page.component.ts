import { Component, OnInit } from '@angular/core';
import { TopHeaderComponent } from "../../shared/top-header/top-header.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
// import { WidgetCardsComponent } from "../../Features/widget-cards/widget-cards.component";
import { CalendarModule } from 'primeng/calendar';
import { CallenderComponent } from '../../ui/callender/callender.component';
import { FormComponent } from '../../ui/form/form.component';
import { WidgetTableComponent } from "../../ui/widget-table/widget-table.component";
import { UserTableComponent } from "../../ui/user-table/user-table.component";
import { SingleUserTableComponent } from "../../ui/single-user-table/single-user-table.component";
import { SideUserProfileComponent } from "../../Features/side-user-profile/side-user-profile.component";
import { UserWidgetCardsComponent } from "../../Features/user-widget-cards/user-widget-cards.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { CalendarModel } from '../../core/model/calendar.model';
import { CalendarServiceService } from '../../core/services/calendar-service.service';
import { MenuItem, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { AuthService } from '../../core/services/auth.service';
// import { WidgetCardsComponent } from "../../Features/widget-cards/widget-cards.component";



@Component({
  selector: 'app-user-profile-page',
  standalone: true,

  imports: [TableModule,CommonModule,UserWidgetCardsComponent, NgxSpinnerComponent, SingleUserTableComponent],

  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent implements OnInit {
  traineeLogs: TraineeAttendanceLogs[] = [];
    traineeCode: string | null = null;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  traineeDiv = true;
  holidayDiv = false;
  batchDiv = false;
  holidays: CalendarModel[] = [];
  receivedHolidayToAdd!: CalendarModel;

  totalFullHolidays: number = 0;
  totalHalfHolidays: number = 0;

  constructor(private messageService: MessageService, private api:CalendarServiceService,  private traineeAttendancelogService: TraineeAttendancelogService,
    private authService: AuthService ) { }
  
  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
        this.traineeCode = currentUser.userId; // Assuming userId is the trainee's employee code

        if (this.traineeCode) {
            this.loadTraineeLogs(this.traineeCode);
        }
    } else {
        console.error('No logged-in user found.');
    }
   
   
   
  }

  loadTraineeLogs(traineeCode: string) {
    this.traineeAttendancelogService.getLogsByEmployeeCode(traineeCode).subscribe(
        (data) => {
            this.traineeLogs = data.logs;
        },
        (error) => {
            console.error('Error fetching trainee logs:', error);
        }
    );
}

  loadCompanyHoliday(){
    this.api.getHolidaysOfAYear(new Date().getFullYear())
    .subscribe(data => {
      this.holidays = data;
    }); 
  }

  receivedHoliday(received: CalendarModel) {
    this.holidays.push(received)
    this.holidays.sort((a, b) => {
      return new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime();
    });
  }

  deleteReceivedHoliday(received:Date){
    this.holidays = this.holidays.filter(date => !this.areDatesEqual(new Date(date.holidayDate), received));
  }

  areDatesEqual(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  
}
