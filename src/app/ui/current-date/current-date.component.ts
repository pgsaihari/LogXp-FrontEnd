  import { DatePipe, NgClass, NgIf } from '@angular/common';
  import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
  import { CardModule } from 'primeng/card';
  import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
  import { catchError, of } from 'rxjs';
  import { ButtonModule } from 'primeng/button';
  import { CalendarModule } from 'primeng/calendar';
  import { FormsModule } from '@angular/forms';

  @Component({
    selector: 'app-current-date',
    standalone: true,
    imports: [CardModule, DatePipe,ButtonModule, CalendarModule, FormsModule, NgIf],
    templateUrl: './current-date.component.html',
    styleUrl: './current-date.component.css'
  })
  export class CurrentDateComponent implements OnInit{
    currentTime!: Date;
    currentDate!: Date;
    latestLogDate!: Date
    timeIcon: string = '';
    timeOfDay: string = '';
    error: any;
    showCalendar: boolean = false; // Control calendar visibility
    selectedDate!: Date // Store selected date
    maxDate!: Date;
    constructor(private api: TraineeAttendancelogService, private elementRef: ElementRef) {}

    ngOnInit() {
       this.getThelatestDate();
      // this.updateTime();
      // setInterval(() => this.updateTime(), 1000);
    }

    // updateTime() {
    //   this.currentTime = new Date();
    //   this.currentDate = new Date();

    //   const hours = this.currentTime.getHours();

    //   if (hours >= 6 && hours < 12) {
    //     this.timeIcon = 'pi pi-sun'; // Morning sun icon
    //   } else if (hours >= 12 && hours < 18) {
    //     this.timeIcon = 'pi pi-sun'; // Blazing sun icon
    //   } else if (hours >= 18 && hours < 20) {
    //     this.timeIcon = 'pi pi-sunset'; // Setting sun icon
    //   } else {
    //     this.timeIcon = 'pi pi-moon'; // Moon icon
    //   }

    //   if (hours >= 6 && hours < 12) {
    //     this.timeOfDay = 'morning';
    //   } else if (hours >= 12 && hours < 18) {
    //     this.timeOfDay = 'afternoon';
    //   } else if (hours >= 18 && hours < 20) {
    //     this.timeOfDay = 'evening';
    //   } else {
    //     this.timeOfDay = 'night';
    //   }

    // }

    getThelatestDate() {
      this.api.getWidgetCount().subscribe((data) => {
        if (data.latestDate) {
          this.latestLogDate = new Date(data.latestDate);
          this.selectedDate = new Date(this.latestLogDate);
          this.maxDate = new Date(this.latestLogDate);
  
          // Set the selected date in the service
          this.api.setSelectedDate(this.selectedDate);
        }
      });
    }

    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
      console.log('Show Calendar:', this.showCalendar); // Verify the state
    }
    
    onDateSelect(event: any) {
      this.selectedDate = event;
      this.api.setSelectedDate(this.selectedDate);
      this.showCalendar = false; // Hide the calendar after selecting a date
      console.log('Selected Date:', this.selectedDate);
      this.latestLogDate = this.selectedDate
      // Call onDateChange after selecting the date
      this.onDateChange(this.selectedDate);
    }

    onDateChange(date: Date) {
      this.selectedDate = date;
      const formattedDate = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
      this.api.updateSelectedDate(formattedDate);
    }
    
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showCalendar = false;
      }
    }
  }