import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { Currentuser } from '../../core/interfaces/currentuser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  imports: [NgIf, TooltipModule, FormsModule],
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
  dropdownVisible: boolean = false;
  showChangePasswordPopup: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getName();
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Open the change password popup
  openChangePasswordPopup() {
    this.showChangePasswordPopup = true;
    this.dropdownVisible = false;
  }

  // Close the change password popup
  closeChangePasswordPopup() {
    this.showChangePasswordPopup = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }

  // Call the change password function
  changePassword(event: Event) {
    event.preventDefault(); // Prevents page reload on form submission

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match';
      return;
    }
    
    this.authService.changePassword(this.currentPassword, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.closeChangePasswordPopup();
      },
      error: (error) => {
        console.error('Change password failed:', error);
        this.errorMessage = error.message || 'Failed to change password. Please try again.';
      }
    });
  }

  // Logout function
  logout() {
    this.authService.logout(); 
    window.location.href = '/login'; 
  }

  getName() {
    this.currentUser = this.authService.getCurrentUser();
  }
}
