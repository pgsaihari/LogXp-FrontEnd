import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, PopupRequest } from '@azure/msal-browser';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgxSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.router.navigate(['/home']); // Redirect to home page if already logged in
    }

    // Handle redirect observable for token
    this.msalService.handleRedirectObservable().subscribe({
      next: (response: AuthenticationResult) => {
        if (response && response.accessToken) {
          console.log('Login successful, Access Token:', response.accessToken);

          // Store the access token in local storage
          localStorage.setItem('msalKey', response.accessToken);

          // Call the AuthService to perform further actions (e.g., calling backend)
          this.authService.getUserRole(response.accessToken).subscribe({
            next: (userRoleData) => {
              console.log('User Role Data:', userRoleData); // Ensure this contains role info
              this.authService.setCurrentUser(userRoleData); // Set the current user

              const user = this.authService.getCurrentUser();
              if (user?.Role === 'trainee') {
                this.router.navigate([`/user-profile/${user.UserId}`]);
              } else if (user?.Role === 'admin') {
                this.router.navigate(['/home']);
              }
            },
            error: (error) => {
              console.error('Error fetching user role:', error);
            }
          });
        } else {
          console.log('No access token found in the response');
        }
      },
      error: (error) => {
        console.error('Error during token processing:', error);
      }
    });
  }

  trainerLogin() {
    alert('Trainer logged in');
    sessionStorage.setItem('logintoken', 'trainer');
    this.router.navigate(['/home']);
  }

  adminLogin() {
    this.loginPopup();
    sessionStorage.setItem('logintoken', 'admin');
    this.router.navigate(['/home']);
  }

  traineeLogin() {
    alert('Trainee logged in');
    sessionStorage.setItem('logintoken', 'user');
    this.router.navigate(['/home']);
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.msalService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.handleLoginResponse(response);
        });
    } else {
      this.msalService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.handleLoginResponse(response);
        });
    }
  }

  handleLoginResponse(response: AuthenticationResult) {
    this.msalService.instance.setActiveAccount(response.account);
    const accessToken = response.accessToken;

    // Store the access token in local storage
    localStorage.setItem('msalKey', accessToken);

    // Fetch user role using accessToken
    this.authService.getUserRole(accessToken).subscribe({
      next: (userRoleData) => {
        console.log('User Role Data:', userRoleData); // Ensure this contains role info
        this.authService.setCurrentUser(userRoleData); // Set the current user

        const user = this.authService.getCurrentUser();
        console.log('Current User:', user); // Log current user for debugging

        // Route based on user role
        if (user?.Role === 'trainee') {
          this.router.navigate([`/user-profile/${user.UserId}`]);
        } else if (user?.Role === 'admin') {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Error fetching user role:', err);
      },
    });
  }
}
