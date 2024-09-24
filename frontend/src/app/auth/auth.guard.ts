import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // First, try to get the user profile
    return this.authService.getUserProfile().pipe(
      map(() => true), // User is authenticated, allow access
      catchError((err) => {
        if (err.status === 401) {
          // If 401 is encountered, attempt to refresh the token
          return this.authService.refreshToken().pipe(
            switchMap(() => this.authService.getUserProfile()), // Retry fetching the profile after token refresh
            map(() => true), // If refresh works and profile is fetched, allow access
            catchError(() => {
              this.router.navigate(['/login']);
              return of(false);
            })
          );
        } else {
          // For other errors, redirect to login
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}
