import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //move to .env
  private apiUrl = environment.apiUrl+`/user`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  // Function to get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }

  // Function to get a user by userId
  getUserById(userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<User>(url).pipe(
      catchError((error: any) => {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }

  // Function to add a new user
  addUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addUsers`, [user]) // Wrap user in an array
      .pipe(
        catchError((error: any) => {
          console.error('Error adding user:', error);
          return throwError(() => new Error(error.message || 'Server error'));
        })
      );
}


  // Function to add multiple users
  addUsers(users: User[]): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<void>(`${this.apiUrl}/addUsers`, users, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error adding users:', error);
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }

  // Function to update an existing user
  updateUser(userId: string, user: User): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put<User>(url, user).pipe(
      catchError((error: any) => {
        console.error('Error updating user:', error);
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }

  // Function to delete a user
  deleteUser(userId: string): Observable<void> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: any) => {
        console.error(`Error deleting user with ID ${userId}:`, error);
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }
}
