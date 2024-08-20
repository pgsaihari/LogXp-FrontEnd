import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TraineeAttendanceLogs } from '../model/traineeAttendanceLogs.model';

@Injectable({
  providedIn: 'root'
})
export class TraineeAttendancelogService {

  private apiUrl = 'https://localhost:7074/api/LogXP/traineeAttendanceLogs';

  constructor(private http: HttpClient) { }

  getTraineeAttendanceLogs(): Observable<TraineeAttendanceLogs[]>{
    return this.http.get<TraineeAttendanceLogs[]>(this.apiUrl)
  }
}
