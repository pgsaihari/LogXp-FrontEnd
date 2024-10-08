import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgxSpinnerComponent, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  // Forgot password related fields
  isForgotPassword: boolean = false;
  isOtpSent: boolean = false;
  forgotEmail: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    public authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');

    // Only redirect if a token exists and the user is not attempting password recovery
    if (token && !this.isForgotPassword) {
      this.router.navigate(['/home']);
    }
  }

  // Toggle between login and forgot password forms
  toggleForgotPassword(event:Event): void {
    event.preventDefault();
    this.isForgotPassword = !this.isForgotPassword;
    this.isOtpSent = false; // Reset OTP sent state when toggling
    this.errorMessage = '';
    this.email = '';
    this.password = '';
    this.forgotEmail = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Handle login functionality
  login(): void {
    this.spinner.show();
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      this.spinner.hide();
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // console.log('Login successful:', response);
        const user = this.authService.getCurrentUser();
        
        // Redirect based on user role
        if (user?.role === 'trainee') {
          this.router.navigate([`/user-profile/${user.userId}`]);
        } else if (user?.role === 'admin') {
          this.router.navigate(['/home']);
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password. Please try again.';
        this.spinner.hide();
      },
    });
  }

  // Send OTP for password reset
  sendOtp(): void {
    this.spinner.show();
    if (!this.forgotEmail) {
      this.errorMessage = 'Email is required.';
      this.spinner.hide();
      return;
    }

    this.authService.sendOtp(this.forgotEmail).subscribe({
      next: () => {
        alert('OTP sent to your email. Please check.');
        this.isOtpSent = true;
        this.spinner.hide();
      },
      error: (error) => { 
        // console.log(this.forgotEmail)
        console.error('Failed to send OTP:', error);
        this.errorMessage = 'Failed to send OTP. Please try again.';
        this.spinner.hide();
      },
    });
  }

  // Reset password using OTP
  resetPassword(): void {
    this.spinner.show();
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      this.spinner.hide();
      return;
    }

    this.authService.resetPassword(this.forgotEmail, this.otp, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        alert('Password reset successfully! Please log in with your new password.');
        this.isForgotPassword = false; // Switch back to login form
        this.isOtpSent = false; // Reset OTP sent state
        this.errorMessage = ''; 
        this.forgotEmail = ''; 
        this.otp = ''; 
        this.newPassword = ''; 
        this.confirmPassword = ''; 
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Password reset failed:', error);
        this.errorMessage = 'Failed to reset password. Please try again.';
        this.spinner.hide();
      },
    });
}

}
