import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {User} from "./user.interface";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Call the login endpoint
  login(username: string, password: string) {
    return this.http
      .post('http://localhost:3000/api/auth/login', { username, password }, { withCredentials: true })
      .pipe(
        tap(() => this.getUserProfile()), // Fetch user data after login
        catchError(this.handleError)
      );
  }

  // Get user profile from /me
  getUserProfile() {
    console.log("fetchUser")
    return this.http.get('http://localhost:3000/api/auth/me', { withCredentials: true }).pipe(
      tap((user: any) => this.userSubject.next(user)), // Update user state
      catchError(this.handleError)
    );
  }

  // Call the refresh token endpoint
  refreshToken() {
    console.log("fetch refresh")
    return this.http.post('http://localhost:3000/api/auth/refresh', {}, { withCredentials: true }).pipe(
      tap(() => this.getUserProfile()), // Fetch updated user profile after token refresh
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    this.userSubject.next(null);  // Clear user state on logout
    return this.http.post<void>('http://localhost:3000/api/auth/logout', {}, { withCredentials: true })
      .pipe(
        tap(() => {
          // Optionally perform other actions on logout, like clearing local storage
          console.log('Logged out successfully');
        })
      );
  }


  // Handle errors globally
  private handleError(error: any) {
    console.error('Error:', error);
    return throwError(error);
  }
}
