import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-usercalendar',
  standalone: true,
  imports: [FormsModule, CalendarModule,NgClass,DialogModule,CommonModule,ButtonModule,NgClass],
  templateUrl: './usercalendar.component.html',
  styleUrl: './usercalendar.component.css'
})
export class UsercalendarComponent {
  date: Date[] | undefined;
  displayHolidayDialog: boolean = false;
  selectedDate: Date | null = null;

  isSunday(date: any): boolean {
    const dayOfWeek = new Date(date.year, date.month , date.day).getDay();
    return dayOfWeek === 0; // 0 represents Sunday
  }
}
