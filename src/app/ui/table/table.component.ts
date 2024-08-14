import { Component, OnInit } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { NgClass, NgIf } from '@angular/common';
import { TopHeaderComponent } from '../top-header/top-header.component';

interface Trainee {
  id?: string;
  employee?: string;
  ilp?: string;
  date?: string;
  status?: string;
  checkin?: string;
  checkout?: string;
  workhours?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TopHeaderComponent, FormsModule, AutoCompleteModule, CalendarModule, MultiSelectModule, TableModule, NgClass, NgIf],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] = [];
  date2: Date | undefined;
  todayDate: string | undefined;
  selectedOptions: any[] = [];
  
  filterOptions = [
    { name: 'All', code: 'ALL' },
    { name: 'Present', code: 'Present' },
    { name: 'Half Day', code: 'Half Day' },
    { name: 'Absent', code: 'Absent' },
    { name: 'Late Arrival', code: 'Late Arrival' }
  ];

  trainees: Trainee[] = [
    { id: '1000', employee: 'faheem', ilp: 'Batch 3', date: '31-07-2024', status: 'Present', checkin: '09:00', checkout: '18:00', workhours: '9h' },
    { id: '1001', employee: 'Samvrutha', ilp: 'Batch 4', date: '30-07-2024', status: 'Half Day', checkin: '09:00', checkout: '18:00', workhours: '9h' },
    { id: '1002', employee: 'vijin', ilp: 'Batch 4', date: '30-07-2024', status: 'Absent', checkin: '00:00', checkout: '00:00', workhours: '9h' },
    { id: '1003', employee: 'Saii', ilp: 'Batch 3', date: '31-07-2024', status: 'Late Arrival', checkin: '10:30', checkout: '18:00', workhours: '9h' },
    { id: '1004', employee: 'Afthab', ilp: 'Batch 2', date: '10-07-2024', status: 'Present', checkin: '09:00', checkout: '18:00', workhours: '9h' },
    { id: '1005', employee: 'flip', ilp: 'Batch 2', date: '10-07-2024', status: 'Present', checkin: '09:00', checkout: '18:00', workhours: '9h' }
  ];

  filteredTrainees: Trainee[] = [];
  showTimeColumns: boolean = true;

  ngOnInit() {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
    this.filteredTrainees = this.trainees;
    this.checkTimeColumnsVisibility();
  }

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
    this.filterTrainees(event.query);
  }

  filterTrainees(query: string): void {
    if (query) {
      this.filteredTrainees = this.trainees.filter(trainee =>
        Object.values(trainee).some(value =>
          value?.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      this.filteredTrainees = this.trainees;
    }
    this.checkTimeColumnsVisibility();
  }

  filterByDate() {
    if (this.date2) {
      const selectedDateString = this.date2.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      console.log('Selected Date:', selectedDateString);
      this.filteredTrainees = this.trainees.filter(trainee => trainee.date === selectedDateString);
    } else {
      this.filteredTrainees = this.trainees;
    }
    this.checkTimeColumnsVisibility();
  }

  filterByStatus(selectedOptions: any[]) {
    const statusCodes = selectedOptions.map(option => option.code);
    console.log('Filter Statuses:', statusCodes); // Debugging log
  
    if (statusCodes.includes('ALL') || statusCodes.length === 0) {
      this.filteredTrainees = this.trainees;
    } else {
      this.filteredTrainees = this.trainees.filter(trainee => statusCodes.includes(trainee.status || ''));
    }
    this.checkTimeColumnsVisibility();
  }

  isAbsent(status?: string): boolean {
    return status === 'Absent';
  }

  checkTimeColumnsVisibility(): void {
    this.showTimeColumns = this.filteredTrainees.some(trainee => !this.isAbsent(trainee.status));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'status-work-from-office';
      case 'Half Day':
        return 'status-work-from-home';
      case 'Absent':
        return 'status-absent';
      case 'Late Arrival':
        return 'status-late-arrival';
      default:
        return '';
    }
  }

  getTimeClass(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 9 && hours > 0 || (hours === 9 && minutes === 0)) {
      return 'time-on-time';
    } else if (hours >= 9 && hours < 11) {
      return 'time-late';
    } else if (hours === 0 && minutes === 0) {
      return 'time-very-late';
    } else {
      return 'time-very-late';
    }
  }
}
