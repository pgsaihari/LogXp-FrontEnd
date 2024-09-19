import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgxSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  // ngOnInit(): void {
  //   console.log("hii");
  //   // Custom authentication logic to check if the user is already logged in
  //   const token = localStorage.getItem('authToken');
  //   if (token) {
  //     this.router.navigate(['/home']); // Redirect to home page if already logged in
  //   }
  // }

  // trainerLogin() {
  //   alert('Trainer logged in');
  //   sessionStorage.setItem('logintoken', 'trainer');
  //   this.router.navigate(['/home']);
  // }

  // // adminLogin() {
  // //   this.customLogin('admin');
  // //   sessionStorage.setItem('logintoken', 'admin');
  // //   this.router.navigate(['/home']);
  // // }

  // traineeLogin() {
  //   alert('Trainee logged in');
  //   sessionStorage.setItem('logintoken', 'user');
  //   this.router.navigate(['/home']);
  // }

  // // customLogin(role: string) {
  // //   // Custom login logic for admin
  // //   this.authService.login(role).subscribe({
  // //     next: (response) => {
  // //       console.log('Login successful:', response);

  // //       // Store token in local storage
  // //       localStorage.setItem('authToken', response.token);

  // //       // Fetch user role from the response
  // //       this.authService.getUserRole(response.token).subscribe({
  // //         next: (userRoleData) => {
  // //           console.log('User Role Data:', userRoleData);

  // //           this.authService.setCurrentUser(userRoleData); // Set the current user

  // //           const user = this.authService.getCurrentUser();
  // //           if (user?.role === 'trainee') {
  // //             this.router.navigate([`/user-profile/${user.userId}`]);
  // //           } else if (user?.role === 'admin') {
  // //             this.router.navigate(['/home']);
  // //           }
  // //         },
  // //         error: (error) => {
  // //           console.error('Error fetching user role:', error);
  // //         }
  // //       });
  // //     },
      
  // //   });
  // // }
}
