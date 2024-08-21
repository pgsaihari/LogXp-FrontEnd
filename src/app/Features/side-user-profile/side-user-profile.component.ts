import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SingleUserTableComponent } from '../../ui/single-user-table/single-user-table.component';
import { NgIf } from '@angular/common';
import { TraineeServiceService } from '../../core/services/trainee-service.service';
import { Trainee } from '../../core/model/trainee.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';

@Component({
  selector: 'app-side-user-profile',
  standalone: true,
  imports: [SingleUserTableComponent,NgIf],
  templateUrl: './side-user-profile.component.html',
  styleUrl: './side-user-profile.component.css'
})
export class SideUserProfileComponent implements OnInit {
  ngOnInit(): void {
     console.log("hii")
      this.getTraineeDetails(this.employeeCode);
      this.getLogsByEmployeeCode(this.employeeCode);  // Fetch trainee details on component load
    
  }
  @Input() employeeCode: string ="";  // Employee code passed from the parent component
  @Input() isVisible: boolean |undefined = false;  // Visibility control passed from parent
  @Output() closeProfile = new EventEmitter<void>();
   
  trainee: Trainee ={}  // Store the trainee data
  traineeLogs:TraineeAttendanceLogs[]=[];
  logsCount:number=0;
  constructor(private traineeService: TraineeServiceService,private traineeAttendancelogService:TraineeAttendancelogService) {}  


  // Method to hide the side profile when the close button is clicked
  closeSideProfile(): void {
    this.closeProfile.emit();  // Emit the close event to hide the profile
  }

  getTraineeDetails(employeeCode: string): void {
    this.traineeService.getTraineeByEmployeeCode(employeeCode).subscribe(
      (data) => {
        this.trainee = data.trainee;
        console.log('Trainee details:', this.trainee);
      },
      (error) => {
        console.error('Error fetching trainee details:', error);
      }
    );
  }

  getLogsByEmployeeCode(employeeCode: string): void {
    this.traineeAttendancelogService.getLogsByEmployeeCode(employeeCode).subscribe(
      (data) => {
        this.traineeLogs = data.logs;
        this.logsCount = data.count;
        console.log('Trainee logs:', data);
      },
      (error) => {
        console.error('Error fetching trainee logs:', error);
      }
    );
  }
}
