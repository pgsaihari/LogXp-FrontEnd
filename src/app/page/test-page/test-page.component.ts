import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
// import { WidgetCardsComponent } from "../../Features/widget-cards/widget-cards.component";
import { CalendarModule } from 'primeng/calendar';
import { CallenderComponent } from '../../ui/callender/callender.component';
import { FormComponent } from '../../ui/form/form.component';
import { WidgetTableComponent } from "../../ui/widget-table/widget-table.component";
import { UserTableComponent } from "../../ui/user-table/user-table.component";
@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CardModule, ButtonModule, WidgetCardComponent, FormComponent, CallenderComponent, WidgetTableComponent, UserTableComponent],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent {
  employee_count: Number = 456;
  header_icon: string = 'fa-solid fa-users employee-icon';
  card_header: string = 'Total Employees';
  footer_icon: string = 'fa-solid fa-circle-plus'
  card_footer: string = '2 new employees added!'
}
