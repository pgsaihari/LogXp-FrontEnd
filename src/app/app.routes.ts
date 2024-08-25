import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { SearchTraineePageComponent } from './page/search-trainee-page/search-trainee-page.component';
import { AddTraineesPageComponent } from './page/add-trainees-page/add-trainees-page.component';
import { EditCallenderPageComponent } from './page/edit-callender-page/edit-callender-page.component';
import { UserProfilePageComponent } from './page/user-profile-page/user-profile-page.component';
import { TestPageComponent } from './page/test-page/test-page.component';
import { LoginComponent } from './page/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './page/unauthorized/unauthorized.component';
import { NotFoundComponent } from './page/not-found/not-found.component';

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
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'search',
        component: SearchTraineePageComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },

      {
        path: 'add-trainee',
        component: AddTraineesPageComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'edit-callender',
        component: EditCallenderPageComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'user-profile:id',
        component: UserProfilePageComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      { path: 'test', component: TestPageComponent },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent, // Display if user is unauthorized
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
