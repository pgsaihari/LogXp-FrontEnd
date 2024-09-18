import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OfficeEntryTime } from '../interfaces/daily-attendance-of-month';

@Injectable({
  providedIn: 'root'
})
export class OfficeEntryService {

  private apiUrl = environment.apiUrl+`/OfficeEntryTime`;
  constructor(private http: HttpClient) { }

  getOfficeEntryTime():Observable<OfficeEntryTime>{
    const url = `${this.apiUrl}/getOfficeEntryTime`;
    return this.http.get<OfficeEntryTime>(url);
  }

  
  setOfficeEntryTime(officeEntryTime:OfficeEntryTime):Observable<any>{
    const url = `${this.apiUrl}/setOfficeEntryTime`;
    return this.http.post<any>(url, officeEntryTime);
  }
}
