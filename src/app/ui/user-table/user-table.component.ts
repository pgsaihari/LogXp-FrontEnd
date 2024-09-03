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
    ProgressSpinnerModule

  ],
  providers: [MessageService, ConfirmationService, TraineeServiceService, BatchService],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit {

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
  newBatch: Batch = { batchId: 0, batchName: '', year: 0 };  // To hold the new batch data
  isLoading = true;
  years: any[] | undefined;
  constructor(
    private traineeService: TraineeServiceService,
    private batchService: BatchService,  // Inject BatchService
    private messageService: MessageService
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
      this.newBatch = { batchId: 0, batchName: '', year: 0 };  // Reset the batch data
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
    console.log('Trainee data before update:', this.trainee);
    this.traineeService.updateTrainee(this.trainee.employeeCode, this.trainee).subscribe({
      next: () => {
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

    this.updateTrainees(
      this.trainees.filter((t) => t.batchId === this.selectedBatchId),
      isActive,
      `Trainees in batch ${this.selectedBatchId} updated successfully`
    );
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
    this.updateTrainees(this.selectedTrainees, isActive, `Selected trainees updated successfully`);
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
  private updateTrainees(trainees: Trainee[], isActive: boolean, successMessage: string) {
    // Track the number of successful updates
    let updatesCompleted = 0;
    const totalUpdates = trainees.length;

    trainees.forEach((trainee) => {
        const updatedTrainee = { ...trainee, isActive };
        this.traineeService.updateTrainee(updatedTrainee.employeeCode!, updatedTrainee).subscribe({
            next: () => {
                this.updateTraineeList(updatedTrainee);
                updatesCompleted++;

                // Check if all updates are completed
                if (updatesCompleted === totalUpdates) {
                    this.showMessage('success', 'Successful', successMessage);
                }
            },
            error: (err) => this.showError('Failed to update trainees', err),
        });
    });

    // In case there are no trainees to update
    if (totalUpdates === 0) {
        this.showMessage('warn', 'Warning', 'No trainees to update');
    }
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
}
