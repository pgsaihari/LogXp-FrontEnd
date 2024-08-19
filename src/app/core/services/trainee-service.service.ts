import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  //   return this.http.get<any[]>(this.apiUrl);
  // }

  getTraineesCount():Observable<number>{
    return this.http.get<number>(this.apiUrl + '/active-count');
  }

  // Function to get a trainee by ID
  getTraineeById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  // Function to add a new trainee
  addTrainee(trainee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, trainee);
  }

  // Function to update an existing trainee
  // updateTrainee(id: number, trainee: any): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.put<any>(url, trainee);
  // }
  updateTrainee(employeeCode: string, trainee: any): Observable<any> {
    const url = `${this.apiUrl}/${employeeCode}`;
    return this.http.put<any>(url, trainee);
}


  // Function to delete a trainee
  deleteTrainee(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
  
}
