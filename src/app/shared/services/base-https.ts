import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, lastValueFrom, throwError, retry, timeout } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../../auth/services/auth.service";
import { environment } from "../../../environments/environment";
import { join } from "path";

export interface HttpOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: string | number | boolean };
  body?: any;
  retries?: number;
  timeoutMs?: number;
  logRequests?: boolean;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpHeaders;
}

/**
 * Generic base HTTP service for handling authenticated requests.
 * Automatically injects Bearer token from AuthService.
 * Supports GET, POST, PUT, DELETE, PATCH, and other HTTP methods.
 * Configurable by base URL endpoint.
 */
@Injectable({
  providedIn: "root",
})
export class BaseHttpService {
  private baseUrl: string = environment.apiUrl || "";
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Performs a GET request
   * @param endpoint - The relative path (appended to baseUrl if set)
   * @param options - Optional configuration
   * @returns Promise with response data
   */
  async get<T = any>(
    endpoint: string,
    options: Omit<HttpOptions, "body"> = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      "GET",
      join(this.baseUrl, endpoint),
      options
    );
  }

  /**
   * Performs a POST request
   * @param endpoint - The relative path (appended to baseUrl if set)
   * @param options - Optional configuration including body
   * @returns Promise with response data
   */
  async post<T = any>(
    endpoint: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      "POST",
      join(this.baseUrl, endpoint),
      options
    );
  }

  /**
   * Performs a PUT request
   * @param endpoint - The relative path (appended to baseUrl if set)
   * @param options - Optional configuration including body
   * @returns Promise with response data
   */
  async put<T = any>(
    endpoint: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      "PUT",
      join(this.baseUrl, endpoint),
      options
    );
  }

  /**
   * Performs a DELETE request
   * @param endpoint - The full URL or relative path
   * @param options - Optional configuration
   * @returns Promise with response data
   */
  async delete<T = any>(
    endpoint: string,
    options: Omit<HttpOptions, "body"> = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      "DELETE",
      join(this.baseUrl, endpoint),
      options
    );
  }

  /**
   * Performs a PATCH request
   * @param endpoint - The relative path (appended to baseUrl if set)
   * @param options - Optional configuration including body
   * @returns Promise with response data
   */
  async patch<T = any>(
    endpoint: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      "PATCH",
      join(this.baseUrl, endpoint),
      options
    );
  }

  /**
   * Generic HTTP request method
   * @param method - HTTP method
   * @param url - The full URL or relative path
   * @param options - Request options
   * @returns Promise with response data
   */
  private async request<T>(
    method: string,
    url: string,
    options: HttpOptions
  ): Promise<HttpResponse<T>> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    // Add authorization header if token exists
    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }

    // Add custom headers
    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        headers = headers.set(key, options.headers![key]);
      });
    }

    // Build query parameters
    let params = new HttpParams();
    if (options.params) {
      Object.keys(options.params).forEach((key) => {
        params = params.set(key, options.params![key].toString());
      });
    }

    // Log request if enabled
    if (options.logRequests) {
      console.log(`HTTP ${method} ${url}`, {
        headers,
        params,
        body: options.body,
      });
    }

    // Create the request observable
    let request$: Observable<any> = this.http.request(method, url, {
      headers,
      params,
      body: options.body,
      observe: "response",
    });

    // Apply retries if specified
    if (options.retries && options.retries > 0) {
      request$ = request$.pipe(retry(options.retries));
    }

    // Apply timeout if specified
    if (options.timeoutMs && options.timeoutMs > 0) {
      request$ = request$.pipe(timeout(options.timeoutMs));
    }

    // Apply error handling
    request$ = request$.pipe(catchError(this.handleError));

    // Convert to promise
    const response = await lastValueFrom(request$);

    return {
      data: response.body,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  /**
   * Handles HTTP errors
   * @param error - The error response
   * @returns Observable that throws the error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unknown error occurred";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} ${error.statusText}`;
      if (error.error && typeof error.error === "object") {
        errorMessage += ` - ${JSON.stringify(error.error)}`;
      }
    }

    console.error("HTTP Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

/*
Example Usage:

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseEndpoint = 'v1/users'; // relative to environment.apiUrl + /v1

  constructor(private httpService: BaseHttpService) {}

  // GET request with optional params
  async getUsers(page: number = 1, limit: number = 10): Promise<HttpResponse<User[]>> {
    return this.httpService.get<User[]>(`${this.baseEndpoint}`, {
      params: { page, limit },
      logRequests: true
    });
  }

  // POST request with request body
  async createUser(user: User): Promise<HttpResponse<User>> {
    return this.httpService.post<User>(`${this.baseEndpoint}`, {
      body: user,
      logRequests: true,
      retries: 2,         // retry twice if request fails
      timeoutMs: 4000     // fail if request takes longer than 4s
    });
  }

  // PUT request with retries and timeout
  async updateUser(id: string, user: Partial<User>): Promise<HttpResponse<User>> {
    return this.httpService.put<User>(`${this.baseEndpoint}/${id}`, {
      body: user,
      retries: 3,
      timeoutMs: 5000
    });
  }

  // DELETE request with custom headers
  async deleteUser(id: string): Promise<HttpResponse<void>> {
    return this.httpService.delete<void>(`${this.baseEndpoint}/${id}`, {
      headers: { 'X-Custom-Header': 'value' },
      logRequests: true
    });
  }

  // PATCH request for partial updates
  async patchUser(id: string, patchData: Partial<User>): Promise<HttpResponse<User>> {
    return this.httpService.patch<User>(`${this.baseEndpoint}/${id}`, {
      body: patchData,
      retries: 1
    });
  }
}
**/
