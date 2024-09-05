import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LateArrival {
  employeeName: string;
  logDateTime: Date;
  place: string;
  batchName: string; // Assuming BatchName corresponds to BatchId
}

export interface AttendanceLog {
  employeeName: string;
  direction: string;
  place: string;
  logDateTime: Date;
  batchName: string; // Assuming BatchName corresponds to BatchId
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceLogService {
  private baseUrl = environment.apiUrl + `/RealTimeAttendanceLogs`; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  getLateArrivals(): Observable<LateArrival[]> {
    return this.http.get<LateArrival[]>(`${this.baseUrl}/late-arrivals`);
  }

  getTodayLogs(): Observable<AttendanceLog[]> {
    return this.http.get<AttendanceLog[]>(`${this.baseUrl}/logs`);
  }
}
