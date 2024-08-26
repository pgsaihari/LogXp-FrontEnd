import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { filter } from 'rxjs';
import { AuthenticationResult, EventMessage, EventType } from '@azure/msal-browser';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  imports:[NgIf,TooltipModule],
  standalone:true,
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userAvatar: string = 'assets/avatar.png'; // Default avatar image

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
  private authService: MsalService,
  private msalBroadcastService: MsalBroadcastService) {}

  ngOnInit(): void {
    this.getName();
  }

  dropdownVisible: boolean = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout() {
    localStorage.removeItem('msal.account.keys');
    sessionStorage.removeItem('logintoken');
    
    this.authService.instance.setActiveAccount(null);
    
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/login' // Automatically redirects to login page after logout
    });
    
    localStorage.clear();
    sessionStorage.clear();
  }

  getName(){
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        console.log("Login success event triggered:", result);  // Log the login event result
        
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        console.log("Active account set:", payload.account);  // Log the active account details

        // Retrieve username and email
        const account = this.authService.instance.getActiveAccount();
        if (account) {
          console.log("Active account found:", account);  // Log active account details
          this.userName = account.name || '';  // Use the name if available
          this.userEmail = account.username;   // Username typically holds the email
          console.log("User Name:", this.userName);  // Log the user name
          console.log("User Email:", this.userEmail); // Log the user email
        } else {
          console.log("No active account found.");  // Log if no active account is found
        }
      });

    // If already logged in, check the active account
    const activeAccount = this.authService.instance.getActiveAccount();
    if (activeAccount) {
      console.log("Already logged in. Active account:", activeAccount);  // Log active account on refresh
      this.userName = activeAccount.name || '';  // Use the name if available
      this.userEmail = activeAccount.username;   // Username typically holds the email
      console.log("User Name (on refresh):", this.userName);  // Log the user name on refresh
      console.log("User Email (on refresh):", this.userEmail); // Log the user email on refresh
    } else {
      console.log("No active account during refresh.");  // Log if no active account is found on refresh
    }
  }
}
