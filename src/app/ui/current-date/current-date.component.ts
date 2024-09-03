  import { DatePipe, NgClass, NgIf } from '@angular/common';
  import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
  import { CardModule } from 'primeng/card';
  import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
  import { catchError, of } from 'rxjs';
  import { ButtonModule } from 'primeng/button';
  import { CalendarModule } from 'primeng/calendar';
  import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BatchService } from '../../core/services/batch.service';
import { Batch } from '../../core/model/batch.model';

  @Component({
    selector: 'app-current-date',
    standalone: true,
    imports: [CardModule, DatePipe,ButtonModule, CalendarModule, FormsModule, NgIf, DropdownModule],
    templateUrl: './current-date.component.html',
    styleUrl: './current-date.component.css'
  })
  export class CurrentDateComponent implements OnInit{
    @Output() batchSelected = new EventEmitter<Batch>();

    batches: Batch[] = []; // Array to hold the list of batches
    selectedBatch!: Batch; // Store the selected batch
    currentTime!: Date;
    currentDate!: Date;
    latestLogDate!: Date
    timeIcon: string = '';
    timeOfDay: string = '';
    error: any;
    showCalendar: boolean = false; // Control calendar visibility
    selectedDate!: Date // Store selected date
    maxDate!: Date;
    constructor(private api: TraineeAttendancelogService, private elementRef: ElementRef,private batchService: BatchService)
     {
     }

    ngOnInit() {
       this.getLatestDate();
       this.loadBatches();
    
    }

    loadBatches() {
      this.batchService.getBatches().subscribe(batches => this.batches = batches);
    }

    getLatestDate() {
      this.api.getWidgetCount().subscribe((data) => {
        if (data.latestDate) {
          this.latestLogDate = new Date(data.latestDate);
          this.selectedDate = new Date(this.latestLogDate);
          this.maxDate = new Date(this.latestLogDate);
  
          // Set the selected date in the service
          this.api.setSelectedDate(this.selectedDate);
        }
      });
    }

    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
      console.log('Show Calendar:', this.showCalendar); // Verify the state
    }
    
    onDateSelect(event: any) {
      this.selectedDate = event;
      this.api.setSelectedDate(this.selectedDate);
      this.showCalendar = false; // Hide the calendar after selecting a date
      console.log('Selected Date:', this.selectedDate);
      this.latestLogDate = this.selectedDate
      // Call onDateChange after selecting the date
      this.onDateChange(this.selectedDate);
    }

    onDateChange(date: Date) {
      this.selectedDate = date;
      const formattedDate = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
      this.api.updateSelectedDate(formattedDate);
    }

    onBatchSelect() {
      console.log('Selected Batch:', this.selectedBatch);
      this.batchSelected.emit(this.selectedBatch);
      // Implement any other logic you want to execute when a batch is selected.
    }
    
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showCalendar = false;
      }
    }
  }