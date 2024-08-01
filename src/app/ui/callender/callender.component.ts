import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-callender',
  standalone: true,
  imports: [FormsModule,CalendarModule,CommonModule,DialogModule],
  templateUrl: './callender.component.html',
  styleUrl: './callender.component.css'
})
export class CallenderComponent implements AfterViewInit {
  date: Date | undefined;
  selectedDate: Date | undefined;
  displayDialog: boolean = false;

  holidays: Date[] = [new Date(2023, 4, 4), new Date(2023, 4, 18)];
  partialLeaves: Date[] = [new Date(2023, 4, 22)];
  fullLeaves: Date[] = [new Date(2023, 4, 18)];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.applyDateStyles();
      this.applySundayStyles(); // Ensure Sundays are styled when the calendar first loads
    }, 0);
  }

  onDateSelect(event: any) {
    this.selectedDate = event;
    this.displayDialog = true;
  }

  confirm() {
    if (this.selectedDate) {
      this.holidays.push(new Date(this.selectedDate));
      console.log(this.holidays);
      this.applyDateStyles(); // Reapply styles after confirming
    }
    this.displayDialog = false;
  }

  cancel() {
    this.displayDialog = false;
  }

  isHoliday(date: Date): boolean {
    return this.holidays.some(d => d.toDateString() === date.toDateString());
  }

  isPartialLeave(date: Date): boolean {
    return this.partialLeaves.some(d => d.toDateString() === date.toDateString());
  }

  isFullLeave(date: Date): boolean {
    return this.fullLeaves.some(d => d.toDateString() === date.toDateString());
  }

  isSunday(date: Date): boolean {
    return date.getDay() === 0; // Sunday is 0
  }

  applyDateStyles() {
    this.addDateAttributesToCells();

    const cells = document.querySelectorAll('.custom-calendar .p-datepicker td');

    cells.forEach(cell => {
      const dateString = cell.getAttribute('data-date');
      
      if (dateString) {
        const cellDate = new Date(dateString);

        if (isNaN(cellDate.getTime())) {
          console.error(`Invalid date: ${dateString}`);
          return;
        }

        cell.classList.toggle('holiday', this.isHoliday(cellDate));
        cell.classList.toggle('partial-leave', this.isPartialLeave(cellDate));
        cell.classList.toggle('full-leave', this.isFullLeave(cellDate));
      } else {
        console.warn(`No data-date attribute found on cell`);
      }
    });
  }

  applySundayStyles() {
    this.addDateAttributesToCells();

    const cells = document.querySelectorAll('.custom-calendar .p-datepicker td');

    cells.forEach(cell => {
      const dateString = cell.getAttribute('data-date');
      
      if (dateString) {
        const cellDate = new Date(dateString);

        if (isNaN(cellDate.getTime())) {
          console.error(`Invalid date: ${dateString}`);
          return;
        }

        if (this.isSunday(cellDate)) {
          cell.classList.add('sunday');
        } else {
          cell.classList.remove('sunday');
        }
      } else {
        console.warn(`No data-date attribute found on cell`);
      }
    });
  }

  addDateAttributesToCells() {
    const cells = document.querySelectorAll('.custom-calendar .p-datepicker td');

    cells.forEach(cell => {
      const cellText = cell.textContent?.trim();
      if (cellText) {
        const day = parseInt(cellText, 10);
        if (!isNaN(day)) {
          const cellDate = new Date();
          cellDate.setDate(day);
          cellDate.setMonth(this.date?.getMonth() || new Date().getMonth());
          cellDate.setFullYear(this.date?.getFullYear() || new Date().getFullYear());

          cell.setAttribute('data-date', cellDate.toISOString().split('T')[0]);
        }
      }
    });
  }

  onMonthChange(event: any) {
    this.applyDateStyles();
    this.applySundayStyles(); // Reapply Sunday styles on month change
  }
}
