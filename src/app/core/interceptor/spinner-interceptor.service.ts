import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerInterceptorService implements HttpInterceptor  {

  constructor(private spinner: NgxSpinnerService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();

    return next.handle(req).pipe(
      finalize(() => {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      })
    );  
  }
}
