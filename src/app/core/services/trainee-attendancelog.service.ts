import { HttpClient } from '@angular/common/http';
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
}
