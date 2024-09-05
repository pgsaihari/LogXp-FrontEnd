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
  export class CurrentDateComponent implements OnInit {
    @Output() batchSelected = new EventEmitter<Batch>();
  
    batches: Batch[] = [];
    selectedBatch!: Batch;
    placeholder: string = '';
    latestLogDate!: Date;
    selectedDate!: Date;
    maxDate!: Date;
    showCalendar: boolean = false;
  
    constructor(
      private api: TraineeAttendancelogService,
      private elementRef: ElementRef,
      private batchService: BatchService
    ) {}
    
     /**
     * Initializes the component, fetching the latest attendance date and batch list.
     */
    ngOnInit() {
      this.getLatestDate();
      this.loadBatches();
    }
     /**
     * Loads the list of batches from the batch service and sets the first batch as the selected one.
     */
    loadBatches() {
      this.batchService.getBatches().subscribe(batches => {
        this.batches = batches;
        if (batches.length) {
          this.placeholder = batches[0].batchName;
          this.selectedBatch = batches[0];
          this.batchSelected.emit(this.selectedBatch);
        }
      });
    }
  
     /**
     * Fetches the latest log date from the attendance API and sets the calendar date.
     */
    getLatestDate() {
      this.api.getWidgetCount().subscribe(data => {
        if (data.latestDate) {
          this.latestLogDate = new Date(data.latestDate);
          this.selectedDate = new Date(this.latestLogDate);
          this.maxDate = this.latestLogDate;
          this.api.setSelectedDate(this.selectedDate);
        }
      });
    }
  
     /**
     * Toggles the visibility of the calendar.
     */
    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
    }
  
    /**
     * Handles date selection from the calendar, setting the selected date and hiding the calendar.
     *
     * @param event The selected date.
     */
    onDateSelect(event: Date) {
      this.selectedDate = event;
      this.api.setSelectedDate(this.selectedDate);
      this.showCalendar = false;
      this.latestLogDate = this.selectedDate;
      this.onDateChange(this.selectedDate);
    }
  
    /**
     * Updates the selected date in the attendance API in day/month/year format.
     *
     * @param date The newly selected date.
     */
    onDateChange(date: Date) {
      const formattedDate = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
      this.api.updateSelectedDate(formattedDate);
    }

    /**
     * Emits the selected batch when the another batch from dropdown is selected.
     */
    onBatchSelect() {
      this.batchSelected.emit(this.selectedBatch);
      if (this.selectedBatch) {
        this.placeholder = this.selectedBatch.batchName;
      }
    }
  
    /**
     * Listens for clicks outside the component to close the calendar.
     *
     * @param event The mouse event triggered by clicking outside the component.
     */
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      const clickedDropdown = (event.target as HTMLElement).closest('.dropdown-button');
      
      if (!clickedInside || clickedDropdown) {
        this.showCalendar = false;
      }
    }
    
  }