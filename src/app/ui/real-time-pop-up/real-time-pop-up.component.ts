import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {
  AttendanceLog,
  AttendanceLogService,
  LateArrival,
} from '../../core/services/attendance-log.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-real-time-pop-up',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, FormsModule,NgClass],
  templateUrl: './real-time-pop-up.component.html',
  styleUrls: ['./real-time-pop-up.component.css'],
})
export class RealTimePopUpComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  showLateArrivals = true;

  trainees: AttendanceLog[] = [];
  filteredTrainees: AttendanceLog[] = [];

  selectedBatchTrainees = ''; // Holds the selected batch filter for Trainees

  paginatedTrainees: AttendanceLog[] = [];

  pageTrainees = 1; // Current page
  itemsPerPage = 10; // Number of trainees per page
  totalPages = 1; // Total number of pages

  constructor(private attendanceLogService: AttendanceLogService) {}

  ngOnInit(): void {
    this.fetchTrainees();
  }

  fetchTrainees() {
    this.attendanceLogService.getTodayLogs().subscribe(
      (data) => {
        this.trainees = data;
        this.filteredTrainees = data;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching trainees logs', error);
      }
    );
  }

  filterTrainees() {
    if (this.selectedBatchTrainees) {
      this.filteredTrainees = this.trainees.filter(
        (trainee) => trainee.batchName === this.selectedBatchTrainees
      );
    } else {
      this.filteredTrainees = this.trainees;
    }
    this.pageTrainees = 1; // Reset to the first page whenever filtering changes
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredTrainees.length / this.itemsPerPage
    );
    this.paginatedTrainees = this.filteredTrainees.slice(
      (this.pageTrainees - 1) * this.itemsPerPage,
      this.pageTrainees * this.itemsPerPage
    );
  }

  previousPage() {
    if (this.pageTrainees > 1) {
      this.pageTrainees--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.pageTrainees < this.totalPages) {
      this.pageTrainees++;
      this.updatePagination();
    }
  }

  close() {
    this.closePopup.emit();
  }
}
