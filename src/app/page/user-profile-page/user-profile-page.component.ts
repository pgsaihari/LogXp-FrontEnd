import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [TopHeaderComponent, NgxSpinnerComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent {

}
