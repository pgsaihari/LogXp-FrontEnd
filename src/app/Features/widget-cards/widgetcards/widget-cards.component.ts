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

  @Output() widgetSelected = new EventEmitter<{isClicked: boolean, header: string}>();

clickWidget(dataRecieved: { isClicked: boolean, header: string }){
  this.widgetSelected.emit(dataRecieved)

  }
}

