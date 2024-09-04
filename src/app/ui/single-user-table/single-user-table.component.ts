import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CurrentTraineeLog } from '../../core/interfaces/side-profile';
import { ChangeDetectorRef } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-singleuser-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CardModule,
    DialogModule,
    ToastModule,
    RippleModule,
    TooltipModule,
    CalendarModule
  ],
  templateUrl: './single-user-table.component.html',
  styleUrls: ['./single-user-table.component.css'],
})
export class SingleUserTableComponent {
  visible: boolean = false;
  @Input() traineelogs: TraineeAttendanceLogs[] = [];
  filteredTraineeLogs: TraineeAttendanceLogs[] = []; // To store the filtered logs
  traineeId!: number;
  yesterday: Date = new Date();
  selectedDate: any | undefined; // Property to store the selected date
  showCalendar: boolean = false;

  currentTraineeLog: CurrentTraineeLog = {
    status: '',
    remark: '',
  };

  statusOptions: { label: string; value: string }[] = [
    { label: 'Late Arrival', value: 'Late Arrival' },
    { label: 'Early Departure', value: 'Early Departure' },
    { label: 'On Leave', value: 'On Leave' },
    { label: 'Present', value: 'Present' },
  ];

  constructor(
    private traineeAttendancelogService: TraineeAttendancelogService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    console.log('Show Calendar:', this.showCalendar);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.filteredTraineeLogs = this.traineelogs;
    }, 1000);
  }
  
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.showCalendar) {
      this.showCalendar = false;
    }
  }
  
  filterByDate(selectedDate: Date | null): void {
    this.showCalendar = false;
    this.selectedDate = selectedDate;

    if (this.selectedDate) {
      this.filteredTraineeLogs = this.traineelogs.filter(log =>
        new Date(log.date).toDateString() === this.selectedDate!.toDateString()
      );
    } else {
      // If no date is selected, reset to show all logs
      this.filteredTraineeLogs = [...this.traineelogs];
    }
  }

  showDialog(traineelog: TraineeAttendanceLogs) {
    this.visible = true;
    this.currentTraineeLog.status = traineelog.status;
    this.currentTraineeLog.remark = traineelog.remark;
    this.traineeId = traineelog.id;
    console.log(this.currentTraineeLog);
  }

  get isFormValid(): boolean {
    return this.currentTraineeLog.status !== '' && this.currentTraineeLog.remark !== '';
  }

  onSubmit() {
    if (!this.isFormValid) return;

    const updatedLog: CurrentTraineeLog = {
      status: this.currentTraineeLog.status,
      remark: this.currentTraineeLog.remark,
    };

    
    this.traineeAttendancelogService
      .updateTraineeLog(Number(this.traineeId), updatedLog)
      .pipe(
        tap((response) => {
          console.log('Update successful:', response.message);
          this.showMessage('success', 'Successful', 'Status and Remarks updated');
          this.visible = false;

          this.traineelogs = this.traineelogs.map((log) =>
            log.id === this.traineeId ? { ...log, ...updatedLog } : log
          );

          this.filteredTraineeLogs = this.traineelogs; // Reset filtered logs after update
          this.cdr.markForCheck(); // Manually trigger change detection
        }),
        catchError((error) => {
          console.error('Error updating trainee log:', error);
          this.showError('Failed to update trainee', error);
          return of();
        })
      )
      .subscribe();
  }

  // Toast
  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  private showError(summary: string, err: any) {
    console.error(summary, err);
    this.showMessage('error', 'Error', `${summary}: ${err.message}`);
  }

  // Styling for status field
  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'status-present';
      case 'On Leave':
        return 'status-absent';
      case 'Late Arrival':
      case 'Early Departure':
      case 'Late Arrival and Early Departure':
        return 'status-late-arrival';
      default:
        return '';
    }
  }
}