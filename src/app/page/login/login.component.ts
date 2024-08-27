import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, PopupRequest } from '@azure/msal-browser';
import { NgxSpinnerComponent } from 'ngx-spinner';

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
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    const accounts = this.authService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.router.navigate(['/home']);  // Redirect to home page if logged in
    }
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
      this.authService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
          this.router.navigate(['/home']);
        });
    } else {
      this.authService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
          this.router.navigate(['/home']);
        });
    }
  }
}
