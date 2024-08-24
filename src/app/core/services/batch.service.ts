import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Batch } from '../model/batch.model';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private apiUrl = 'https://localhost:7074/api/LogXP/batch'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Get all batches
  getBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Batch[]>('getBatches', []))
      );
  }

  // Add a new batch
  addBatch(batch: Batch): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/add`, batch)
      .pipe(
        catchError(this.handleError<boolean>('addBatch', false))
      );
  }

  // Delete a batch
  deleteBatch(batchId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/delete/${batchId}`)
      .pipe(
        catchError(this.handleError<boolean>('deleteBatch', false))
      );
  }

  // Update an existing batch
  updateBatch(batchId: number, batch: Batch): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/update/${batchId}`, batch)
      .pipe(
        catchError(this.handleError<boolean>('updateBatch', false))
      );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
