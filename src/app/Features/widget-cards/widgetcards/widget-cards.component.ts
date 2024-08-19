import { Component, EventEmitter, Input, Output} from '@angular/core';
import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent],
  templateUrl: './widget-cards.component.html',
  styleUrl: './widget-cards.component.css'
})
export class WidgetCardsComponent {

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

