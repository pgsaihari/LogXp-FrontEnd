import { Component, Input, OnInit} from '@angular/core';
import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
import { TraineeServiceService } from '../../../core/services/trainee-service.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';


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

}
