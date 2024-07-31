import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  activeIndex = 2; // Set the default active index
  role:string='trainer'
  setActive(index: number) {
    this.activeIndex = index;
  }
}
