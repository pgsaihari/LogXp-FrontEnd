import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
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
    TagModule,TooltipModule
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


  constructor(
    private traineeService: TraineeServiceService,
    private batchService: BatchService,  // Inject BatchService
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.traineeService.getTrainees().subscribe((data) => {
      this.trainees = data;
      this.allTrainees = data; 
    });
  // Fetch batches from the backend
  this.batchService.getBatches().subscribe((batches) => {
    this.batchOptions = batches.map((batch) => ({
        label: batch.batchName,  // Make sure batchName is a string
        value: batch.batchId     // Make sure batchId is a number
    }));
});
}
filterByBatch() {
    if (this.selectedBatchId) {
      this.trainees = this.allTrainees.filter(
        trainee => trainee.batchId === this.selectedBatchId
      );
    } else {
      this.trainees = [...this.allTrainees];
    }
  }
getBatchName(batchId: number): string {
    const batch = this.batchOptions.find(option => option.value === batchId);
    return batch ? batch.label : 'Unknown';
}


  openNew() {
    this.trainee = {};
    this.submitted = false;
    this.traineeDialog = true;
  }

  editTrainee(trainee: Trainee) {
    this.trainee = { ...trainee };
    this.traineeDialog = true;
  }

  hideDialog() {
    this.traineeDialog = false;
    this.submitted = false;
  }

  saveTrainee() {
    if (!this.trainee.employeeCode || !this.trainee.name) {
      this.submitted = true;
      return;
    }
    console.log('Trainee data before update:', this.trainee);
    this.traineeService.updateTrainee(this.trainee.employeeCode, this.trainee).subscribe({
      next: () => {
        this.updateTraineeList(this.trainee);
        this.showMessage('success', 'Successful', `Details of ${this.trainee.name } updated `);
        this.hideDialog();
      },
      error: (err) => this.showError('Failed to update trainee', err),
    });
  }

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

  setIsActiveForSelected(isActive: boolean) {
    if (!this.selectedTrainees.length) {
      this.showMessage('warn', 'Warning', 'No trainees selected');
      return;
    }
    const traineeNames = this.selectedTrainees.map(trainee => trainee.name).join(', ');
    this.updateTrainees(this.selectedTrainees, isActive, `${traineeNames} updated successfully`);
  }

  private updateTraineeList(updatedTrainee: Trainee) {
    this.trainees = this.trainees.map((t) =>
      t.employeeCode === updatedTrainee.employeeCode ? updatedTrainee : t
    );
  }

  private updateTrainees(trainees: Trainee[], isActive: boolean, successMessage: string) {
    trainees.forEach((trainee) => {
      const updatedTrainee = { ...trainee, isActive };
      this.traineeService.updateTrainee(updatedTrainee.employeeCode!, updatedTrainee).subscribe({
        next: () => {
          this.updateTraineeList(updatedTrainee);
          this.showMessage('success', 'Successful', successMessage);
        },
        error: (err) => this.showError('Failed to update trainees', err),
      });
    });
  }

  private showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  private showError(summary: string, err: any) {
    console.error(summary, err);
    this.showMessage('error', 'Error', `${summary}: ${err.message}`);
  }
}
