import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { Currentuser } from '../../core/interfaces/currentuser';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  imports: [NgIf, TooltipModule],
  standalone: true,
  styleUrls: ['./top-header.component.css'],
})
export class TopHeaderComponent implements OnInit {
  currentUser: Currentuser | null = {
    userId: 'string',
    name: 'string',
    email: 'string',
    role: 'string',
  };
  userAvatar: string = 'assets/avatar.png'; // Default avatar image

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getName();
  }

  dropdownVisible: boolean = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Updated logout method to use AuthService
  logout() {
    this.authService.logout(); // Call the logout function from AuthService
    window.location.href = '/login'; // Redirect to the login page after logging out
  }

  getName() {
    this.currentUser = this.authService.getCurrentUser();
  }
}
