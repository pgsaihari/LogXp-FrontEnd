import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AttendanceLog, AttendanceLogService, LateArrival } from '../../core/services/attendance-log.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-real-time-pop-up',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, NgxPaginationModule,FormsModule],
  templateUrl: './real-time-pop-up.component.html',
  styleUrls: ['./real-time-pop-up.component.css']
})
export class RealTimePopUpComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  showLateArrivals = true;
  lateArrivals: LateArrival[] = [];
  filteredLateArrivals: LateArrival[] = [];
  trainees: AttendanceLog[] = [];
  filteredTrainees: AttendanceLog[] = [];
  selectedBatchLateArrivals = ''; // Holds the selected batch filter for Late Arrivals
  selectedBatchTrainees = ''; // Holds the selected batch filter for Trainees
  pageLateArrivals = 1; // Current page for pagination in Late Arrivals table
  pageTrainees = 1; // Current page for pagination in Trainees table

  constructor(private attendanceLogService: AttendanceLogService) {}

  ngOnInit(): void {
    this.fetchLateArrivals();
    this.fetchTrainees();
  }

  fetchLateArrivals() {
    this.attendanceLogService.getLateArrivals().subscribe(
      (data) => {
        this.lateArrivals = data;
        this.filteredLateArrivals = data; // Initialize filteredLateArrivals with full data set
      },
      (error) => {
        console.error('Error fetching late arrivals', error);
      }
    );
  }

  fetchTrainees() {
    this.attendanceLogService.getTodayLogs().subscribe(
      (data) => {
        this.trainees = data;
        this.filteredTrainees = data; // Initialize filteredTrainees with full data set
      },
      (error) => {
        console.error('Error fetching trainees logs', error);
      }
    );
  }

  toggleTable(showLateArrivals: boolean) {
    this.showLateArrivals = showLateArrivals;
  }

  filterLateArrivals() {
    if (this.selectedBatchLateArrivals) {
      this.filteredLateArrivals = this.lateArrivals.filter(
        (arrival) => arrival.batchName === this.selectedBatchLateArrivals
      );
    } else {
      this.filteredLateArrivals = this.lateArrivals; // Show all if no batch selected
    }
    this.pageLateArrivals = 1; // Reset to the first page whenever filtering changes
  }

  filterTrainees() {
    if (this.selectedBatchTrainees) {
      this.filteredTrainees = this.trainees.filter(
        (trainee) => trainee.batchName === this.selectedBatchTrainees
      );
    } else {
      this.filteredTrainees = this.trainees; // Show all if no batch selected
    }
    this.pageTrainees = 1; // Reset to the first page whenever filtering changes
  }

  close() {
    this.closePopup.emit();
  }
}
