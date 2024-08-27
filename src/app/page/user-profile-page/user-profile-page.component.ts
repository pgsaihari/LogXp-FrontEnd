import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { WidgetCardComponent } from "../../ui/widget-card/widget-card.component";
// import { WidgetCardsComponent } from "../../Features/widget-cards/widget-cards.component";
import { CalendarModule } from 'primeng/calendar';
import { CallenderComponent } from '../../ui/callender/callender.component';
import { FormComponent } from '../../ui/form/form.component';
import { WidgetTableComponent } from "../../ui/widget-table/widget-table.component";
import { UserTableComponent } from "../../ui/user-table/user-table.component";
import { SingleUserTableComponent } from "../../ui/single-user-table/single-user-table.component";
import { SideUserProfileComponent } from "../../Features/side-user-profile/side-user-profile.component";
import { UserWidgetCardsComponent } from "../../Features/user-widget-cards/user-widget-cards.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [TopHeaderComponent, CardModule, ButtonModule, WidgetCardComponent, FormComponent, CallenderComponent, WidgetTableComponent, UserTableComponent, SingleUserTableComponent, SideUserProfileComponent, UserWidgetCardsComponent, NgxSpinnerComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent {
}
