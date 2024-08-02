import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { SearchTraineePageComponent } from './page/search-trainee-page/search-trainee-page.component';
import { AddTraineesPageComponent } from './page/add-trainees-page/add-trainees-page.component';
import { EditCallenderPageComponent } from './page/edit-callender-page/edit-callender-page.component';
import { UserProfilePageComponent } from './page/user-profile-page/user-profile-page.component';
import { TestPageComponent } from './page/test-page/test-page.component';
import { LoginComponent } from './page/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path:'',
    component: LayoutComponent,
    children: [
        {path:"home",component:HomeComponent,canActivate:[authGuard]},
      { path: 'search', component: SearchTraineePageComponent,canActivate:[authGuard] },

      { path: 'add-trainee', component: AddTraineesPageComponent, canActivate:[authGuard] },
      { path: 'edit-callender', component: EditCallenderPageComponent, canActivate:[authGuard] },
      { path: 'user-profile:id', component: UserProfilePageComponent, canActivate:[authGuard] },
      { path: 'test', component: TestPageComponent, canActivate:[authGuard] },
    ],
  },
];
