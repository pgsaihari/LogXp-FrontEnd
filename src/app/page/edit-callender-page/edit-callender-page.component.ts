import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { CallenderComponent } from '../../ui/callender/callender.component';
import { DateSelectorComponent } from "../../ui/date-selector/date-selector.component";
import { UserInfoComponent } from "../../ui/user-info/user-info.component";
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-edit-callender-page',
  standalone: true,
  imports: [TopHeaderComponent, CallenderComponent, DateSelectorComponent, UserInfoComponent, CardModule],
  templateUrl: './edit-callender-page.component.html',
  styleUrl: './edit-callender-page.component.css'
})
export class EditCallenderPageComponent {

}
