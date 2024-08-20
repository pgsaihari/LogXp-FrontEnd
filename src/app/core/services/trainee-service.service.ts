import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraineeServiceService {

  private apiUrl = 'https://localhost:7074/api/LogXP/trainee';  // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Function to get all trainees
  getTrainees(): Observable<any[]> {
    
    return this.http.get<{ trainees: any[] }>(this.apiUrl).pipe(
      map(response => response.trainees) )
    }

  // Function to get count of active trainees
  getTraineesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/active-count`);
  }

  // Function to get a trainee by employeeCode
  getTraineeByEmployeeCode(employeeCode: string): Observable<any> {
    const url = `${this.apiUrl}/${employeeCode}`;
    return this.http.get<any>(url);
  }

  // Function to add a new trainee
  addTrainee(trainee: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-trainee`, trainee);
  }

  // Function to add multiple trainees
  addTrainees(trainees: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, trainees);
  }

  // Function to update an existing trainee
  updateTrainee(employeeCode: string, trainee: any): Observable<any> {
    const url = `${this.apiUrl}/${employeeCode}`;
    return this.http.put<any>(url, trainee).pipe(
        catchError((error: any) => {
            console.error('Error updating trainee:', error);
            return throwError(() => new Error(error.message || 'Server error'));
        })
    );
}


  // Function to update trainee status
  updateTraineeStatus(employeeCode: string, isActive: boolean): Observable<any> {
    const url = `${this.apiUrl}/${employeeCode}/status`;
    return this.http.patch<any>(url, { isActive });
  }

  // Function to delete a trainee
  deleteTrainee(employeeCode: string): Observable<any> {
    const url = `${this.apiUrl}/${employeeCode}`;
    return this.http.delete<any>(url);
  }
}
