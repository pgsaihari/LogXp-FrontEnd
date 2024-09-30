import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Currentuser } from '../interfaces/currentuser';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Backend API base URL
  private apiUrl = environment.apiUrl;

  // The current logged-in user details
  private currentUser: Currentuser = {
    userId: "",
    name: "",
    email: "",
    role: ""
  };
  
  private readonly USER_KEY = 'currentUser'; // Key for storing user data in localStorage
  private readonly TOKEN_KEY = 'jwtToken'; // Key for storing JWT token in localStorage
  
  constructor(private http: HttpClient) {
    // Load the stored user data from localStorage if available
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // Getter for current user details
  getCurrentUser(): Currentuser | null {
    return this.currentUser;
  }

  // Getter for current user's role
  getCurrentUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  // Setter for current user and stores in localStorage
  setCurrentUser(user: any): void {
    this.currentUser = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user)); // Save user data to localStorage
  }

  // Store JWT token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // User login method
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/User/login`;
    return this.http.post<any>(url, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          // Save the token and user data upon successful login
          this.setToken(response.token);
          this.setCurrentUser({
            userId: response.userId,
            name: response.name,
            email: response.email,
            role: response.role
          });
        }
      }),
      catchError(this.handleError) // Handle errors
    );
  }
 
  // Method to handle password change using POST request with query parameters
  changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const userId = this.getCurrentUser()?.userId;
    if (!userId) return throwError(() => new Error('User not found'));

    // Construct the URL with query parameters
    const url = `${this.apiUrl}/User/change-password?userId=${userId}&currentPassword=${currentPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`;
    
    // Use POST request with an empty body as the parameters are in the URL
    return this.http.post(url, {}).pipe(catchError(this.handleError));
  }

  // Send OTP for forgot password
  sendOtp(email: string): Observable<any> {
    const url = `${this.apiUrl}/User/forgot-password?email=${encodeURIComponent(email)}`;
    return this.http.post(url, { email }).pipe(catchError(this.handleError));
  }

  // Reset password using OTP
  resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string): Observable<any> {
    // Construct the URL with query parameters
    const url = `${this.apiUrl}/User/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`;

    // Send the POST request with an empty body as the parameters are now included in the URL
    return this.http.post(url, {}).pipe(catchError(this.handleError));
}


  // Method to fetch the user role from local storage or backend using JWT claims
  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  // Logout function to clear stored data
  logout(): void {
    this.currentUser = {
      userId: "",
      name: "",
      email: "",
      role: ""
    };
    // Clear user data and token from localStorage
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Error handler for HTTP requests
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = error.error?.message || errorMessage;
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error(errorMessage));
  }
}
