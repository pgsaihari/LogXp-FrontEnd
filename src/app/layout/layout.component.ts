import { Component, Renderer2, OnInit, Inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { TopHeaderComponent } from "../ui/top-header/top-header.component";
import { LoginComponent } from "../page/login/login.component";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Subject, filter, takeUntil } from 'rxjs';
import { EventMessage, InteractionStatus } from '@azure/msal-browser';
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
  role: string = 'trainee';
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.setBodyBackgroundColor();
    this.authService.handleRedirectObservable().subscribe();

    // Enable MSAL account storage events
    this.authService.instance.enableAccountStorageEvents();

    // Redirect if there are no logged-in accounts
    this.msalBroadcastService.msalSubject$
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          this.router.navigate(['/home']);
        }
      });

    // Monitor interaction status
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        // Additional logic if needed
      });
  }

  // Function to check if the user is logged in
  isLoggedIn(): boolean {
    const localData = localStorage.getItem("msal.account.keys");
    console.log(localData)
    return localData !== null;
  }

  // Get the background color based on the user role
  getBackgroundColor(): string {
    switch (this.role) {
      case 'admin':
        return '#F1F2F6';
      case 'trainer':
        return '#F1F2F6';
      case 'trainee':
        return '#FCF6F5';
      default:
        return 'white';
    }
  }

  // Set the body background color
  setBodyBackgroundColor(): void {
    this.renderer.setStyle(document.body, 'background-color', this.getBackgroundColor());
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
