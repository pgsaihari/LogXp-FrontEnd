import { Component, Renderer2, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { TopHeaderComponent } from '../shared/top-header/top-header.component';
import { LoginComponent } from '../page/login/login.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { Subject, catchError, filter, of, takeUntil } from 'rxjs';
import {
  AccountInfo,
  AuthenticationResult,
  InteractionStatus,
} from '@azure/msal-browser';
import { NgIf } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { RealTimePopUpComponent } from "../ui/real-time-pop-up/real-time-pop-up.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    TopHeaderComponent,
    LoginComponent,
    ToastModule,
    NgIf,
    RealTimePopUpComponent
],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [MessageService],
})
export class LayoutComponent implements OnInit, OnDestroy {
  /**
   * Stores the role of the user, currently hardcoded as 'admin'.
   * Future implementation can dynamically set this value based on user information.
   */
  // Hardcoded role for now

  /**
   * Subject used for unsubscribing from observables when the component is destroyed
   * to avoid memory leaks.
   */
  private readonly _destroying$ = new Subject<void>();

  /**
   * Boolean indicating whether the user is logged in.
   * Initially set to false.
   */
  isLogged: boolean = false;
  showPopup = false;
  role:string | null="";
  /**
   * Constructor for LayoutComponent. It initializes services for MSAL and routing,
   * and handles the redirect observable to capture tokens after login.
   *
   * @param router - Router service used for navigation within the application.
   * @param renderer - Renderer2 service used for DOM manipulations.
   * @param msalGuardConfig - Configuration for MSAL Guard.
   * @param msalService - MSAL Service to handle authentication-related operations.
   * @param msalBroadcastService - Service to broadcast MSAL events, such as login status changes.
   */
  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    public authService: AuthService // Injecting AuthService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a component are initialized.
   * Handles initialization logic such as checking login status and setting the active account.
   */
  ngOnInit(): void {
    this.role=this.authService.getCurrentUserRole();
    try {
      // Handle redirect observable and potential token
      this.msalService
        .handleRedirectObservable()
        .pipe(
          catchError((error) => {
            console.error('Error during handleRedirectObservable:', error);
            return of(null);
          })
        )
        .subscribe();

      // /**
      //  * Handle the redirect response to check for access tokens after login.
      //  * If a valid access token is received, it is stored in local storage and used to call the backend service.
      //  */
      // this.msalService.handleRedirectObservable().subscribe({
      //   next: (response: AuthenticationResult) => {
      //     if (response && response.accessToken) {
      //       console.log('Login successful, Access Token:', response.accessToken);
      
      //       // Store the access token in local storage
      //       localStorage.setItem('msalKey', response.accessToken);
      
      //       // Call the AuthService to perform further actions (e.g., calling backend)
      //       this.authService.getUserRole(response.accessToken).subscribe({
      //         next: (userRoleData) => {
      //           console.log('User Role Data:', userRoleData); // Ensure this contains role info
      //           this.authService.setCurrentUser(userRoleData); // Set the current user
                
      //           const user = this.authService.getCurrentUser();
      //           if (user?.Role === 'trainee') {
      //             this.router.navigate([`/user-profile/${user.UserId}`]);
      //           } else if (user?.Role === 'admin') {
      //             this.router.navigate(['/home']);
      //           }
      //         },
      //         error: (error) => {
      //           console.error('Error fetching user role:', error);
      //         }
      //       });
      //     } else {
      //       console.log('No access token found in the response');
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Error during token processing:', error);
      //   }
      // });

      // Enable account storage events to listen for account changes
      this.msalService.instance.enableAccountStorageEvents();

      // Subscribe to MSAL events to handle login status changes
      this.msalBroadcastService.msalSubject$
        .pipe(
          catchError((error) => {
            console.error('Error subscribing to MSAL subject:', error);
            return of(null);
          })
        )
        .subscribe(() => {
          // If no active account is found, redirect to the home page.
          if (this.msalService.instance.getAllAccounts().length === 0) {
            console.log('No active accounts found. Redirecting to /home.');
            this.router.navigate(['/home']);
          }
        });

      // Monitor interaction status and set the active account if no interaction is in progress.
      this.msalBroadcastService.inProgress$
        .pipe(
          filter(
            (status: InteractionStatus) => status === InteractionStatus.None
          ),
          takeUntil(this._destroying$),
          catchError((error) => {
            console.error('Error checking interaction status:', error);
            return of(null);
          })
        )
        .subscribe(() => {
          this.checkAndSetActiveAccount();
        });

      // Check if the user is logged in
      this.isLogged = this.isLoggedIn();
    } catch (error) {
      console.error('Error during initialization in ngOnInit:', error);
    }
  }

  /**
   * Method to check if there is an active account in MSAL, and if not, sets one.
   * If no accounts are available, logs an appropriate message.
   */
  checkAndSetActiveAccount(): void {
    try {
      const activeAccount: AccountInfo | null =
        this.msalService.instance.getActiveAccount();

      if (
        !activeAccount &&
        this.msalService.instance.getAllAccounts().length > 0
      ) {
        const accounts = this.msalService.instance.getAllAccounts();
        this.msalService.instance.setActiveAccount(accounts[0]);
        console.log('Active account set to:', accounts[0]);
      } else if (!activeAccount) {
        console.log('No accounts found. No active account set.');
      }
    } catch (error) {
      console.error('Error during checkAndSetActiveAccount:', error);
    }
  }

  /**
   * Method to check if a user is logged in by looking for MSAL account keys in local storage.
   * @returns boolean - true if user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    try {
      const localData = localStorage.getItem('msal.account.keys');
      console.log('MSAL account keys in local storage:', localData);
      return localData !== null;
    } catch (error) {
      console.error('Error checking logged-in status:', error);
      return false;
    }
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   * Unsubscribes from observables and completes the Subject to prevent memory leaks.
   */
  ngOnDestroy(): void {
    try {
      this._destroying$.next(undefined);
      this._destroying$.complete();
      console.log('Component destroyed and observables unsubscribed.');
    } catch (error) {
      console.error('Error during ngOnDestroy:', error);
    }
  }
}
