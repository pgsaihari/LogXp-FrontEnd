import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {  CalendarModel } from '../model/calendar.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CalendarServiceService {

  private apiUrl = environment.apiUrl+`/HolidayCalendar`;
  constructor(private http: HttpClient) { }

  getHolidaysOfAYear(year:number): Observable<CalendarModel[]> {
    const url = `${this.apiUrl}/${year}`
    return this.http.get<CalendarModel[]>(url);
  }

  addHoliday(holiday:CalendarModel):Observable<any>{
    return this.http.post<any>(this.apiUrl, holiday);
  }

  removeHoliday(date : string):Observable<any>{
    const url = `${this.apiUrl}/${date}`
    return this.http.delete<any>(url);
  }
}
