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
  private apiUrl = environment.apiUrl ;

  private currentUser: Currentuser = {
    userId: "",
    name: "",
    email: "",
    role: ""
  };
  
  private readonly USER_KEY = 'currentUser'; // Key for localStorage
  private readonly TOKEN_KEY = 'jwtToken';
  
  constructor(private http: HttpClient) {
    // Check if user data exists in localStorage and set it
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // Getter for current user
  getCurrentUser(): Currentuser | null {
    return this.currentUser;
  }

  // Getter for current user role
  getCurrentUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  // Setter for current user and stores in localStorage
  setCurrentUser(user: any): void {
    this.currentUser = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user)); // Save to localStorage
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // User login
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/User/login`;
    return this.http.post<any>(url, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setCurrentUser({
            userId: response.userId,
            name: response.name,
            email: response.email,
            role: response.role
          });
        }
      }),
      catchError(this.handleError)
    );
  }

  // Fetches the user role from local storage (if needed from backend use JWT claims)
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
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Error handler for HTTP requests
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
