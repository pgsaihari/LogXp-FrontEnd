import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { filter } from 'rxjs';
import { AuthenticationResult, EventMessage, EventType } from '@azure/msal-browser';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { Currentuser } from '../../core/interfaces/currentuser';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  imports:[NgIf,TooltipModule],
  standalone:true,
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {
  currentUser:Currentuser |null ={
    userId:"string",
    name:"string",
    email:"string",
    role:"string"
  }
  userAvatar: string = 'assets/avatar.png'; // Default avatar image

  constructor(public authService:AuthService,
  private msalService:MsalService,
  ) {}

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
    
    this.msalService.instance.setActiveAccount(null);
    
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: '/login' // Automatically redirects to login page after logout
    });
    
    localStorage.clear();
    sessionStorage.clear();
  }

  getName(){
   this.currentUser= this.authService.getCurrentUser()
  }
 
}
