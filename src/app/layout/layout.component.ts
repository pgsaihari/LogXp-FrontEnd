import { Component, Renderer2, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { TopHeaderComponent } from "../ui/top-header/top-header.component";
import { LoginComponent } from "../page/login/login.component";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Subject, catchError, filter, of, takeUntil } from 'rxjs';
import { AccountInfo,  InteractionStatus } from '@azure/msal-browser';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TopHeaderComponent, LoginComponent, ToastModule,NgIf],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [MessageService]
})
export class LayoutComponent implements OnInit, OnDestroy {
 
  /**
   * The role of the user, used for role-based UI customization.
   * TODO: Right now hardcoded, implement roles based on role guards in the future.
   */
  role: string = 'admin';

  /**
   * Subject used to trigger unsubscription from observables to avoid memory leaks when the component is destroyed.
   */
  private readonly _destroying$ = new Subject<void>();

  /**
   * Indicates whether the user is logged in or not.
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
    try {
      // Handle potential redirects after login/authentication processes.
      this.authService.handleRedirectObservable()
        .pipe(
          catchError((error) => {
            console.error("Error during handleRedirectObservable:", error);
            return of(null); // Gracefully handle errors during redirect
          })
        )
        .subscribe();

      // Enable account storage events to listen for account changes in the MSAL library.
      this.authService.instance.enableAccountStorageEvents();

      // Subscribe to MSAL events and navigate to the home page if no accounts are logged in.
      this.msalBroadcastService.msalSubject$
        .pipe(
          catchError((error) => {
            console.error("Error subscribing to MSAL subject:", error);
            return of(null); // Handle errors in the broadcast
          })
        )
        .subscribe(() => {
          if (this.authService.instance.getAllAccounts().length === 0) {
            console.log("No active accounts found. Redirecting to /home.");
            this.router.navigate(['/home']);
          }
        });

      // Monitor the interaction status (e.g., login, logout) and check/set the active account when no interaction is in progress.
      this.msalBroadcastService.inProgress$
        .pipe(
          filter(
            (status: InteractionStatus) => status === InteractionStatus.None
          ),
          takeUntil(this._destroying$),
          catchError((error) => {
            console.error("Error checking interaction status:", error);
            return of(null); // Handle errors during the interaction status check
          })
        )
        .subscribe(() => {
          this.checkAndSetActiveAccount(); // Ensure the active account is set correctly.
        });

      // Check if the user is logged in and update the isLogged property.
      this.isLogged = this.isLoggedIn();

    } catch (error) {
      console.error("Error during initialization in ngOnInit:", error);
    }
  }

  /**
   * Checks if there is an active account set in MSAL. If not, it sets the first available account as the active account.
   * This is useful for applications where there might be multiple accounts, but you want to default to the first one.
   */
  checkAndSetActiveAccount(): void {
    try {
      const activeAccount: AccountInfo | null = this.authService.instance.getActiveAccount();

      if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
        const accounts = this.authService.instance.getAllAccounts();
        this.authService.instance.setActiveAccount(accounts[0]); // Set the first account as the active account.
        console.log("Active account set to:", accounts[0]);
      } else if (!activeAccount) {
        console.log("No accounts found. No active account set.");
      }

    } catch (error) {
      console.error("Error during checkAndSetActiveAccount:", error);
    }
  }

  /**
   * Checks if the user is logged in by inspecting the local storage for MSAL account keys.
   * @returns {boolean} True if the user is logged in, otherwise false.
   */
  isLoggedIn(): boolean {
    try {
      const localData = localStorage.getItem("msal.account.keys");
      console.log("MSAL account keys in local storage:", localData);

      return localData !== null; // If localData exists, the user is considered logged in.
    } catch (error) {
      console.error("Error checking logged-in status:", error);
      return false; // Return false in case of an error
    }
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * It triggers the completion of the _destroying$ subject, which unsubscribes from all observables.
   */
  ngOnDestroy(): void {
    try {
      this._destroying$.next(undefined);
      this._destroying$.complete();
      console.log("Component destroyed and observables unsubscribed.");
    } catch (error) {
      console.error("Error during ngOnDestroy:", error);
    }
  }
}