import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
import { WidgetCardsComponent } from "../../Features/widget-cards/widget-cards.component";
import { CalendarModule } from 'primeng/calendar';
import { CallenderComponent } from '../../ui/callender/callender.component';
import { FormComponent } from '../../ui/form/form.component';
@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CardModule, ButtonModule, WidgetCardComponent, WidgetCardsComponent,FormComponent,CallenderComponent],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent {

}
