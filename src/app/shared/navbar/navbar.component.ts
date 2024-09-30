import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { RealTimePopUpComponent } from "../../ui/real-time-pop-up/real-time-pop-up.component";
import { TraineeAttendancelogService } from '../../core/services/trainee-attendancelog.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink, TooltipModule, RealTimePopUpComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  activeIndex = 0; // Set the default active index
  role: string | null = ''; // Role variable
  currentUrl:string = '';
  
  constructor(
    // @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    
    public authService:AuthService,
    private router: Router,
    private stateService: TraineeAttendancelogService
  ) {}

  ngOnInit() {
    
   this.role="admin"
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbar(event.urlAfterRedirects);
      } 
    });
    this.stateService.popupState$.subscribe(isShown => {
      if (!isShown) {
        this.updateNavbar(this.router.url); 
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
      case "/settings": this.setActive(3);
      break;
      default: break;
    }
  }

  showPopUp(){
    this.stateService.setPopupState(true);
  }
}
