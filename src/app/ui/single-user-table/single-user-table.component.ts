import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms'; // For [(ngModel)] two-way binding
import { TraineeAttendanceLogs } from '../../core/model/traineeAttendanceLogs.model';

@Component({
  selector: 'app-singleuser-table',
  standalone: true,
  imports: [CommonModule, TableModule, CheckboxModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './single-user-table.component.html',
  styleUrls: ['./single-user-table.component.css']
})
export class SingleUserTableComponent implements OnInit {
  ngOnInit(): void {
    console.log("traineelog");
  }
  // Sample data for the customers array
 @Input() traineelogs: TraineeAttendanceLogs[] = [
    
    // Add more customer data as needed
  ];

  globalFilter: string = ''; // For search input filter
  selectAll: boolean = false; // For handling "select all" checkbox

  // Toggle the "select all" checkbox
  

  // Filter event
  
}
