/**
 * User entity interface representing the authenticated user
 */

export interface User {
  id: number;
  email: string;
  roles?: string[];
}
