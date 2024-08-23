import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { FormComponent } from '../../ui/form/form.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import * as XLSX from 'xlsx';
import { TraineeServiceService } from '../../core/services/trainee-service.service';
import { Trainee } from '../../core/model/trainee.model';

@Component({
  selector: 'app-add-trainees-page',
  standalone: true,
  imports: [TopHeaderComponent, FormComponent, ToastModule],
  templateUrl: './add-trainees-page.component.html',
  styleUrls: ['./add-trainees-page.component.css'],
  providers: [MessageService]
})
export class AddTraineesPageComponent {

  constructor(private messageService: MessageService, private traineeService: TraineeServiceService) {}

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
    // Parse the Excel file using XLSX
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Type the result of the sheet_to_json as any[][]
    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Map over the rows to create an array of Trainee objects
    const trainees: Trainee[] = rows.slice(1) // Skip header row
      .map((row: any[]) => ({
        employeeCode: row[0]?.toString(),
        name: row[1]?.toString(),
        email: row[2]?.toString(),
        isActive: row[3]?.toString() === 'true',
        batchId: Number(row[4])
      }));

    // Send parsed data to the backend
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
}
