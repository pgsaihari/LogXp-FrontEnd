import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NgxSpinnerComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  constructor(private router: Router) {}


 
}
