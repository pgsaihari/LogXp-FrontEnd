import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-current-date',
  standalone: true,
  imports: [CardModule, NgClass, DatePipe],
  templateUrl: './current-date.component.html',
  styleUrl: './current-date.component.css'
})
export class CurrentDateComponent implements OnInit{
  currentTime!: Date;
  currentDate!: Date;
  timeIcon: string = '';
  timeOfDay: string = '';

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    this.currentTime = new Date();
    this.currentDate = new Date();

    const hours = this.currentTime.getHours();

    if (hours >= 6 && hours < 12) {
      this.timeIcon = 'pi pi-sun'; // Morning sun icon
    } else if (hours >= 12 && hours < 18) {
      this.timeIcon = 'pi pi-sun'; // Blazing sun icon
    } else if (hours >= 18 && hours < 20) {
      this.timeIcon = 'pi pi-sunset'; // Setting sun icon
    } else {
      this.timeIcon = 'pi pi-moon'; // Moon icon
    }

    if (hours >= 6 && hours < 12) {
      this.timeOfDay = 'morning';
    } else if (hours >= 12 && hours < 18) {
      this.timeOfDay = 'afternoon';
    } else if (hours >= 18 && hours < 20) {
      this.timeOfDay = 'evening';
    } else {
      this.timeOfDay = 'night';
    }

  }
}
