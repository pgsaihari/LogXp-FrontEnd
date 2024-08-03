import { Component } from '@angular/core';
import { TopHeaderComponent } from "../../ui/top-header/top-header.component";
import { FormComponent } from '../../ui/form/form.component';

@Component({
  selector: 'app-add-trainees-page',
  standalone: true,
  imports: [TopHeaderComponent,FormComponent],
  templateUrl: './add-trainees-page.component.html',
  styleUrl: './add-trainees-page.component.css'
})
export class AddTraineesPageComponent {

}
