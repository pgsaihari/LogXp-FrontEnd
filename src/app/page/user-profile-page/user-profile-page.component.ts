import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { SingleUserTableComponent } from "../../ui/single-user-table/single-user-table.component";
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
import { catchError, finalize, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [TableModule,CommonModule,UserWidgetCardsComponent, NgxSpinnerComponent, SingleUserTableComponent, CalendarModule, FormsModule],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})

export class UserProfilePageComponent implements OnInit {
  @ViewChild('calendarPopup') calendarPopup!: ElementRef; // Reference to the calendar popup

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

  yesterday: Date = new Date();
  selectedDates: Date[] = []; // Model for the selected date range
  filteredAttendanceLogs: TraineeAttendanceLogs[] = []; // Filtered data
  showCalendar: boolean = false;

  constructor(private messageService: MessageService, private api:CalendarServiceService,  private traineeAttendancelogService: TraineeAttendancelogService,
    private authService: AuthService,   
    private route: ActivatedRoute,
    private el: ElementRef) { }
  
  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
     this.route.params.subscribe(params => {
      this.currentUser = params['id']; 
      // console.log(this.currentUser)
      this.getLogsByEmployeeCode(this.currentUser);
    });
    // console.log(this.traineeLogs);
    this.loadCompanyHoliday();

    if (currentUser) {
        this.traineeCode = currentUser.userId; // Assuming userId is the trainee's employee code

        if (this.traineeCode) {
          this.traineeAttendancelogService.setCurrentUser(this.traineeCode);
          this.loadTraineeLogs(this.traineeCode);
        }
    } else {
        console.error('No logged-in user found.');
    }
  }

  // Toggle calendar visibility
  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  // Close the calendar if clicking outside of it
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.showCalendar && this.calendarPopup && !this.calendarPopup.nativeElement.contains(event.target)) {
      this.showCalendar = false; // Close the calendar if click is outside
    }
  }

  // Reset the table to the unfiltered state
  onDateSelect(): void {
    if (this.selectedDates && this.selectedDates.length === 2) {
      const [startDate, endDate] = this.selectedDates;
      this.filterByDate(startDate, endDate);
    }
  }

  // Apply filter only when both start and end dates are selected
  filterByDate(startDate: Date, endDate: Date): void {
    if (startDate && endDate) {
      this.showCalendar = false;
      this.filteredAttendanceLogs = this.traineeLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startDate && logDate <= endDate;
      });
    } else {
      this.filteredAttendanceLogs = [...this.traineeLogs]; // No dates selected, show all logs
    }
  }

  // Close calendar when reset button is clicked
  resetTable(){
    this.showCalendar = false;
    this.selectedDates = [];
    this.filteredAttendanceLogs = [...this.traineeLogs];
  }

  getLogsByEmployeeCode(employeeCode: string): void {
    this.traineeAttendancelogService.getLogsByEmployeeCode(employeeCode).pipe(
     
      catchError((error) => {
        console.error('Error fetching trainee details:', error);
       
        return throwError(()=>new Error(error)); 
      }),
      finalize(() => {
        // console.log('Fetch trainee operation complete');
        
      })
    ).subscribe(
      (data) => {
        this.traineeLogs = data.logs;
        this.filteredAttendanceLogs = this.traineeLogs;
        this.logsCount = data.count;
        // console.log('Trainee logs:', data);
      },
      
  );
  }
  parseFloat(value: string): number {
    return parseFloat(value);
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
    // console.log('Trainee tab clicked');
    this.holidayDiv = false;
    this.traineeDiv = true;
    this.batchDiv = false;
  }

  onCalendarClick() {
    // console.log('Calendar tab clicked');
    this.holidayDiv = true;
    this.traineeDiv = false;
    this.batchDiv = false;
  }

  onBatchClick() {
    // console.log('Batch tab clicked');
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
