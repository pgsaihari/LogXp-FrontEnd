import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  imports:[NgIf],
  standalone:true,
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {
  userName: string;
  userEmail: string;
  userAvatar: string;

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
  private authService: MsalService,
  private msalBroadcastService: MsalBroadcastService) {
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
  dropdownVisible: boolean = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
  }

}
