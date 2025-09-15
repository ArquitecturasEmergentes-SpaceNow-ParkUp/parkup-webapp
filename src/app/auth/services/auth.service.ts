import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../model/dtos/login-request.dto';
import { LoginResponse } from '../model/dtos/login-response.dto';
import { RegisterRequest } from '../model/dtos/register-request.dto';
import { RegisterResponse } from '../model/dtos/register-response.dto';
import { User } from '../model/entities/user.entity';

/**
 * Authentication service responsible for handling user authentication,
 * JWT token management, and user session state
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'parkup_auth_token';
  private readonly USER_KEY = 'parkup_user_data';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize user from localStorage if available (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromStorage();
    }
  }

  /**
   * Authenticates user with email and password
   * @param loginRequest - User credentials
   * @returns Observable with login response
   */
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/authentication/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setSession(response);
        })
      );
  }

  /**
   * Registers a new user
   * @param registerRequest - User registration data
   * @returns Observable with registration response
   */
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/authentication/register`, registerRequest);
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    this.clearSession();
  }

  /**
   * Checks if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Always return false during SSR
    }

    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    return !this.isTokenExpired(token);
  }

  /**
   * Gets the current user
   * @returns Current user or null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Gets the stored JWT token
   * @returns JWT token or null
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // Return null during SSR
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Sets user session data
   * @param loginResponse - Response from login endpoint
   */
  private setSession(loginResponse: LoginResponse): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage operations during SSR
    }

    const user: User = {
      id: loginResponse.id,
      email: loginResponse.email
    };

    localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Clears user session data
   */
  private clearSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage operations during SSR
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Loads user data from localStorage
   */
  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage operations during SSR
    }

    const userData = localStorage.getItem(this.USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (userData && token && !this.isTokenExpired(token)) {
      const user: User = JSON.parse(userData);
      this.currentUserSubject.next(user);
    } else {
      this.clearSession();
    }
  }

  /**
   * Checks if JWT token is expired
   * @param token - JWT token to check
   * @returns boolean indicating if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true; // If we can't parse the token, consider it expired
    }
  }
}
