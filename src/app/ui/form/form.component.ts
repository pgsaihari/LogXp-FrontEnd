import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TraineeServiceService } from '../../core/services/trainee-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  // Define the form group
  traineeForm = new FormGroup({
    employeeCode: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    batch: new FormControl('', Validators.required),
  });

  batches = ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5'];

  constructor(
    private traineeService: TraineeServiceService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // You can use this to show initial toast messages or load data on component initialization
  }

  // Function to handle single trainee submission
  onSubmit() {
    if (this.traineeForm.valid) {
      console.log('Form Data:', this.traineeForm.value);

      // Call the service to add a single trainee
      this.traineeService.addTrainee(this.traineeForm.value).subscribe(
        response => {
          console.log('Trainee added successfully:', response.message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message }); // Show success toast
          this.traineeForm.reset(); // Reset the form after successful submission
        },
        error => {
          console.error('Error adding trainee:', error);
          // Handle 400 errors specifically, or show a generic error message
          if (error.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Invalid Data', detail: error.error.message || 'Bad request' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: 'Something went wrong' });
          }
        }
      );
    } else {
      console.error('Form is invalid');
      this.messageService.add({ severity: 'warning', summary: 'Validation Error', detail: 'All fields are required' }); // Show warning toast
    }
  }

  // Function to handle multiple trainee submission (if needed)
  onSubmitMultipleTrainees() {
    const trainees = [
      {
        employeeCode: 'emp001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        batch: 'Batch 1'
      },
      {
        employeeCode: 'emp002',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        batch: 'Batch 2'
      }
    ]; // Replace this with actual data if needed

    this.traineeService.addTrainees(trainees).subscribe(
      response => {
        console.log('Trainees added successfully:', response.message);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All trainees added successfully.' }); // Show success toast
      },
      error => {
        console.error('Error adding trainees:', error);
        this.messageService.add({ severity: 'error', summary: 'Server Error', detail: 'Something went wrong while adding trainees.' });
      }
    );
  }
}
