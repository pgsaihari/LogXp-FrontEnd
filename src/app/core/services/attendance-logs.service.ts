import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { WidgetAttendance } from '../interfaces/widget-attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceLogsService {


  private apiUrl = "https://localhost:7074/api/LogXP/traineeAttendanceLogs"

  // private absentApi = "https://localhost:7074/api/LogXP/WidgetAttendance/absentees"
  // private lateArrivalApi = "https://localhost:7074/api/LogXP/WidgetAttendance/lateArrivals"
  // private earlyDepartureApi = "https://localhost:7074/api/LogXP/WidgetAttendance/earlyDepartures"

  constructor(private http: HttpClient) { }

  onTimeLogs(): Observable<WidgetAttendance[]>{
    return this.http.get<any>(`${this.apiUrl}/earlyArrivals`)
  }

  lateArrivalLogs(): Observable<WidgetAttendance[]>{
    return this.http.get<any>(`${this.apiUrl}/lateArrivals`)
  }

  earlyDeparturesLogs(): Observable<WidgetAttendance[]>{
    return this.http.get<any>(`${this.apiUrl}/earlyDepartures`)
  }

  absenteeLogs(): Observable<WidgetAttendance[]>{
    return this.http.get<any>(`${this.apiUrl}/absentees`)
  }


  // private absentApi = "https://localhost:7074/api/LogXP/traineeAttendanceLogs/absentees"
  // private lateArrivalApi = "https://localhost:7074/api/LogXP/traineeAttendanceLogs/lateArrivals"
  // private earlyDepartureApi = "https://localhost:7074/api/LogXP/traineeAttendanceLogs/earlyDepartures"

 
  getEarlyArrivalsCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/earlyArrivals`).pipe(
      map(response => response.count)
    );
  }

  getAbsenteesCount(): Observable<Number> {
    return this.http.get<any>(`${this.apiUrl}/absentees`).pipe(
      map(response => response.count)
    );
  }

  lateArrivalsCount(): Observable<Number> {
    return this.http.get<any>(`${this.apiUrl}/lateArrivals`).pipe(
      map(response => response.count)
    );
  }

  earlyDeparturesCount() : Observable<Number> {
    return this.http.get<any>(`${this.apiUrl}/earlyDepartures`).pipe(
      map(response => response.count)
    );
  }
}  