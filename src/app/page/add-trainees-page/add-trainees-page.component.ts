import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { FormComponent } from '../../ui/form/form.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add-trainees-page',
  standalone: true,
  imports: [TopHeaderComponent, FormComponent,ToastModule],
  templateUrl: './add-trainees-page.component.html',
  styleUrls: ['./add-trainees-page.component.css'],
  providers: [MessageService]
})
export class AddTraineesPageComponent {

  constructor(private messageService: MessageService) {}

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
    // Use a library like XLSX to parse the Excel file data
    // Example: const workbook = XLSX.read(data, { type: 'array' });
    // Process the workbook to extract trainee details
    console.log('Excel data processed:', data);
    this.showSuccess();
  }

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Excel sheet uploaded successfully!'});
  }
}
