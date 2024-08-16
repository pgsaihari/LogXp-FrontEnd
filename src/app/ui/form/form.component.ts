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
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,],
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
  
  
  ngOnInit(): void {
    this.messageService.add({severity:'error', summary:'Something went wrong', detail:'Via MessageService'}); // Show success toast
         
  }
  constructor(
    private traineeService: TraineeServiceService,
    private messageService: MessageService
  ) { }
  

  batches = ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5'];

  onSubmit() {
    if (this.traineeForm.valid) {
      // Call the service to add trainee
      this.traineeService.addTrainee(this.traineeForm.value).subscribe(
        response => {
          console.log('Trainee added successfully', response.message);
          this.messageService.add({severity:'success', summary:`${response.message}`, detail:'LogXp'}); // Show success toast
          this.traineeForm.reset(); // Reset the form
        },
        error => {
          this.messageService.add({severity:'error', summary:`${error.error.message}`, detail:'LogXp'}); // Show success toast
         
          console.error('Error adding trainee', error); 
           // Show error toast
        }
      );
    } else {
      console.error('Form is invalid');
      this.messageService.add({severity:'warning', summary:'All fields are required', detail:'Via MessageService'}); // Show success toast
      // Show warning toast
    }
  }
}
