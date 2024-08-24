import { Component, Renderer2, OnInit, Inject } from '@angular/core';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { TopHeaderComponent } from "../ui/top-header/top-header.component";
import { LoginComponent } from "../page/login/login.component";
import {ToastModule} from 'primeng/toast'
import {MessageService} from 'primeng/api'
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Subject, filter, takeUntil } from 'rxjs';
import { EventMessage, InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TopHeaderComponent, LoginComponent,ToastModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [MessageService]
})
export class LayoutComponent implements OnInit {
isLoggedIn():Boolean  {
  const localData = localStorage.getItem("msal.account.keys");
  if(localData!=null){
    return true;
  }
  else{
   
    return false;
  }
}
  title = 'FrontEnd';
  role: string = 'trainee';
  private readonly _destroying$ = new Subject<void>();
  constructor(private router:Router,private renderer: Renderer2,  @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
  private authService: MsalService,
  private msalBroadcastService: MsalBroadcastService) {}

  ngOnInit(): void {
    this.setBodyBackgroundColor();
    this.authService.handleRedirectObservable().subscribe();
    // this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

   

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
      
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/home';
        } else {
            console.log("loggedin")
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        
        // this.checkAndSetActiveAccount();
      });
  }

  // checkAndSetActiveAccount() {
  //   /**
  //    * If no active account set but there are accounts signed in, sets first account to active account
  //    * To use active account set here, subscribe to inProgress$ first in your component
  //    * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
  //    */
  //   let activeAccount = this.authService.instance.getActiveAccount();

  //   if (
  //     !activeAccount &&
  //     this.authService.instance.getAllAccounts().length > 0
  //   ) {
  //     let accounts = this.authService.instance.getAllAccounts();
  //     this.authService.instance.setActiveAccount(accounts[0]);
  //   }
  // }

  getBackgroundColor(): string {
    switch (this.role) {
      case 'admin':
        return '#F1F2F6';
      case 'trainer':
        return '#F1F2F6'
      case 'trainee':
        return '#FCF6F5';
      default:
        return 'white';
    }
  }

  setBodyBackgroundColor(): void {
    this.renderer.setStyle(document.body, 'background-color', this.getBackgroundColor());
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
