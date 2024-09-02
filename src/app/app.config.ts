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
import { authConfig } from '../app/core/config/authConfig';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';
import {
  MsalInterceptor,
  MSAL_INSTANCE,
  MsalInterceptorConfiguration,
  MsalGuardConfiguration,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
} from '@azure/msal-angular';

// MSAL configuration functions
export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: authConfig.msalConfig.auth.clientId,
      authority: authConfig.msalConfig.auth.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(
    authConfig.apiConfig.uri,
    authConfig.apiConfig.scopes
  );

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...authConfig.apiConfig.scopes],
    },
    loginFailedRoute: '/login',
  };
}

// Final Merged Configuration
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

    // MSAL Interceptor for managing authentication and tokens
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },

    // MSAL services and configurations
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
