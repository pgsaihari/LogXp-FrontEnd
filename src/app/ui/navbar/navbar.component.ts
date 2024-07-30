import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  activeIndex = 2; // Set the default active index

  setActive(index: number) {
    this.activeIndex = index;
  }
}
