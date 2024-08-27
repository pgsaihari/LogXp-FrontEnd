import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { TooltipModule } from 'primeng/tooltip';
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
  currentUrl:string = '';
  
  constructor(
    // @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbar(event.urlAfterRedirects);
      } 
    });
    this.updateNavbar(this.router.url);
  }

  setActive(index: number) {
    this.activeIndex = index;
  }

  updateNavbar(currentUrl:string){
    switch(currentUrl){
      case "/home":this.setActive(0);
      break;
      case "/search": this.setActive(1);
      break;
      case "/add-trainee":this.setActive(2);
      break;
      case "/edit-callender": this.setActive(3);
      break;
      default: break;
    }
  }
}
