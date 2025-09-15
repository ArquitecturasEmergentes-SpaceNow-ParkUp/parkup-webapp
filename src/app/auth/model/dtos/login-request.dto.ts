/**
 * Data Transfer Object for login requests
 * Matches the SignInResource from the backend
 */

export interface LoginRequest {
  email: string;
  password: string;
}
