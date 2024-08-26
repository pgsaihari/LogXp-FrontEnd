import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  // Hardcoded role for the user (this can be replaced with a real logic to get user role)
  userRole: string = 'admin'; // Change this as needed

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Get the expected role from the route data
    const expectedRole = route.data['expectedRole'];
    
    // Check if the user's role matches the expected role
    if (this.userRole === expectedRole) {
      return true; // Allow access if roles match
    } else {
      // Redirect to an unauthorized page if roles don't match
      this.router.navigate(['/unauthorized']);
      return false; // Block access
    }
  }
}
