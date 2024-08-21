import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
import { TraineeServiceService } from '../../../core/services/trainee-service.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';
import { RouterLink, RouterOutlet } from '@angular/router';
// import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';


@Component({
  selector: 'app-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent,FormsModule, RouterLink, RouterOutlet],
  templateUrl: './widget-cards.component.html',
  styleUrl: './widget-cards.component.css'
})
export class WidgetCardsComponent implements OnInit {

  @Output() widgetSelected = new EventEmitter<{isClicked: boolean, header: string}>();

  constructor(private traineeService:TraineeServiceService,private messageService: MessageService ,private AttendanceLogsService:AttendanceLogsService){}

  totalTrainees:Number= 0;
  onTimeNum: Number = 0;
  absentees: Number = 0;
  lateArrivals: Number = 0;
  earlyDepartures: Number = 0;


  activeCardIndex!: Number;

  clickWidget(dataRecieved: { isClicked: boolean, header: string }){
    this.widgetSelected.emit(dataRecieved)
    }



  ngOnInit(): void {
      this.traineeService.getTraineesCount().subscribe(
        response=>{
          console.log(response);
  
          this.totalTrainees=response;
        },
        error=>{
          this.messageService.add({severity:'error', summary:`${error.error.message}`, detail:'LogXp'}); // Show success toast

          console.error('Error adding trainee', error); 

        })

       //Early Arrivals Count
        this.AttendanceLogsService.getEarlyArrivalsCount().subscribe(count => {
          console.log('Count of early arrivals:', count);
          this.onTimeNum = count;
        });

        //Absentees Count
        this.AttendanceLogsService.getAbsenteesCount().subscribe(count => {
          console.log('Count of absent:', count);
          this.absentees = count;
        });
        this.AttendanceLogsService.lateArrivalsCount().subscribe(count => {
          console.log('Count of late arrivals:', count);
          this.lateArrivals = count;
        });

        //Early Departures Count
        this.AttendanceLogsService.earlyDeparturesCount().subscribe(count => {
          console.log('Count of late arrivals:', count);
          this.earlyDepartures = count;
        });

  }

}