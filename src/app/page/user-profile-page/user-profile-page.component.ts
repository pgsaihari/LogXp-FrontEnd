import { Component, OnInit } from '@angular/core';
import { TopHeaderComponent } from "../../shared/top-header/top-header.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
// import { WidgetCardsComponent } from "../../Features/widget-cards/widget-cards.component";
import { routes } from '../../app.routes';
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
import { Currentuser } from '../../core/interfaces/currentuser';
import { catchError, finalize, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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
  logsCount!: number;
  currentUser!: string;

  constructor(private messageService: MessageService, private api:CalendarServiceService,  private traineeAttendancelogService: TraineeAttendancelogService,
    private authService: AuthService,   
    private route: ActivatedRoute  ) { }
  
  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
     this.route.params.subscribe(params => {
      this.currentUser = params['id']; 
      console.log(this.currentUser)
      this.getLogsByEmployeeCode(this.currentUser);
    });
    console.log(this.traineeLogs);
    this.loadCompanyHoliday();
  }

  getLogsByEmployeeCode(employeeCode: string): void {
    this.traineeAttendancelogService.getLogsByEmployeeCode(employeeCode).pipe(
     
      catchError((error) => {
        console.error('Error fetching trainee details:', error);
       
        return throwError(()=>new Error(error)); 
      }),
      finalize(() => {
        console.log('Fetch trainee operation complete');
        
      })
    ).subscribe(
      (data) => {
        this.traineeLogs = data.logs;
        this.logsCount = data.count;
        console.log('Trainee logs:', data);
      },
      
  );
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
  onTraineeClick() {
    console.log('Trainee tab clicked');
    this.holidayDiv = false;
    this.traineeDiv = true;
    this.batchDiv = false;
  }

  onCalendarClick() {
    console.log('Calendar tab clicked');
    this.holidayDiv = true;
    this.traineeDiv = false;
    this.batchDiv = false;
  }

  onBatchClick() {
    console.log('Batch tab clicked');
    this.holidayDiv = false;
    this.traineeDiv = false;
    this.batchDiv = true;
  }



    downloadAttendanceReport() {

      const reportData = {
          // ... report data
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' }); // Create a Blob from the report data
      const url = URL.createObjectURL(blob);  // Create a URL for the Blob
      const a = document.createElement('a');  // Create a download link
      a.href = url;
      a.download = 'attendance_report.json';  // Set the desired filename
      a.click();  // Trigger the download
      window.URL.revokeObjectURL(url);  // Clean up
      this.messageService.add({ severity: 'success', summary: 'Report Downloaded', detail: 'Attendance report has been downloaded successfully.' });  // Show a success message using MessageService
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
