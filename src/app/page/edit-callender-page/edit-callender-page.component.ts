import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CallenderComponent } from '../../ui/callender/callender.component';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-edit-callender-page',
  standalone: true,
  imports: [ CommonModule,          

  CallenderComponent,   
 
  ButtonModule  ],
  templateUrl: './edit-callender-page.component.html',
  styleUrl: './edit-callender-page.component.css'
})
export class EditCallenderPageComponent {

}
