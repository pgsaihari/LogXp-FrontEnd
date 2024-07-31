import { Component } from '@angular/core';
import { TopHeaderComponent } from '../../ui/top-header/top-header.component';
import { GraphComponent } from '../../ui/graph/graph.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent,GraphComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
