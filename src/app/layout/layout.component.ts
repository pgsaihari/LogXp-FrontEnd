import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { TopHeaderComponent } from '../shared/top-header/top-header.component';
import { LoginComponent } from '../page/login/login.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
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
    RealTimePopUpComponent,
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
  isLogged: boolean = true;
  showPopup = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public authService: AuthService // Injecting AuthService
  ) {}

  ngOnInit(): void {
    // try {
    //   // Custom logic to check if user is logged in and handle user roles
    //   const token = localStorage.getItem('authToken');
    //   if (token) {
    //     this.isLogged = true;
    //     this.authService.getUserRole(token).subscribe({
    //       next: (userRoleData) => {
    //         console.log('User Role Data:', userRoleData);
    //         this.authService.setCurrentUser(userRoleData);

    //         const user = this.authService.getCurrentUser();
    //         if (user?.role === 'trainee') {
    //           this.router.navigate([`/user-profile/${user.userId}`]);
    //         } else if (user?.role === 'admin') {
    //           this.router.navigate(['/home']);
    //         }
    //       },
    //       error: (error) => {
    //         console.error('Error fetching user role:', error);
    //       },
    //     });
    //   }
    // } catch (error) {
    //   console.error('Error during initialization in ngOnInit:', error);
    // }
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
