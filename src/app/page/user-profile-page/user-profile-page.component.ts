import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [TopHeaderComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent {

}
