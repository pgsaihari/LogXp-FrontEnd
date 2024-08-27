import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink,TooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  activeIndex = 0; // Set the default active index
  role: string = ''; // Role variable
  
  constructor(
    // @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    public userService:AuthService
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

 
  

  
}
