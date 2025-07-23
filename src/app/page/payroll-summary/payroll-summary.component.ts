import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePipe } from '@angular/common';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-payroll-summary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './payroll-summary.component.html',
  styleUrls: ['./payroll-summary.component.css'],
  providers: [DatePipe]
})
export class PayrollSummaryComponent {
  @Input() isPayrollSummaryComponentVisible = false;
  @Output() isPayrollSummaryComponentVisibleChange = new EventEmitter<boolean>();

  dateRangeForm: FormGroup;
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private readonly traineeAttendanceSummary: TraineeAttendancelogService
  ) {
     this.dateRangeForm = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }


  closeSummarySidePanel(): void {
    this.isPayrollSummaryComponentVisibleChange.emit(false);
  }

onDownload(): void {
  if (this.dateRangeForm.valid) {
    const fromDate = this.dateRangeForm.value.fromDate;
    const toDate = this.dateRangeForm.value.toDate;

    this.traineeAttendanceSummary.getPayrollAttendanceSummary(fromDate, toDate)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
            const workbook: XLSX.WorkBook = { Sheets: { 'Payroll Summary': worksheet }, SheetNames: ['Payroll Summary'] };

            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const fileName = `Consolidated_Attendance_Summary.xlsx`;

            this.saveAsExcelFile(excelBuffer, fileName);
          } else {
            console.warn('No data found for the selected date range.');
          }
        },
        error: (err) => {
          console.error('Error fetching payroll summary:', err);
        }
      });
  }
}

EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
  FileSaver.saveAs(data, fileName);
}



}
