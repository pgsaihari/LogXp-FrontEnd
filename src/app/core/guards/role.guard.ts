import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Get the expected role from the route data
    const expectedRole = route.data['expectedRole'];

    // Try to retrieve the user role from memory first
    let userRole = this.authService.getCurrentUserRole();

    // If userRole is not set in memory, check localStorage as a fallback
    if (!userRole) {
      const userData = localStorage.getItem('currentUser'); // Use the same key you used for localStorage
      if (userData) {
        const parsedUser = JSON.parse(userData);
        userRole = parsedUser?.Role; // Get the role from localStorage data
      }
    }

    // console.log('User Role:', userRole);
    // console.log('Expected Role:', expectedRole);

    // Check if the user's role matches the expected role
    if (userRole === expectedRole) {
      return true; // Allow access if roles match
    } else {
      // Redirect to an unauthorized page if roles don't match
      this.router.navigate(['/unauthorized']);
      return false; // Block access
    }
  }
}
