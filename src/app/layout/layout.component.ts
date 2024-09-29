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
  role: string = ''; // Will be set based on the user's role
  private readonly _destroying$ = new Subject<void>();
  isLogged: boolean = false; // Initially set to false
  showPopup = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public authService: AuthService // Injecting AuthService
  ) {}

  ngOnInit(): void {
    try {
      // Check if user is logged in using AuthService
      const currentUser = this.authService.getCurrentUser();
      console.log(currentUser);
      if (currentUser) {
        this.isLogged = true;
        this.role = currentUser.role;

        // Redirect based on role
        if (this.role === 'trainee') {
          this.router.navigate([`/user-profile/${currentUser.userId}`]);
        } else if (this.role === 'admin') {
          this.router.navigate(['/home']);
        }
      } else {
        this.isLogged = false;
        this.router.navigate(['/login']); // Redirect to login if not logged in
      }
    } catch (error) {
      console.error('Error during initialization in ngOnInit:', error);
      this.router.navigate(['/login']); // Redirect to login in case of an error
    }
  }

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
