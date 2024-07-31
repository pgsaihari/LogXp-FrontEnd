import { Component } from '@angular/core';
import { DateSelectorComponent } from "../../../ui/date-selector/date-selector.component";

@Component({
  selector: 'app-trainee-profile',
  standalone: true,
  imports: [DateSelectorComponent],
  templateUrl: './trainee-profile.component.html',
  styleUrl: './trainee-profile.component.css'
})
export class TraineeProfileComponent {

}
