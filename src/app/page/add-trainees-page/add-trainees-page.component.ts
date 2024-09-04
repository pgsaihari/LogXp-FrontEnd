import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/model/user.model';
import { NgClass } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { TooltipModule } from 'primeng/tooltip';
import { FormComponent } from "../../ui/form/form.component";

@Component({
  selector: 'app-add-trainees-page',
  standalone: true,
  imports: [ToastModule, NgClass, DialogModule, NgxSpinnerComponent, TooltipModule, FormComponent],
  templateUrl: './add-trainees-page.component.html',
  styleUrls: ['./add-trainees-page.component.css'],
  providers: [MessageService]
})
export class AddTraineesPageComponent {
  displayPopup: boolean = false;

  constructor(private messageService: MessageService, private userService: UserService) {}

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
  
    // Skip the header row and map each row to a User object
    const users: User[] = rows.slice(1).map((row: any[], index: number) => {
      const userId = row[0]?.toString().trim();
      const name = row[1]?.toString().trim();
      const email = row[2]?.toString().trim();
      const isActive = row[3]?.toString().toLowerCase() === 'true';
      const batchId = Number(row[4]) || 0;
  
      if (!userId || !name || !email || batchId === 0) {
        console.error(`Row ${index + 2} contains invalid data:`, row);
        return null;
      }

      return {
        userId,
        name,
        email,
        isActive,
        batchId,
        role: 'trainee' // Assign the role as 'trainee'
      };
    }).filter(user => user !== null);
  
    if (users.length === 0) {
      this.showError(new Error('No valid data found in Excel sheet.'));
      return;
    }
  
    this.userService.addUsers(users).subscribe({
      next: () => this.showSuccess(),
      error: (error) => this.showError(error)
    });
  }
  

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Excel sheet uploaded and users added successfully!' });
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to upload users: ${error.message}` });
  }

  downloadTemplate() {
    const header = [
      ['User ID', 'Name', 'Email', 'Is Active (true/false)', 'Batch ID']
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(header);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Template');
  
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'User_Template.xlsx');
  }
}
