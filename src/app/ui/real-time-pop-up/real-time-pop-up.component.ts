import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-real-time-pop-up',
  standalone:true,
  imports:[NgFor,NgIf],
  templateUrl: './real-time-pop-up.component.html',
  styleUrls: ['./real-time-pop-up.component.css']
})
export class RealTimePopUpComponent {
  @Output() closePopup = new EventEmitter<void>();
  showLateArrivals = true;
  lateArrivals: Array<{ traineeCode: string, name: string, location: string }> = [];
  trainees: Array<{ traineeCode: string, name: string, action: string, location: string }> = [];

  ngOnInit(): void {
    this.fetchLateArrivals();
    this.fetchTrainees();
  }

  fetchLateArrivals() {
    this.lateArrivals = [
      { traineeCode: 'T001', name: 'John Doe', location: 'Room A' },
      { traineeCode: 'T002', name: 'Jane Smith', location: 'Room B' },
    ];
  }

  fetchTrainees() {
    this.trainees = [
      { traineeCode: 'T001', name: 'John Doe', action: 'Edit', location: 'Room A' },
      { traineeCode: 'T002', name: 'Jane Smith', action: 'Edit', location: 'Room B' },
      { traineeCode: 'T003', name: 'Alice Johnson', action: 'Edit', location: 'Room C' }
    ];
  }

  toggleTable(showLateArrivals: boolean) {
    this.showLateArrivals = showLateArrivals;
  }

  close() {
    this.closePopup.emit();
  }
}
