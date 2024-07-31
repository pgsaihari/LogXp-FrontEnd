import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DateSelectorComponent } from "./ui/date-selector/date-selector.component";
import { UserInfoComponent } from "./ui/user-info/user-info.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DateSelectorComponent, UserInfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontEnd';
}
