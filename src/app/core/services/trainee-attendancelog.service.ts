import { HttpClient, HttpParams, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {  TraineeAttendanceLogs } from '../model/traineeAttendanceLogs.model';
import { DailyAttendanceOfMonth } from '../interfaces/daily-attendance-of-month';
import { AbsenceAndLate, CurrentTraineeLog, PatchResponse } from '../interfaces/side-profile';
import { AbsenteeLog, EarlyArrivalLogs, EarlyDepartureLog, LateArrivalsLog, UserWidgetSummary, WidgetSummary } from '../interfaces/widget-attendance';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to manage Trainee Attendance Logs related API calls.
 */
export class TraineeAttendancelogService {

  private apiUrl = 'https://localhost:7074/api/LogXP/traineeAttendanceLogs';

  // BehaviorSubject to keep track of the selected date
  private selectedDateSubject = new BehaviorSubject<{ day: number, month: number, year: number }>({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  private selectedDateSource = new BehaviorSubject<Date | null>(null);
  selectedDate$ = this.selectedDateSource.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all trainee attendance logs.
   * @returns {Observable<TraineeAttendanceLogs[]>} - An observable containing a list of trainee attendance logs.
   */
  getTraineeAttendanceLogs(): Observable<TraineeAttendanceLogs[]> {
    return this.http.get<TraineeAttendanceLogs[]>(this.apiUrl);
  }

  /**
   * Retrieves the daily attendance logs for a specific month and year.
   * @param {number} month - The month for which attendance logs are being retrieved.
   * @param {number} year - The year for which attendance logs are being retrieved.
   * @returns {Observable<DailyAttendanceOfMonth[]>} - An observable containing the daily attendance logs for the specified month and year.
   */
  getAttendanceOfAMonth(month: number, year: number): Observable<DailyAttendanceOfMonth[]> {
    return this.http.get<DailyAttendanceOfMonth[]>(`${this.apiUrl}/GetAttendanceOfAMonth?month=${month}&year=${year}`);
  }

  /**
   * Retrieves logs for a specific employee based on their employee code.
   * @param {string} employeeCode - The employee code for which logs are being retrieved.
   * @returns {Observable<{ logs: TraineeAttendanceLogs[], count: number, message: string }>} 
   * - An observable containing the logs, the count of logs, and a message.
   */
  getLogsByEmployeeCode(employeeCode: string): Observable<{ logs: TraineeAttendanceLogs[], count: number, message: string }> {
    const url = `${this.apiUrl}/logsByEmployee/${employeeCode}`;
    return this.http.get<{ logs: TraineeAttendanceLogs[], count: number, message: string }>(url);
  }

   /**
   * Fetch filtered trainee attendance logs based on status, date, and batches.
   * @param status The status filter (e.g., "Present", "Absent").
   * @param date The date filter in 'yyyy-MM-dd' format.
   * @param batches An array of batch filters.
   * @returns An observable containing logs, count, and a message.
   */
  getFilteredTraineeAttendanceLogs(status: string, date: string, batches: string[]): Observable<{ logs: TraineeAttendanceLogs[], count: number, message: string }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (date) params = params.set('date', date);
    if (batches.length > 0) params = params.set('batch', batches.join(','));

    const url = `${this.apiUrl}/filterLogs`;
    return this.http.get<{ logs: TraineeAttendanceLogs[], count: number, message: string }>(url, { params });
  }

   /**
   * Retrieves the latest attendance date.
   * @returns {Observable<{ latestDate: string }>} - An observable containing the latest attendance date.
   */
   getLatestDate(): Observable<{ latestDate: string }> {
    return this.http.get<{ latestDate: string }>(`${this.apiUrl}/latestAttendanceSummary`);
  }

  // Function to update status and remark of a trainee
  updateTraineeLog(id: number, updatedLog: CurrentTraineeLog): Observable<PatchResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<PatchResponse>(url, updatedLog);
  }

  // Function to get absences and leave count of a trainee
  getAbsenceOfTrainee(traineeCode: string): Observable<AbsenceAndLate> {
    return this.http.get<AbsenceAndLate>(`${this.apiUrl}/GetAbsenceOfTrainee?traineeCode=${traineeCode}`);
  }

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

  getUserWidgetCount(traineeCode:number): Observable<UserWidgetSummary>{
    const url = `${this.apiUrl}/GetAttendanceCountOfTrainee?traineeCode=${traineeCode}`;
    return this.http.get<UserWidgetSummary>(url)
  }

  // Function to retrieve the latest selected date
  getSelectedDate(): Date {
    return this.selectedDateSource.value || new Date();
}

  updateSelectedDate(date: { day: number, month: number, year: number }) {
    this.selectedDateSubject.next(date);
  }

  setSelectedDate(date: Date) {
    this.selectedDateSource.next(date);
  }
}  
