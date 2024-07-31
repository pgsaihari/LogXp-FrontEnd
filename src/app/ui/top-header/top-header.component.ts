import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {
  userName: string;
  userEmail: string;
  userAvatar: string;

  constructor() {
    // Initialize with default values or fetch from a service
    this.userName = 'Admin';
    this.userEmail = 'admin@domain.com';
    this.userAvatar = 'assets/avatar.png'; // Default avatar image
  }

  ngOnInit(): void {
    // Here you can fetch user details from a service if needed
    // For example:
    // this.fetchUserDetails();
  }

  // Example method to fetch user details
  fetchUserDetails(): void {
    // This is where you'd typically call a service to get the user details
    // For now, we'll just use static data
    this.userName = 'Admin';
    this.userEmail = 'admin@domain.com';
    this.userAvatar = 'assets/avatar.png';
  }
}
