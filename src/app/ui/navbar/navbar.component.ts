import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  activeIndex = 0; // Set the default active index
  role: string = ''; // Role variable
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = "admin"; // Just for testing
    if (user) {
      this.role = user;
      console.log(user);
    }
  }

  setActive(index: number) {
    this.activeIndex = index;
  }

  logout() {
    // Clear local storage/session storage
    localStorage.removeItem('msal.account.keys');
    sessionStorage.removeItem('logintoken');
    
    // Unset active MSAL account
    this.authService.instance.setActiveAccount(null);
    
    // Trigger logout via redirect (no popup)
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/login' // Automatically redirects to login page after logout
    });
    
    // Clear any remaining session or local storage
    localStorage.clear();
    sessionStorage.clear();
  }
  
  
}
