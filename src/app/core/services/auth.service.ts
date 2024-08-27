import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Currentuser } from '../interfaces/currentuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: Currentuser ={
    UserId:"string",
    UserName:"string",
    Email:"string",
    Role:"string"
  }
  private readonly USER_KEY = 'currentUser'; // Key for localStorage

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
    return this.currentUser?.Role || null;
  }

  // Setter for current user and stores in localStorage
  setCurrentUser(user: any): void {
    this.currentUser = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user)); // Save to localStorage
  }

  // Backend API base URL
  private apiUrl = 'https://localhost:7074/api/logXp/Auth'; // Replace with your actual backend URL

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
