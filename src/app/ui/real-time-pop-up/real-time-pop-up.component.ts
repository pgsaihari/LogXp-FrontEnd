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

  selectedBatchTrainees = ''; 
  selectedBatchLateArrivals = ''; 
  searchTerm = ''; 

  viewType = 'live'; // To hold the selected value of the dropdown

  constructor(private attendanceLogService: AttendanceLogService) {}

  ngOnInit(): void {
    this.fetchTrainees();
    this.fetchLateArrivals();
  }

  fetchTrainees() {
    this.attendanceLogService.getTodayLogs().subscribe(
      (data) => {
        this.trainees = data;
        this.filteredTrainees = data;
      },
      (error) => {
        console.error('Error fetching trainees logs', error);
      }
    );
  }

  fetchLateArrivals() {
    this.attendanceLogService.getLateArrivals().subscribe(
      (data) => {
        this.lateArrivals = data;
        this.filteredLateArrivals = data;
      },
      (error) => {
        console.error('Error fetching late arrivals logs', error);
      }
    );
  }

  filterTrainees() {
    this.filteredTrainees = this.trainees.filter(
      (trainee) =>
        (!this.selectedBatchTrainees || trainee.batchName === this.selectedBatchTrainees) &&
        (!this.searchTerm || trainee.employeeName.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  filterLateArrivals() {
    this.filteredLateArrivals = this.lateArrivals.filter(
      (lateArrival) =>
        (!this.selectedBatchLateArrivals || lateArrival.batchName === this.selectedBatchLateArrivals) &&
        (!this.searchTerm || lateArrival.employeeName.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  close() {
    this.closePopup.emit();
  }
}
