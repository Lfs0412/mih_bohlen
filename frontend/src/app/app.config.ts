import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth.interceptor";
import {provideToastr} from "ngx-toastr";
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(),
    provideToastr({
        positionClass: 'toast-top-center', // Position to top-center
        easing: 'ease-in',                 // Easing for slide-in animation
      easeTime: '300',
        timeOut: 3000,                     // Toast auto-hide after 3 seconds
        progressBar: true,                 // Show progress bar
        closeButton: true,                 // Optionally show close button
        maxOpened: 1,                      // Allow only one toast at a time
        newestOnTop: true,
      }
    ),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },]
};
