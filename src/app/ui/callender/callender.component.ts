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
  selectedDate: Date | null = null;
  holidays: { [key: string]: string } = {};
  isHoliday: boolean = false;
  companyHolidays:CalendarModel[] = [];
  holidayDates:Date[] = [];

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
    // Check if the event is already a Date object
    if (event instanceof Date) {
      this.selectedDate = event;
    } else {
      console.error('Invalid date selected:', event);
      this.selectedDate = null;
    }

    if (this.selectedDate) {
      const dateKey = this.selectedDate.toDateString();
      this.isHoliday = !!this.holidays[dateKey]; // Check if the selected date is already a holiday
      this.displayHolidayDialog = true;
    }
  }

  /**
   * Sets the selected date as a holiday of the specified type (full or half).
   * @param {string} type - The type of holiday (e.g., 'full' or 'half').
   */
  setHoliday(type: string): void {
    if (this.selectedDate) {
      const dateKey = this.selectedDate.toDateString();
      this.holidays[dateKey] = type;
    }
    this.displayHolidayDialog = false;
  }

  /**
   * Removes the holiday status from the selected date.
   */
  removeHoliday(): void {
    if (this.selectedDate) {
      const dateKey = this.selectedDate.toDateString();
      delete this.holidays[dateKey]; // Remove the holiday from the selected date
    }
    this.displayHolidayDialog = false;
  }

  /**
   * Returns a CSS class based on the holiday type for a given date.
   * @param {any} date - The date object provided by the calendar component.
   * @returns {string} - The CSS class for full or half holidays.
   */
  getHolidayClass(date: any): string {
    const dateKey = new Date(date.year, date.month, date.day).toDateString();
    if (this.holidays[dateKey] === 'full') {
      return 'full-holiday';
    } else if (this.holidays[dateKey] === 'half') {
      return 'half-holiday';
    }
    return '';
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
        this.holidayDates.push(new Date(item.holidayDate));
      });
    }); 
  }

  isCompanyHoliday(date:any): boolean{
    return this.holidayDates.some(holidayDate =>
      holidayDate.getFullYear() === date.year &&
      holidayDate.getMonth() === date.month &&
      holidayDate.getDate() === date.day
  )}

}
