import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {  AbsenteeLog, EarlyArrivalLogs, EarlyDepartureLog, LateArrivalsLog, WidgetAttendance, WidgetSummary } from '../interfaces/widget-attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceLogsService {
  private apiUrl = "https://localhost:7074/api/LogXP/traineeAttendanceLogs"
  constructor(private http: HttpClient) { }
  /**
   * FUNC : To make an API call to get the data of trainees with the status "Early Arrival" on a particular day, along with the count and a success message.
   * @param day
   * @param month 
   * @param year 
   * @returns Observable<EarlyArrivalLogs>
   */
  onTimeLogs(day:number, month:number, year:number): Observable<EarlyArrivalLogs>{
    const url = `${this.apiUrl}/earlyArrivalsByDate?day=${day}&month=${month}&year=${year}`;
    return this.http.get<EarlyArrivalLogs>(url)
  }
  /**
   * FUNC : To make an API call to get the data of trainees with the status "Late Arrival" on a particular day, along with the count and a success message.
   * @param day
   * @param month 
   * @param year 
   * @returns Observable<LateArrivalsLog>
   */
  lateArrivalLogs(day:number, month:number, year:number): Observable<LateArrivalsLog>{
    const url = `${this.apiUrl}/lateArrivalsByDate?day=${day}&month=${month}&year=${year}`;
    return this.http.get<LateArrivalsLog>(url)
  }
  /**
   * FUNC : To make an API call to get the data of trainees with the status "Early Departure" on a particular day, along with the count and a success message.
   * @param day
   * @param month 
   * @param year 
   * @returns Observable<EarlyDepartureLog>
   */
  earlyDeparturesLogs(day:number, month:number, year:number): Observable<EarlyDepartureLog>{
    const url = `${this.apiUrl}/earlyDeparturesByDate?day=${day}&month=${month}&year=${year}`;
    return this.http.get<EarlyDepartureLog>(url)
  }
  /**
   * FUNC : To make an API call to get the data of trainees with the status "On Leave"(Absent) on a particular day, along with the count and a success message.
   * @param day
   * @param month 
   * @param year 
   * @returns Observable<AbsenteeLog>
   */
  absenteeLogs(day:number, month:number, year:number): Observable<AbsenteeLog>{
    const url = `${this.apiUrl}/absenteesByDate?day=${day}&month=${month}&year=${year}`;
    return this.http.get<AbsenteeLog>(url)
  }
  /**
   * FUNC : To make an API call to get the Count of trainees in accordance with the trainee status on the latest date
   * @returns Observable<WidgetSummary>
   */
  getWidgetCount(): Observable<WidgetSummary> {
    const url = `${this.apiUrl}/latestAttendanceSummary`
    return this.http.get<WidgetSummary>(url)
  }
}  