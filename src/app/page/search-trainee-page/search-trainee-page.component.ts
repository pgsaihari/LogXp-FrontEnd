import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { NgClass } from '@angular/common';



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
  selector: 'app-search-trainee-page',
  standalone: true,
  imports: [TopHeaderComponent,FormsModule,AutoCompleteModule,CalendarModule,DropdownModule,TableModule,NgClass],
  templateUrl: './search-trainee-page.component.html',
  styleUrl: './search-trainee-page.component.css'
})
export class SearchTraineePageComponent {
  items: any[] | undefined;

  selectedItem: any;

  suggestions: any[] = [];
  date2: Date | undefined;
  todayDate: string | undefined;


  selectedOption: any;
  options = [
    { name: 'Option 1', code: 'OP1' },
    { name: 'Option 2', code: 'OP2' },
    { name: 'Option 3', code: 'OP3' },
    { name: 'Option 4', code: 'OP4' },
    { name: 'Option 5', code: 'OP5' }
  ];

  trainees: Trainee[] = [
    { id: '1000', employee: 'faheem', ilp: 'Batch 3', date: '31-07-2024', status: 'Work from Office', checkin:'09:00',checkout:'18:00',workhours:'9h' },
    { id: '1001', employee: 'Samvrutha', ilp: 'Batch 4', date: '30-07-2024',  status: 'Work from Home',checkin:'09:00',checkout:'18:00',workhours:'9h' },
    { id: '1002', employee: 'vijin', ilp: 'Batch 4', date: '30-07-2024',  status: 'Absent',checkin:'00:00',checkout:'00:00',workhours:'9h' },
    { id: '1003', employee: 'Saii', ilp: 'Batch 3', date: '31-07-2024',  status: 'Late Arrival',checkin:'10:30',checkout:'18:00',workhours:'9h'},
    { id: '1004', employee: 'Afthab', ilp: 'Batch 2', date: '10-07-2024',  status: 'Work from Office',checkin:'09:00',checkout:'18:00',workhours:'9h' },
    { id: '1005', employee: 'flip', ilp: 'Batch 2', date: '10-07-2024',  status: 'Work from Office',checkin:'09:00',checkout:'18:00',workhours:'9h' }
];



filteredTrainees: Trainee[] = [];

constructor() {}

ngOnInit() {
  const today = new Date();
  this.todayDate = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  this.filteredTrainees = this.trainees; // Initialize filtered trainees
}

search(event: AutoCompleteCompleteEvent) {
  this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  this.filterTrainees(event.query); // Call the filter method
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
}


  getStatusClass(status: string): string {
    switch (status) {
      case 'Work from Office':
        return 'status-work-from-office';
      case 'Work from Home':
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
    } 
    else if (hours === 0 && minutes === 0) {
      return 'time-very-late';
    }
    else {
      return 'time-very-late';
    }
  }
  

}
