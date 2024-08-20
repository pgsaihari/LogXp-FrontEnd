import { Component, OnInit, ViewChild } from '@angular/core';


import { TagModule } from 'primeng/tag';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, NgModel } from '@angular/forms';

import { CommonModule, NgClass } from '@angular/common';

import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Trainee } from '../../core/model/trainee.model';
import { TraineeServiceService } from '../../core/services/trainee-service.service';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, DropdownModule, TagModule, FormsModule,CommonModule],
  providers: [MessageService, ConfirmationService, TraineeServiceService,MultiSelectModule,ProgressBarModule,Table,NgClass,NgClass],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent implements OnInit  {


    traineeDialog: boolean = false;

    trainees!: Trainee[];

    trainee!: Trainee;

    selectedTrainees!: Trainee[] | null;

    submitted: boolean = false;
   
      
    constructor(private traineeService: TraineeServiceService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.traineeService.getTrainees().subscribe((data) => {
          this.trainees = data; // Ensure data is an array
        });
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

    // saveTrainee() {
    //     this.submitted = true;

    //     if (this.trainee.employeeCode && this.trainee.name) {
    //         if (this.trainee.employeeCode) {
    //             this.trainees = this.trainees.map((t) => (t.employeeCode === this.trainee.employeeCode ? this.trainee : t));
    //             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Trainee Updated', life: 3000 });
    //         } else {
    //             this.trainee.employeeCode = `T${this.createId()}`;
    //             this.trainees.push(this.trainee);
    //             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Trainee Created', life: 3000 });
    //         }

    //         this.trainees = [...this.trainees];
    //         this.traineeDialog = false;
    //         this.trainee = {};
    //     }
    // }
  //   saveTrainee() {
  //     this.submitted = true;

  //     if (this.trainee.employeeCode && this.trainee.name) {
  //         if (this.trainee.employeeCode) {
  //           console.log(this.trainee)
  //             // Use employeeCode as a string in the updateTrainee method
  //             this.traineeService.updateTrainee(this.trainee.employeeCode, this.trainee).subscribe({
  //                 next: () => {
  //                     this.trainees = this.trainees.map((t) =>
  //                         t.employeeCode === this.trainee.employeeCode ? this.trainee : t
  //                     );
  //                     this.messageService.add({
  //                         severity: 'success',
  //                         summary: 'Successful',
  //                         detail: 'Trainee Updated',
  //                         life: 3000,
  //                     });
  //                 },
  //                 error: (err) => {
  //                     this.messageService.add({
  //                         severity: 'error',
  //                         summary: 'Error',
  //                         detail: `Failed to update trainee: ${err.message}`,
  //                         life: 3000,
  //                     });
  //                 },
  //             });
  //         } else {
  //             this.trainee.employeeCode = `T${this.createId()}`;
  //             this.trainees.push(this.trainee);
  //             this.messageService.add({
  //                 severity: 'success',
  //                 summary: 'Successful',
  //                 detail: 'Trainee Created',
  //                 life: 3000,
  //             });
  //         }

  //         this.trainees = [...this.trainees];
  //         this.traineeDialog = false;
  //         this.trainee = {};
  //     }

  // }

  saveTrainee() {
    this.submitted = true;

    if (this.trainee.employeeCode && this.trainee.name) {
        // Ensure the trainee object contains the correct isActive value
        console.log("IsActive value:", this.trainee.isActive);
        console.log("Updating trainee with data:", this.trainee);

        if (this.trainee.employeeCode) {
            this.traineeService.updateTrainee(this.trainee.employeeCode, this.trainee).subscribe({
                next: () => {
                    this.trainees = this.trainees.map((t) =>
                        t.employeeCode === this.trainee.employeeCode ? this.trainee : t
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Trainee Updated',
                        life: 3000,
                    });
                },
                error: (err) => {
                    console.error('Update error:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Failed to update trainee: ${err.message}`,
                        life: 3000,
                    });
                },
            });
        }
    }
}
// setIsActiveForSelected(isActive: boolean) {
//     if (!this.selectedTrainees || this.selectedTrainees.length === 0) {
//         this.messageService.add({
//             severity: 'warn',
//             summary: 'Warning',
//             detail: 'No trainees selected',
//             life: 3000,
//         });
//         return;
//     }

//     this.selectedTrainees.forEach((trainee) => {
//         trainee.isActive = isActive;

//         // Ensure employeeCode is defined
//         if (trainee.employeeCode) {
//             this.traineeService.updateTrainee(trainee.employeeCode, this.trainee).subscribe({
//                 next: () => {
//                     this.trainees = this.trainees.map((t) =>
//                         t.employeeCode === trainee.employeeCode ? trainee : t
//                     );
//                     this.messageService.add({
//                         severity: 'success',
//                         summary: 'Successful',
//                         detail: `Trainee ${trainee.name} Updated`,
//                         life: 3000,
//                     });
//                 },
//                 error: (err) => {
//                     console.error('Update error:', err);
//                     this.messageService.add({
//                         severity: 'error',
//                         summary: 'Error',
//                         detail: `Failed to update trainee ${trainee.name}`,
//                         life: 3000,
//                     });
//                 },
//             });
//         } else {
//             console.error('Employee code is missing for the trainee:', trainee);
//             this.messageService.add({
//                 severity: 'error',
//                 summary: 'Error',
//                 detail: `Employee code is missing for trainee ${trainee.name}`,
//                 life: 3000,
//             });
//         }
//     });
// }
setIsActiveForSelected(isActive: boolean) {
    if (!this.selectedTrainees || this.selectedTrainees.length === 0) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'No trainees selected',
            life: 3000,
        });
        return;
    }

    this.selectedTrainees.forEach((selectedTrainee) => {
        const updatedTrainee = { ...selectedTrainee, isActive };

        if (updatedTrainee.employeeCode) {
            this.traineeService.updateTrainee(updatedTrainee.employeeCode, updatedTrainee).subscribe({
                next: () => {
                    this.trainees = this.trainees.map((t) =>
                        t.employeeCode === updatedTrainee.employeeCode ? updatedTrainee : t
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: `Trainee ${updatedTrainee.name} updated successfully`,
                        life: 3000,
                    });
                },
                error: (err) => {
                    console.error('Update error:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Failed to update trainee ${updatedTrainee.name}: ${err.message}`,
                        life: 3000,
                    });
                },
            });
        }
    });
}



    createId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

  


}