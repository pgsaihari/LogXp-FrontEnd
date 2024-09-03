import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Currentuser } from '../interfaces/currentuser';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    // Backend API base URL
    private apiUrl = environment.apiUrl+`/Auth`;

  private currentUser: Currentuser ={
    userId:"string",
    name:"string",
    email:"string",
    role:"string"
  }
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

  // Fetches the user role from the backend
  getUserRole(token: string): Observable<any> {
    const url = `${this.apiUrl}/getUserRole/${token}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError) // Error handling
    );
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
