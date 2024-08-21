import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TraineeAttendanceLogs } from '../model/traineeAttendanceLogs.model';
import { DailyAttendanceOfMonth } from '../interfaces/daily-attendance-of-month';

@Injectable({
  providedIn: 'root'
})
export class TraineeAttendancelogService {

  private apiUrl = 'https://localhost:7074/api/LogXP/traineeAttendanceLogs';

  constructor(private http: HttpClient) { }

  getTraineeAttendanceLogs(): Observable<TraineeAttendanceLogs[]>{
    return this.http.get<TraineeAttendanceLogs[]>(this.apiUrl)
  }

  getAttendanceOfAMonth( month:number, year:number ):Observable<DailyAttendanceOfMonth[]>{
    return this.http.get<DailyAttendanceOfMonth[]>(this.apiUrl+`/GetAttendanceOfAMonth?month=${month}&year=${year}`);
  }
}
