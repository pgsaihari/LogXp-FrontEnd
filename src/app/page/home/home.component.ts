import { Component } from '@angular/core';
import { GraphComponent } from '../../ui/graph/graph.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GraphComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
