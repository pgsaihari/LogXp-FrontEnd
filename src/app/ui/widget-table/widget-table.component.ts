import { Component, Input,OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';
import { WidgetAttendance } from '../../core/model/widget-attendance';
import { AttendanceLogsService } from '../../core/services/attendance-logs.service';

@Component({
  selector: 'app-widget-table',
  standalone: true,
  imports: [TableModule, CalendarModule, AutoCompleteModule, FormsModule, NgClass],
  templateUrl: './widget-table.component.html',
  styleUrl: './widget-table.component.css'
})
export class WidgetTableComponent {

@Input()tableHeader!: string;
@Input() toggleField: string = 'Check-In';
todayDate: string | undefined;
date: Date | undefined;
filteredTrainees: WidgetAttendance[] = [];

constructor(private traineeAttendancelogService: AttendanceLogsService) {}

widgetAttandance : WidgetAttendance[]=[];

ngOnInit() {
  this.loadAttendanceLogs(); // Fetch data from the API
}

loadAttendanceLogs(){
  
}

}


