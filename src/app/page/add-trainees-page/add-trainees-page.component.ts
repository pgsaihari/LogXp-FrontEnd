import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { FormComponent } from '../../ui/form/form.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { TraineeServiceService } from '../../core/services/trainee-service.service';
import { Trainee } from '../../core/model/trainee.model';
import { NgClass } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

import { NgxSpinnerComponent } from 'ngx-spinner';
import { TooltipModule } from 'primeng/tooltip';




@Component({
  selector: 'app-add-trainees-page',
  standalone: true,

  imports: [ FormComponent, ToastModule,NgClass,DialogModule, NgxSpinnerComponent,TooltipModule],
  templateUrl: './add-trainees-page.component.html',
  styleUrls: ['./add-trainees-page.component.css'],
  providers: [MessageService]
})
export class AddTraineesPageComponent {
  displayPopup: boolean = false;
  constructor(private messageService: MessageService, private traineeService: TraineeServiceService) {}
  showPopup() {
    this.displayPopup = true;
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      this.processExcel(data);
    };
    reader.readAsArrayBuffer(file);
  }

  processExcel(data: Uint8Array) {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
  
    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
    // Skip the header row and map each row to a Trainee object
    const trainees: Trainee[] = rows.slice(1).map((row: any[], index: number) => {
      // Perform validation and provide default values or handle errors
      const employeeCode = row[0]?.toString().trim();
      const name = row[1]?.toString().trim();
      const email = row[2]?.toString().trim();
      const isActive = row[3]?.toString().toLowerCase() === 'true';
      const batchId = Number(row[4]) || 0;
  
      if (!employeeCode || !name || !email || batchId === 0) {
        console.error(`Row ${index + 2} contains invalid data:`, row);
        return null;
      }
  
      return {
        employeeCode,
        name,
        email,
        isActive,
        batchId,
      };
    }).filter(trainee => trainee !== null);
  
    if (trainees.length === 0) {
      this.showError(new Error('No valid data found in Excel sheet.'));
      return;
    }
  
    this.traineeService.addTrainees(trainees).subscribe({
      next: () => this.showSuccess(),
      error: (error) => this.showError(error)
    });
  }
  

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Excel sheet uploaded and trainees added successfully!' });
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to upload trainees: ${error.message}` });
  }
    // Function to download Excel template
    downloadTemplate() {
      // Define the header row
      const header = [
        ['Employee Code', 'Name', 'Email', 'Is Active (true/false)', 'Batch ID']
      ];
  
      // Create a new workbook and add the header to the first sheet
      const worksheet = XLSX.utils.aoa_to_sheet(header);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Trainee Template');
  
      // Convert the workbook to a binary array
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      // Save the file
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, 'Trainee_Template.xlsx');
    }
}
