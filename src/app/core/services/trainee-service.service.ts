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

  // Function to get a trainee by ID
  getTraineeById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  // Function to add a new trainee
  addTrainees(trainee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, trainee);
  }

  addTrainee(trainee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/add-trainee", trainee);
  }

  // Function to update an existing trainee
  updateTrainee(id: number, trainee: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, trainee);
  }

  // Function to delete a trainee
  deleteTrainee(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
