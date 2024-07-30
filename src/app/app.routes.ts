import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:"homepage", loadComponent:()=>import('./pages/admin/homepage/homepage.component').then((m)=> m.HomepageComponent)},
];
