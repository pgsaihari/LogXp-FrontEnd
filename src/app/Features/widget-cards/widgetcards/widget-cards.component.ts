import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
import { TraineeServiceService } from '../../../core/services/trainee-service.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent,FormsModule],
  templateUrl: './widget-cards.component.html',
  styleUrl: './widget-cards.component.css'
})
export class WidgetCardsComponent implements OnInit {

  constructor(private traineeService:TraineeServiceService,private messageService: MessageService){}
  totalTrainees:number=0;
  ngOnInit(): void {
      this.traineeService.getTraineesCount().subscribe(
        response=>{
          console.log(response);
  
          this.totalTrainees=response;
        },
        error=>{
          this.messageService.add({severity:'error', summary:`${error.error.message}`, detail:'LogXp'}); // Show success toast
         
          console.error('Error adding trainee', error); 
         
        }

      )
  }
  @Output() widgetSelected = new EventEmitter<{isClicked: boolean, header: string}>();
  
  constructor(private http: HttpClient) {}

  // const attendanceApis = [
  //   {
  //     label: 'On Time',
  //     url: 'https://localhost:7074/api/LogXP/traineeAttendanceLogs/earlyArrivals'
  //   },
  //   {
  //     label: 'Absent',
  //     url: 'https://localhost:7074/api/LogXP/traineeAttendanceLogs/absentees'
  //   },
  //   {
  //     label: 'Late Arrival',
  //     url: 'https://localhost:7074/api/LogXP/traineeAttendanceLogs/lateArrivals'
  //   },
  //   {
  //     label: 'Early Departure',
  //     url: 'https://localhost:7074/api/LogXP/traineeAttendanceLogs/earlyDepartures'
  //   }
  // ];
  
  
    ngOnInit(){
      this.widgetCount();
    }

    widgetCount(){
    }

clickWidget(dataRecieved: { isClicked: boolean, header: string }){
  this.widgetSelected.emit(dataRecieved)

  }
}

