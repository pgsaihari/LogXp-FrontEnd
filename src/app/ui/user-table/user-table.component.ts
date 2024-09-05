import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Trainee } from '../../core/model/trainee.model';
import { TraineeServiceService } from '../../core/services/trainee-service.service';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BatchService } from '../../core/services/batch.service';  // Import BatchService
import { TooltipModule } from 'primeng/tooltip';
import { Batch } from '../../core/model/batch.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { catchError, of } from 'rxjs';
import { OfficeEntryTime } from '../../core/interfaces/daily-attendance-of-month';

import moment from 'moment';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { OfficeEntryService } from '../../core/services/office-entry.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/model/user.model';
@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagModule,
    TooltipModule,
    ProgressSpinnerModule,
    CalendarModule,
    CalendarModule

  ],
  providers: [MessageService, ConfirmationService, TraineeServiceService, BatchService],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit {
  startYear: Date | undefined;
  endYear: Date | undefined;
  timeSetterVisible:boolean = false
  selectedTime:Date | undefined;
  curArrivalTime!:Date;
  officeEntryTime!:OfficeEntryTime;
  traineeDialog: boolean = false;
  trainees: Trainee[] = [];
  trainee: Trainee = {};
  selectedTrainees: Trainee[] = [];
  submitted: boolean = false;
  isSetStatusDialogVisible = false;
  selectedBatchId: number | null = null;
  batchOptions: { label: string; value: number }[] = [];
  allTrainees: Trainee[] = [];
  batchDialog: boolean = false;  // To control the visibility of the batch dialog
  newBatch: Batch = { batchId: 0, batchName: '', year: '' };  // To hold the new batch data
  isLoading = true;
  years: any[] | undefined;
  error: any;
  constructor(
    private traineeService: TraineeServiceService,
     private userService: UserService,
    private batchService: BatchService,  // Inject BatchService
    private messageService: MessageService,
    private officeEntryService : OfficeEntryService
  ) {}
  onSelectionChange(event: any) {
    if (this.selectedTrainees.length === this.trainees.length && this.trainees.length > 0) {
      this.isSetStatusDialogVisible = true;
    } else {
      this.isSetStatusDialogVisible = false;
    }
  }


  // Inside your component class
 
  /**
   * Initialize the component by loading trainees and batch options.
   */
  ngOnInit() {
    this.years = Array.from({length: 26}, (v, k) => {
      return { label: `${2000 + k}`, value: 2000 + k };
    });
    // Set loading to true initially
    this.isLoading = true;
  
    // Fetch trainees from the backend
    this.traineeService.getTrainees().subscribe((data) => {
      this.trainees = data;
      this.allTrainees = data;
      
      // Check if both data sets are loaded
      this.checkLoadingStatus();
    });
  
    // Fetch batches from the backend
    this.batchService.getBatches().subscribe((batches) => {
      this.batchOptions = batches.map((batch) => ({
        label: batch.batchName,  // Ensure batchName is a string
        value: batch.batchId     // Ensure batchId is a number
      }));
  
      // Check if both data sets are loaded
      this.checkLoadingStatus();
    });
  }
  updateYearRange() {
    if (this.startYear && this.endYear) {
      const startYearString = moment(this.startYear).format('YYYY');
      const endYearString = moment(this.endYear).format('YYYY');
      this.newBatch.year = `${startYearString}-${endYearString}`;
    }
  }
  // Method to check if loading can be stopped
  checkLoadingStatus() {
    // Assuming both data fetches need to complete before setting isLoading to false
    if (this.trainees && this.batchOptions) {
      this.isLoading = false;
    }
  }
  



  /**
   * Filter trainees based on the selected batch.
   */
  filterByBatch() {
    if (this.selectedBatchId) {
      this.trainees = this.allTrainees.filter(
        trainee => trainee.batchId === this.selectedBatchId
      );
    } else {
      this.trainees = [...this.allTrainees];
    }
  }

  /**
   * Get the batch name based on the batch ID.
   * @param {number} batchId - The ID of the batch.
   * @returns {string} - The name of the batch.
   */
  getBatchName(batchId: number): string {
    const batch = this.batchOptions.find(option => option.value === batchId);
    return batch ? batch.label : 'Unknown';
  }
    /**
   * Open the batch dialog for adding a new batch.
   */
    openBatchDialog() {
      this.newBatch = { batchId: 0, batchName: '', year: ''};  // Reset the batch data
      this.batchDialog = true;  // Show the dialog
    }
  
    /**
     * Hide the batch dialog without saving changes.
     */
    hideBatchDialog() {
      this.batchDialog = false;  // Hide the dialog
    }
  /**
   * Save the new batch by sending the data to the backend.
   */
  saveBatch() {
    // Call the service to save the new batch (without batchId)
    this.batchService.addBatch(this.newBatch).subscribe({
      next: (savedBatch) => {
        // Add the newly saved batch to the batchOptions array
        this.batchOptions.push({ 
          label: savedBatch.batchName, 
          value: savedBatch.batchId // Ensure the backend returns the batchId after saving
        });
        this.messageService.add({ severity: 'success', summary: 'Batch Saved', detail: 'New batch added successfully.' });
        this.batchDialog = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save the batch.' });
      }
    });
  }
  
  
  /**
   * Open a new trainee dialog for adding a trainee.
   */
  openNew() {
    this.trainee = {};
    this.submitted = false;
    this.traineeDialog = true;
  }

  /**
   * Edit the details of an existing trainee.
   * @param {Trainee} trainee - The trainee to edit.
   */
  editTrainee(trainee: Trainee) {
    this.trainee = { ...trainee };
    this.traineeDialog = true;
  }

  /**
   * Hide the trainee dialog without saving changes.
   */
  hideDialog() {
    this.traineeDialog = false;
    this.submitted = false;
  }

  /**
   * Save the trainee details and update the list.
   */
  saveTrainee() {
    if (!this.trainee.employeeCode || !this.trainee.name) {
      this.submitted = true;
      return;
    }
  
    // Map Trainee object to User object
    const user: User = {
      userId: this.trainee.employeeCode!,
      name: this.trainee.name!,
      email: this.trainee.email || '',
      isActive: this.trainee.isActive || false,
      batchId: this.trainee.batchId || 0,
      role: 'trainee' // Assuming the role is always 'trainee'
    };
  
    console.log('User data before update:', user);
    this.userService.updateUser(user.userId, user).subscribe({
      next: () => {
        // Update trainee list with the updated user details
        this.updateTraineeList(this.trainee);
        this.showMessage('success', 'Successful', `Details of ${this.trainee.name} updated`);
        this.hideDialog();
      },
      error: (err) => this.showError('Failed to update trainee', err),
    });
  }
  

  /**
   * Set the active status for all trainees in the selected batch.
   * @param {boolean} isActive - The active status to set.
   */
  setIsActiveForBatch(isActive: boolean) {
    if (!this.selectedBatchId) {
      this.showMessage('warn', 'Warning', 'No batch selected');
      return;
    }

    this.updateUsers(
      this.trainees.filter((t) => t.batchId === this.selectedBatchId),
      isActive,
      `Trainees in batch ${this.selectedBatchId} updated successfully`
    );
    this.isSetStatusDialogVisible = false;
  }

  /**
   * Set the active status for the selected trainees.
   * @param {boolean} isActive - The active status to set.
   */
  setIsActiveForSelected(isActive: boolean) {
    if (!this.selectedTrainees.length) {
      this.showMessage('warn', 'Warning', 'No trainees selected');
      return;
    }
    this.updateUsers(this.selectedTrainees, isActive, `Selected trainees updated successfully`);
    this.isSetStatusDialogVisible = false;
  }

  /**
   * Update the list of trainees with the updated trainee information.
   * @param {Trainee} updatedTrainee - The trainee with updated information.
   */
  private updateTraineeList(updatedTrainee: Trainee) {
    this.trainees = this.trainees.map((t) =>
      t.employeeCode === updatedTrainee.employeeCode ? updatedTrainee : t
    );
  }

  /**
   * Update the active status for a list of trainees.
   * @param {Trainee[]} trainees - The list of trainees to update.
   * @param {boolean} isActive - The active status to set.
   * @param {string} successMessage - The message to show on successful update.
   */
  private updateUsers(trainees: Trainee[], isActive: boolean, successMessage: string) {
    // Track the number of successful updates
    let updatesCompleted = 0;
    const totalUpdates = trainees.length;

    trainees.forEach((trainee) => {
        // Map the Trainee object to a User object
        const updatedUser: User = {
            userId: trainee.employeeCode!,
            name: trainee.name|| "" ,
            email: trainee.email||"",
            isActive: isActive,
            batchId: trainee.batchId||0,
            role:  'trainee', // Ensure role is set to 'trainee' if not provided
        };

        this.userService.updateUser(updatedUser.userId, updatedUser).subscribe({
            next: () => {
                this.updateTraineeList(updatedUser);  // This should update the display list accordingly
                updatesCompleted++;

                // Check if all updates are completed
                if (updatesCompleted === totalUpdates) {
                    this.showMessage('success', 'Successful', successMessage);
                }
            },
            error: (err) => this.showError('Failed to update users', err),
        });
    });

    // In case there are no trainees to update
    if (totalUpdates === 0) {
        this.showMessage('warn', 'Warning', 'No users to update');
    }
    this.isSetStatusDialogVisible = false;
}


  /**
   * Show a message to the user.
   * @param {string} severity - The severity of the message (e.g., success, warn, error).
   * @param {string} summary - The summary of the message.
   * @param {string} detail - The detailed message.
   */
  private showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  /**
   * Handle an error and show an error message.
   * @param {string} summary - The summary of the error.
   * @param {any} err - The error object.
   */
  private showError(summary: string, err: any) {
    console.error(summary, err);
    this.showMessage('error', 'Error', `${summary}: ${err.message}`);
  }

  openTimeSetterDialog(){
    this.officeEntryService.getOfficeEntryTime()
    .pipe(
      catchError(error => {
        this.error = error.message;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while fetching.' });
        return of([]);
      })
    )
    .subscribe(data => {
      this.officeEntryTime = data as OfficeEntryTime;
      let convertToDateTime = new Date();
      convertToDateTime.setHours(this.officeEntryTime.hours,this.officeEntryTime.minutes,this.officeEntryTime.seconds)
      this.curArrivalTime = convertToDateTime;

      this.selectedTime = convertToDateTime
      this.timeSetterVisible = true;
    });
  }

  saveArrivalTime(){
    if(this.selectedTime){
      const date = this.selectedTime;
      const newArrivalTime: OfficeEntryTime = {
        hours:date.getHours(),
        minutes:date.getMinutes(),
        seconds:59
      }
      this.timeSetterVisible = false;

      this.officeEntryService.setOfficeEntryTime(newArrivalTime)
      .pipe(
        catchError(error => {
          this.error = error.message;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not update the arrival time.' });
          return of([]);
        })
      )
      .subscribe(data => {
        if(data){
          this.messageService.add({ severity: 'success', summary: 'Entry Time Updated', detail: 'Updated the entry time for trainees.' });
        }
        else{this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not update the arrival time.' });}
      });
      
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No time selected.' });
    }
    
  }
}
