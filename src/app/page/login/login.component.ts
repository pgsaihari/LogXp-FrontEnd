import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner'; // Import the spinner service
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgxSpinnerComponent,FormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    public authService: AuthService,
    private spinner: NgxSpinnerService ,// Inject the spinner service
 

  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.router.navigate(['/home']); // Redirect to home page if already logged in
    }
  }

  // Method to handle the login functionality
  login(): void {
    // Show spinner while logging in
    this.spinner.show();

    if (!this.email || !this.password) {
      this.errorMessage = "Email and password are required.";
      this.spinner.hide();
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Redirect based on user role
        const user = this.authService.getCurrentUser();
        if (user?.role === 'trainee') {
          this.router.navigate([`/user-profile/${user.userId}`]);
        } else if (user?.role === 'admin') {
          this.router.navigate(['/home']);
        }
        this.spinner.hide(); // Hide spinner on successful login
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password. Please try again.';
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load batches' });
        this.spinner.hide(); // Hide spinner on error
      },
    });
  }
}
