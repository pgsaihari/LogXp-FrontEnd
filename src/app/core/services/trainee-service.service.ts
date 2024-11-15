import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Trainee } from '../model/trainee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraineeServiceService {

  private apiUrl = environment.apiUrl+`/trainee`; // Replace with your actual API endpoint
  constructor(private http: HttpClient) { }

  // Function to get all trainees
  getTrainees(): Observable<Trainee[]> {
    
    return this.http.get<{ trainees: Trainee[] }>(this.apiUrl).pipe(
      map(response => response.trainees) )
    }

  // Function to get count of active trainees
  getTraineesCount(batchId: number): Observable<number> {
    const url = `${this.apiUrl}/active-count?batchId=${batchId}`;
    return this.http.get<number>(url);
  }

  // Function to get a trainee by employeeCode
  getTraineeByEmployeeCode(employeeCode: string): Observable<any> {
    const url = `${this.apiUrl}/${employeeCode}`;
    return this.http.get<Trainee>(url);
  }

  // Function to add a new trainee
  addTrainee(trainee: any): Observable<any> {
    return this.http.post<Trainee>(`${this.apiUrl}/add-trainee`, trainee);
  }

  // Function to add multiple trainees
   addTrainees(trainees: Trainee[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, trainees, { headers });
  }
  // Function to update an existing trainee
  updateTrainee(employeeCode: string, trainee: Trainee): Observable<Trainee> {
    const url = `${this.apiUrl}/${employeeCode}`;
    return this.http.put<Trainee>(url, trainee).pipe(
        catchError((error: any) => {
            console.error('Error updating trainee:', error);
            return throwError(() => new Error(error.message || 'Server error'));
        })
    );
}


  // Function to update trainee status
  updateTraineeStatus(employeeCode: string, isActive: boolean): Observable<Trainee> {
    const url = `${this.apiUrl}/${employeeCode}/status`;
    return this.http.patch<Trainee>(url, { isActive });
  }

  // Function to delete a trainee
  deleteTrainee(employeeCode: string): Observable<Trainee> {
    const url = `${this.apiUrl}/${employeeCode}`;
    return this.http.delete<Trainee>(url);
  }
}