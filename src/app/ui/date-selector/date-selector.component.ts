import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarModule, CardModule],
  templateUrl: './date-selector.component.html',
  styleUrl: './date-selector.component.css'
})
export class DateSelectorComponent implements OnInit{
  
  dateForm!: FormGroup ;

  ngOnInit() {
    this.dateForm = new FormGroup({
        date: new FormControl<Date | null>(null)
    });

    // Subscribe to value changes of the date control
    this.dateForm.get('date')!.valueChanges.subscribe(value => {
      this.updateLeaveDetails();
    });
  }

  totalWorkingDays: number = 0;
  totalFullDayLeave: number = 0;
  totalHalfDayLeave: number = 0;

  updateLeaveDetails() {
    // Update the values dynamically based on your logic
    this.totalWorkingDays = 25;
    this.totalFullDayLeave = 1;
    this.totalHalfDayLeave = 1;
  }

}
