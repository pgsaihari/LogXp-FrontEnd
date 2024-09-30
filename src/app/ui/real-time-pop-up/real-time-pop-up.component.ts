import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceLogService, AttendanceLog, LateArrival } from '../../core/services/attendance-log.service';

@Component({
  selector: 'app-real-time-pop-up',
  standalone: true,
  templateUrl: './real-time-pop-up.component.html',
  styleUrls: ['./real-time-pop-up.component.css'],
  imports: [NgIf, NgFor, NgClass, FormsModule, DatePipe],
})
export class RealTimePopUpComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();

  trainees: AttendanceLog[] = [];
  filteredTrainees: AttendanceLog[] = [];
  lateArrivals: LateArrival[] = [];
  filteredLateArrivals: LateArrival[] = [];
  
  selectedLocation = ''; // Selected location
  selectedBatchTrainees = ''; // Selected batch for trainees
  selectedBatchLateArrivals = ''; // Selected batch for late arrivals
  searchTerm = ''; // Search term for filtering by trainee name

  viewType = 'live'; // Default view mode is 'live'

  constructor(private attendanceLogService: AttendanceLogService) {}

  ngOnInit(): void {
    this.fetchTrainees();
    this.fetchLateArrivals();
  }

  fetchTrainees() {
    this.attendanceLogService.getTodayLogs().subscribe({
      next: (data) => {
        this.trainees = data;
        this.filterTrainees(); // Apply filtering after fetching
      },
      error: (error) => {
        console.error('Error fetching trainee logs', error);
      }
    });
  }

  fetchLateArrivals() {
    this.attendanceLogService.getLateArrivals().subscribe({
      next: (data) => {
        this.lateArrivals = data;
        this.filterLateArrivals(); // Apply filtering after fetching
      },
      error: (error) => {
        console.error('Error fetching late arrivals logs', error);
      }
    });
  }

  // Optimized function to filter trainees based on batch, location, and search term
  filterTrainees() {
    this.filteredTrainees = this.trainees.filter((trainee) => {
      const matchesBatch = !this.selectedBatchTrainees || trainee.batchName === this.selectedBatchTrainees;
      const matchesLocation = !this.selectedLocation || trainee.place === this.selectedLocation;
      const matchesSearch = !this.searchTerm || trainee.employeeName.toLowerCase().startsWith(this.searchTerm.toLowerCase());
      return matchesBatch && matchesLocation && matchesSearch;
    });
  }

  // Optimized function to filter late arrivals based on batch, location, and search term
  filterLateArrivals() {
    this.filteredLateArrivals = this.lateArrivals.filter((lateArrival) => {
      const matchesBatch = !this.selectedBatchLateArrivals || lateArrival.batchName === this.selectedBatchLateArrivals;
      const matchesLocation = !this.selectedLocation || lateArrival.place === this.selectedLocation;
      const matchesSearch = !this.searchTerm || lateArrival.employeeName.toLowerCase().startsWith(this.searchTerm.toLowerCase());
      return matchesBatch && matchesLocation && matchesSearch;
    });
  }

  // This method is triggered when the viewType is switched
  onViewTypeChange() {
    if (this.viewType === 'live') {
      this.filterTrainees();
    } else if (this.viewType === 'late') {
      this.filterLateArrivals();
    }
  }

  // Close the popup
  close() {
    this.closePopup.emit();
  }
}
