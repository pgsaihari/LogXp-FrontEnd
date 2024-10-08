import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SingleUserTableComponent } from '../../ui/single-user-table/single-user-table.component';
import { NgIf } from '@angular/common';
import { TraineeServiceService } from '../../core/services/trainee-service.service';
import { Trainee } from '../../core/model/trainee.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import {  TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { BatchService } from '../../core/services/batch.service';
import { Batch } from '../../core/model/batch.model';
import { AbsenceAndLate } from '../../core/interfaces/side-profile';

@Component({
  selector: 'app-side-user-profile',
  standalone: true,
  imports: [SingleUserTableComponent,NgIf],
  templateUrl: './side-user-profile.component.html',
  styleUrl: './side-user-profile.component.css'
})
export class SideUserProfileComponent implements OnInit {

  numberOfDaysAbsent: any=0;
  numberOfDaysLate: any=0;
  attendanceCount:AbsenceAndLate = {
    absentDaysCount: 0,
    earlyDepartureDaysCount: 0,
    lateArrivalDaysCount: 0,
    onTimeDaysCount: 0
  }
  
  
  ngOnInit(): void {

      //Getting batch name from batch id
      if (this.employeeCode) {
        // this.getBatches(); 
        this.getTraineeDetails(this.employeeCode);
        this.getLogsByEmployeeCode(this.employeeCode);
        this.GetAttendanceCountOfTrainee(this.employeeCode);
      }

  }

  @Input() employeeCode: string ="";  // Employee code passed from the parent component
  @Input() isVisible: boolean |undefined = false;  // Visibility control passed from parent
  @Output() closeProfile = new EventEmitter<void>();
   
  trainee: Trainee ={}  // Store the trainee data
  traineeLogs:TraineeAttendanceLogs[]=[];
  logsCount:number=0;

  batchId: number = 0;
  batchIdForProfile?: number = 0;
  batches: Batch[] = [];
  batchName: string = '';

  error: boolean = false;
  
  constructor(private traineeService: TraineeServiceService,private traineeAttendancelogService:TraineeAttendancelogService, private batchService: BatchService) {}  


  // Method to hide the side profile when the close button is clicked
  closeSideProfile(): void {
    this.closeProfile.emit();  // Emit the close event to hide the profile
  }

  getTraineeDetails(employeeCode: string): void {
    this.traineeService.getTraineeByEmployeeCode(employeeCode).pipe(
     
      catchError((error) => {
        console.error('Error fetching trainee details:', error);
       
        return throwError(()=>new Error(error)); 
      }),
      finalize(() => {
        // console.log('Fetch trainee operation complete');
        
      })
    ).subscribe((data) => {
      this.trainee = data.trainee;
      // console.log('Trainee details:', this.trainee);
      this.getBatches();
    });
    
  }

  getLogsByEmployeeCode(employeeCode: string): void {
    this.traineeAttendancelogService.getLogsByEmployeeCode(employeeCode).pipe(
     
      catchError((error) => {
        console.error('Error fetching trainee details:', error);
       
        return throwError(()=>new Error(error)); 
      }),
      finalize(() => {
        // console.log('Fetch trainee operation complete');
        
      })
    ).subscribe(
      (data) => {
        this.traineeLogs = data.logs;
        this.logsCount = data.count;
        // console.log('Trainee logs:', data);
      },
      
  );
  }

  //Function to get batch number from batch id
  getBatches(): void {
    this.batchService.getBatches().pipe(
      catchError((error) => {
        console.error('Error fetching batches:', error);
        this.error = true;
        return throwError(() => new Error(error));
      }),
      finalize(() => {
        // console.log('Fetch batches operation complete');
      })
    ).subscribe((data) => {
      this.batches = data;
      // console.log('Batch datas:', this.batches);
      // console.log('Trainee id:', this.trainee.batchId);
      this.batchIdForProfile = this.trainee.batchId;
      const selectedBatch = this.batches.find(batch => batch.batchId === this.batchIdForProfile);
      if (selectedBatch) {
        // console.log('Batches:', selectedBatch.batchName);
        this.batchName = selectedBatch.batchName;
      } else {
        console.error('Batch not found for batchId:', this.batchIdForProfile);
      }
    });
  }


  // Function to get absences and leave count of a trainee
  GetAttendanceCountOfTrainee(employeeCode: string): void {
    this.traineeAttendancelogService.GetAttendanceCountOfTrainee(employeeCode).pipe(
      catchError((error) => {
        console.error('Error fetching absence and late data:', error);
        return throwError(() => new Error(error));
      }),
      finalize(() => {
        // console.log('Fetch absence and leave data operation complete');
      })
    ).subscribe(
      (data: AbsenceAndLate) => {
        this.attendanceCount = data; // Store the absence and leave data
        // console.log('Absence and Late data:', this.attendanceCount);
        this.numberOfDaysAbsent = this.attendanceCount.absentDaysCount;
        this.numberOfDaysLate = this.attendanceCount.lateArrivalDaysCount;
      }
    );
  }
}