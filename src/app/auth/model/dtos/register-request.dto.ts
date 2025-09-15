/**
 * Data Transfer Object for registration requests
 * Matches the SignUpResource from the backend
 */

export interface RegisterRequest {
  email: string;
  password: string;
  roles: ("ROLE_USER")[];
}
