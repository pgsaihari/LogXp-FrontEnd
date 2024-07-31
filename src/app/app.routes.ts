import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { SearchTraineePageComponent } from './page/search-trainee-page/search-trainee-page.component';
import { AddTraineesPageComponent } from './page/add-trainees-page/add-trainees-page.component';
import { EditCallenderPageComponent } from './page/edit-callender-page/edit-callender-page.component';
import { UserProfilePageComponent } from './page/user-profile-page/user-profile-page.component';
import { TestPageComponent } from './page/test-page/test-page.component';

export const routes: Routes = [
{path:'',component:HomeComponent},

{path:'search',component:SearchTraineePageComponent},

{path:'add-trainee',component:AddTraineesPageComponent},

{path:'edit-callender',component:EditCallenderPageComponent},

{path:'user-profile:id',component:UserProfilePageComponent},
{path:'test',component:TestPageComponent}



];
