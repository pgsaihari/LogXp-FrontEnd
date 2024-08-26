import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TraineeServiceService } from '../../core/services/trainee-service.service';

import { MessageService } from 'primeng/api';
import { Batch } from '../../core/model/batch.model';
import { BatchService } from '../../core/services/batch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,CommonModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  // Define the form group
  traineeForm = new FormGroup({
    employeeCode: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    batchId: new FormControl(Validators.required),
    isActive: new FormControl(true, Validators.required)  // Default value set to true
  });


  batches: Batch[] = []; // Initialize batches as an empty array

  constructor(
    private traineeService: TraineeServiceService,
    private batchService: BatchService, // Inject BatchService
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadBatches(); // Load batches on component initialization
  }

  // Load batches from BatchService
  loadBatches() {
    this.batchService.getBatches().subscribe({
      next: (data: Batch[]) => {
        this.batches = data;
      },
      error: (error) => {
        console.error('Error fetching batches:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load batches' });
      },
      complete: () => {
        console.log('Batch data fetch completed');
      }
    });
  }
  

  // Function to handle single trainee submission
  onSubmit() {
    if (this.traineeForm.valid) {
      const formData = this.traineeForm.value;
      console.log('Form Data:', formData);
  
      this.traineeService.addTrainee(formData).subscribe({
        next: (response) => {
          console.log('Trainee added successfully:', response.message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.traineeForm.reset(); // Reset the form after successful submission
          this.traineeForm.patchValue({ isActive: true });  // Reset isActive to true
          
        },
        error: (error) => {
          console.error('Error adding trainee:', error);
          if (error.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Invalid Data', detail: error.error.message || 'Bad request' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: 'Something went wrong' });
          }
        }
      });
    } else {
      console.error('Form is invalid');
      this.messageService.add({ severity: 'warning', summary: 'Validation Error', detail: 'All fields are required' });
    }
  }
  
  

 
}
