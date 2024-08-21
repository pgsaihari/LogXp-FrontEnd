import { Component, Input,OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';

@Component({
  selector: 'app-widget-table',
  standalone: true,
  imports: [TableModule, CalendarModule, AutoCompleteModule, FormsModule, NgClass],
  templateUrl: './widget-table.component.html',
  styleUrl: './widget-table.component.css'
})
export class WidgetTableComponent implements OnChanges {

@Input()tableHeader!: string;
@Input() toggleField: string = 'Check-In';
todayDate: string | undefined;
date: Date | undefined;
filteredTrainees: TraineeAttendanceLogs[] = [];



  trainees: TraineeAttendanceLogs[] = [
    { id: '1000', name: 'faheem', ilp: 'Batch 3', date: '31-07-2024', status: 'Work from Office', checkin:'09:00',checkout:'18:00',workhours:'9h' },
    { id: '1001', name: 'Samvrutha', ilp: 'Batch 4', date: '30-07-2024',  status: 'Work from Home',checkin:'09:00',checkout:'18:45',workhours:'9h' },
    { id: '1002', name: 'vijin', ilp: 'Batch 4', date: '30-07-2024',  status: 'Absent',checkin:'09:20',checkout:'17:30',workhours:'9h' },
    { id: '1003', name: 'Saii', ilp: 'Batch 3', date: '31-07-2024',  status: 'Late Arrival',checkin:'10:30',checkout:'18:00',workhours:'9h'},
    { id: '1004', name: 'Afthab', ilp: 'Batch 2', date: '10-07-2024',  status: 'Work from Office',checkin:'09:00',checkout:'16:00',workhours:'9h' },
    { id: '1005', name: 'flip', ilp: 'Batch 2', date: '10-07-2024',  status: 'Work from Office',checkin:'09:00',checkout:'16:30',workhours:'9h' }
];



ngOnChanges(changes: SimpleChanges): void {
  if (changes['tableHeader'] || changes['toggleField']) {
    this.filterTrainees();
  }
}


filterTrainees(query: string = ''): void {
  if (this.tableHeader === 'On Time') {
    this.filteredTrainees = this.trainees.filter(trainee => this.isBefore0910(trainee.checkin));
  } else if (this.tableHeader === 'Late Arrivals') {
    this.filteredTrainees = this.trainees.filter(trainee => this.isAfter0910(trainee.checkin));
  }else if (this.tableHeader === 'Early Departures') {
    this.filteredTrainees = this.trainees.filter(trainee => this.isEarlyDeparture(trainee.checkout));
  } else {
    // Add additional conditions if needed
    this.filteredTrainees = this.trainees;
  }
  if (query) {
    this.filteredTrainees = this.filteredTrainees.filter(trainee =>
      Object.values(trainee).some(value =>
        value?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }
}

// Helper methods for filtering
isBefore0910(time: string | undefined): boolean {
  if (!time) return false;
  const [hours, minutes] = time.split(':').map(Number);
  return (hours === 9 && minutes <= 10) || (hours <= 8);
}

isAfter0910(time: string | undefined): boolean {
  if (!time) return false;
  const [hours, minutes] = time.split(':').map(Number);
  return (hours === 9 && minutes > 10) || (hours >= 10);
}

isEarlyDeparture(time: string | undefined): boolean {
  if (!time) return false;
  const [hours] = time.split(':').map(Number);
  return hours <= 17;
}

getTimeClass(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  if ((hours < 9 && hours > 0) || (hours === 9 && minutes === 0)) {
    return 'time-on-time';
  } else if ((hours >= 10 && hours < 18) || (hours>=9 && minutes >10)) { 
    return 'time-late';
  } 
  else if (hours === 0 && minutes === 0) {
    return 'time-very-late';
  }
  else {
    return 'time-very-late';
  }
}



}
