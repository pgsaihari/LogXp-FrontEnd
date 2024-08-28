import { HttpClient, HttpParams, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TraineeAttendanceLogs } from '../model/traineeAttendanceLogs.model';
import { DailyAttendanceOfMonth } from '../interfaces/daily-attendance-of-month';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to manage Trainee Attendance Logs related API calls.
 */
export class TraineeAttendancelogService {

  private apiUrl = 'https://localhost:7074/api/LogXP/traineeAttendanceLogs';

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
}
