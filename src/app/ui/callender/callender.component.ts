import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-callender',
  standalone: true,
  imports: [FormsModule, CalendarModule,NgClass,DialogModule,CommonModule,ButtonModule,NgClass],
  templateUrl: './callender.component.html',
  styleUrl: './callender.component.css'
})
export class CallenderComponent {

    date: Date[] | undefined;
    displayHolidayDialog: boolean = false;
    selectedDate: Date | null = null;
    holidays: { [key: string]: string } = {};
    isHoliday: boolean = false;
  
    onDateSelect(event: any) {
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
  
    setHoliday(type: string) {
      if (this.selectedDate) {
        const dateKey = this.selectedDate.toDateString();
        this.holidays[dateKey] = type;
      }
      this.displayHolidayDialog = false;
    }
  
    removeHoliday() {
      if (this.selectedDate) {
        const dateKey = this.selectedDate.toDateString();
        delete this.holidays[dateKey]; // Remove the holiday from the selected date
      }
      this.displayHolidayDialog = false;
    }
  
    getHolidayClass(date: any): string {
      const dateKey = new Date(date.year, date.month , date.day).toDateString();
      if (this.holidays[dateKey] === 'full') {
        return 'full-holiday';
      } else if (this.holidays[dateKey] === 'half') {
        return 'half-holiday';
      }
      return '';
    }
  
    isSunday(date: any): boolean {
      const dayOfWeek = new Date(date.year, date.month , date.day).getDay();
      return dayOfWeek === 0; // 0 represents Sunday
    }
  }
  