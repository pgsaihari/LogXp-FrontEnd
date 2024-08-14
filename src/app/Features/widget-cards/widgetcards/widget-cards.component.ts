import { Component, EventEmitter, Input, Output} from '@angular/core';
import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';


@Component({
  selector: 'app-widget-cards',
  standalone: true,
  imports: [WidgetCardComponent],
  templateUrl: './widget-cards.component.html',
  styleUrl: './widget-cards.component.css'
})
export class WidgetCardsComponent {

  @Output() widgetSelected = new EventEmitter<any>();
  
clickWidget(data:boolean){
  if (data) {
    this.widgetSelected.emit(data);
    // Implement functionality to communicate with HomeComponent
    // Use an EventEmitter or a service depending on your preference
  }
}

}
