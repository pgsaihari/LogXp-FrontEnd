import { Component } from '@angular/core';
import { TopHeaderComponent } from '../../ui/top-header/top-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
