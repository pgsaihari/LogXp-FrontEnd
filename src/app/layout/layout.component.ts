import { Component, Renderer2, OnInit, Inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { TopHeaderComponent } from "../ui/top-header/top-header.component";
import { LoginComponent } from "../page/login/login.component";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Subject, filter, takeUntil } from 'rxjs';
import { AccountInfo, EventMessage, InteractionStatus } from '@azure/msal-browser';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TopHeaderComponent, LoginComponent, ToastModule,NgIf],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [MessageService]
})
export class LayoutComponent implements OnInit {
  /**
   * @role The role of the user, used for role-based UI customization.
   * Default value is 'trainee'.
   */
  role: string = 'admin';

  /**
   * @private _destroying$ Subject used to trigger unsubscription from observables
   * to avoid memory leaks when the component is destroyed.
   */
  private readonly _destroying$ = new Subject<void>();

  /**
   * @isLogged Indicates whether the user is logged in or not.
   */
  isLogged: boolean = false;

  constructor(
    private router: Router, // Used for navigation within the application.
    private renderer: Renderer2, // Used for DOM manipulations, such as setting styles dynamically.
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, // Configuration for MSAL Guard.
    private authService: MsalService, // MSAL Service to handle authentication.
    private msalBroadcastService: MsalBroadcastService // Service to broadcast MSAL events, such as login status changes.
  ) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties.
   * It is used here to initialize the component, check the user's login status, and set up MSAL event listeners.
   */
  ngOnInit(): void {
    // Handle potential redirects after login/authentication processes.
    this.authService.handleRedirectObservable().subscribe();

    // Enable account storage events to listen for account changes in the MSAL library.
    this.authService.instance.enableAccountStorageEvents();

    // Subscribe to MSAL events and navigate to the home page if no accounts are logged in.
    this.msalBroadcastService.msalSubject$
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          this.router.navigate(['/home']);
        }
      });

    // Monitor the interaction status (e.g., login, logout) and check/set the active account when no interaction is in progress.
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$) // Automatically unsubscribe when the component is destroyed.
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount(); // Ensure the active account is set correctly.
      });

    // Check if the user is logged in and update the isLogged property.
    this.isLogged = this.isLoggedIn();
  }

  /**
   * Checks if there is an active account set in MSAL. If not, it sets the first available account as the active account.
   * This is useful for applications where there might be multiple accounts, but you want to default to the first one.
   */
  checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount && // If there is no active account
      this.authService.instance.getAllAccounts().length > 0 // But there are accounts logged in
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]); // Set the first account as the active account.
    }
  }

  /**
   * Checks if the user is logged in by inspecting the local storage for MSAL account keys.
   * @returns {boolean} True if the user is logged in, otherwise false.
   */
  isLoggedIn(): boolean {
    const localData = localStorage.getItem("msal.account.keys");
    console.log(localData); // Debugging log to check the local storage value.

    return localData !== null; // If localData exists, the user is considered logged in.
  }

  /**
   * Sets the background color of the body based on the user's role.
   * This method is currently commented out but can be activated if role-based styling is needed.
   */
  // setBodyBackgroundColor(): void {
  //   this.renderer.setStyle(document.body, 'background-color', this.getBackgroundColor());
  // }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * It triggers the completion of the _destroying$ subject, which unsubscribes from all observables.
   */
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}