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

  logout() {
    // Clear any stored tokens or user session details
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('logintoken');

    // Redirect to the login page after logging out
    window.location.href = '/login';
    
    localStorage.clear();
    sessionStorage.clear();
  }

  getName() {
    this.currentUser = this.authService.getCurrentUser();
  }
}
