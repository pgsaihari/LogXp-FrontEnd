import { Component } from '@angular/core';
import { GraphComponent } from "../../../ui/graph/graph.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [GraphComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
