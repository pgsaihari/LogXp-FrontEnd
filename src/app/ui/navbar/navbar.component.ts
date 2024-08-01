import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  activeIndex = 2; // Set the default active index
  
  ngOnInit() {
    const user = localStorage.getItem('logintoken');
    if (user) {
      this.role=user;
       console.log(user);
    }
    
  }
  role:string=''
  setActive(index: number) {
    this.activeIndex = index;
  }
}
