import { HttpClient, HttpParams, } from '@angular/common/http';
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
  getLogsByEmployeeCode(employeeCode: string): Observable<{ logs: TraineeAttendanceLogs[], count: number, message: string }> {
    const url = `${this.apiUrl}/logsByEmployee/${employeeCode}`;
    return this.http.get<{ logs: TraineeAttendanceLogs[], count: number, message: string }>(url);
  }

  getFilteredTraineeAttendanceLogs(status: string, date: string, batches: string[]): Observable<{ logs: TraineeAttendanceLogs[], count: number, message: string }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (date) params = params.set('date', date);
    if (batches.length > 0) params = params.set('batch', batches.join(','));

    const url = `${this.apiUrl}/filterLogs`;
    return this.http.get<{ logs: TraineeAttendanceLogs[], count: number, message: string }>(url, { params });
  }
}
