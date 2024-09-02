import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner-control.service';


@Injectable({
  providedIn: 'root'
})
export class SpinnerInterceptorService implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.show();  // Show the spinner

    return next.handle(req).pipe(
      finalize(() => {
        setTimeout(() => {
          this.spinnerService.hide();  // Hide the spinner after completion
        }, 500);  // Delay for smooth spinner transition
      })
    );
  }
}
