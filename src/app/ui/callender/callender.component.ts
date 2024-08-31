import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { CalendarServiceService } from '../../core/services/calendar-service.service';
import { CalendarModel } from '../../core/model/calendar.model';

@Component({
  selector: 'app-callender',
  standalone: true,
  imports: [FormsModule, CalendarModule, NgClass, DialogModule, CommonModule, ButtonModule, NgClass],
  templateUrl: './callender.component.html',
  styleUrls: ['./callender.component.css']
})
/**
 * Component responsible for managing a calendar with holiday settings.
 */
export class CallenderComponent {

  date: Date[] | undefined;
  displayHolidayDialog: boolean = false;
  selectedDate!: Date;
  isHoliday: boolean = false;
  companyHolidays:CalendarModel[] = [];
  halfHolidayDates:Date[] = [];
  fullHolidayDates:Date[] = [];
  today: Date = new Date();
  /**
   *
   */
  constructor(private api:CalendarServiceService) {}

  ngOnInit(){
    this.loadCompanyHoliday();
  }
  /**
   * Handles the selection of a date on the calendar.
   * @param {any} event - The event triggered by date selection.
   */
  onDateSelect(event: any): void {
    const fullHolidayIndex = this.fullHolidayDates.findIndex(date => date.getDate() === event.getDate() &&
    date.getMonth() === event.getMonth() &&
    date.getFullYear() === event.getFullYear());
    const halfHolidayIndex = this.halfHolidayDates.findIndex(date => date.getDate() === event.getDate() &&
    date.getMonth() === event.getMonth() &&
    date.getFullYear() === event.getFullYear());

    this.selectedDate = event;
    
    if(fullHolidayIndex != -1 || halfHolidayIndex != -1){
      this.isHoliday = true;
    }
    else{
      this.isHoliday = false;
    }
    this.displayHolidayDialog = true;
  }

  /**
   * Sets the selected date as a holiday of the specified type (full or half).
   * @param {string} type - The type of holiday (e.g., 'full' or 'half').
   */
  setHoliday(type: string): void {
    type == "full_day"? this.fullHolidayDates.push(new Date(this.selectedDate)):this.halfHolidayDates.push(new Date(this.selectedDate));
    this.createHolidayAndPost(type);
    this.displayHolidayDialog = false;
  }

  createHolidayAndPost(type:string){
    const localDate = new Date(this.selectedDate);
    localDate.setHours(0, 0, 0, 0); 
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();

    const newHoliday:CalendarModel = {
      holidayName : "Added Holiday",
      holidayDate:utcDate,
      holidayType : type,
      region : "COC/TVM",
      remarks : "Added holiday"
    };
    this.api.addHoliday(newHoliday)
    .subscribe(data => {
      console.log(data);
    }); 
  }

  /**
   * Removes the holiday status from the selected date.
   */
  removeHoliday(): void {
    if (this.selectedDate) {
      const dateString = `${this.selectedDate.getFullYear()}-${this.selectedDate.getMonth() + 1}-${this.selectedDate.getDate()}`;
      this.api.removeHoliday(dateString)
      .subscribe(data => {
        console.log(data);
      });
      this.fullHolidayDates = this.fullHolidayDates.filter(date => !this.areDatesEqual(date, this.selectedDate));
      this.halfHolidayDates = this.halfHolidayDates.filter(date => !this.areDatesEqual(date, this.selectedDate));
    }
    this.displayHolidayDialog = false;
  }



  /**
   * Checks if the given date falls on a Sunday.
   * @param {any} date - The date object provided by the calendar component.
   * @returns {boolean} - True if the date is a Sunday, false otherwise.
   */
  isSunday(date: any): boolean {
    const dayOfWeek = new Date(date.year, date.month, date.day).getDay();
    return dayOfWeek === 0; // 0 represents Sunday
  }

  loadCompanyHoliday(){
    this.api.getHolidaysOfAYear(new Date().getFullYear())
    .subscribe(data => {
      this.companyHolidays = data;
      this.companyHolidays.forEach((item) =>{
        if(item.holidayType == "full_day"){
          this.fullHolidayDates.push(new Date(item.holidayDate));
        }
        else{
          this.halfHolidayDates.push(new Date(item.holidayDate));
        }
      });
    }); 
  }

  areDatesEqual(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  isCompanyHoliday(date:any): boolean{
    return this.fullHolidayDates.some(holidayDate =>
      holidayDate.getFullYear() === date.year &&
      holidayDate.getMonth() === date.month &&
      holidayDate.getDate() === date.day
  )};

  isCompanyHalfHoliday(date:any):boolean{
    return this.halfHolidayDates.some(holidayDate =>
      holidayDate.getFullYear() === date.year &&
      holidayDate.getMonth() === date.month &&
      holidayDate.getDate() === date.day
  )};

}
