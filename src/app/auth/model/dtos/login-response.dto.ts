/**
 * Data Transfer Object for login responses
 * Matches the AuthenticatedUserResource from the backend
 */

export interface LoginResponse {
  id: number;
  email: string;
  token: string;
}
