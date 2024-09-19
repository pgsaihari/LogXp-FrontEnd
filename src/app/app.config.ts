import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptorService } from './core/interceptor/spinner-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './core/interceptor/auth-interceptor.service';

// Final Merged Configuration without MSAL
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNoopAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),

    // Importing external modules like NgxSpinner and Browser Animations
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
    ),

    // Spinner Interceptor for managing loading spinners
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptorService,
      multi: true,
    },

    // Auth Interceptor for managing authentication
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // },
  ],
};
