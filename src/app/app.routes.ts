import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './page/unauthorized/unauthorized.component';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { LoginComponent } from './page/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./page/home/home.component').then((m) => m.HomeComponent),
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./page/search-trainee-page/search-trainee-page.component').then(
            (m) => m.SearchTraineePageComponent
          ),
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'add-trainee',
        loadComponent: () =>
          import('./page/add-trainees-page/add-trainees-page.component').then(
            (m) => m.AddTraineesPageComponent
          ),
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'edit-callender',
        loadComponent: () =>
          import('./page/edit-callender-page/edit-callender-page.component').then(
            (m) => m.EditCallenderPageComponent
          ),
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'user-profile/:id',
        loadComponent: () =>
          import('./page/user-profile-page/user-profile-page.component').then(
            (m) => m.UserProfilePageComponent
          ),
        canActivate: [RoleGuard],
        data: { expectedRole: 'trainee' },
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent, // Display if user is unauthorized
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
