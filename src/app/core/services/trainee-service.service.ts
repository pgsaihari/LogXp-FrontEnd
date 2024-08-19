import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraineeServiceService {

  private apiUrl = 'https://localhost:7074/api/LogXP/trainee';  // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Function to get all trainees
  getTrainees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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
    return this.http.put<any>(url, trainee);
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
