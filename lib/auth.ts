import type { User } from "@/app/actions";

/**
 * Role constants
 */
export const ROLES = {
  USER: "ROLE_USER",
  ADMIN: "ROLE_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: Role): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}

/**
 * Check if user is an admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ROLES.ADMIN);
}

/**
 * Check if user is a regular user
 */
export function isUser(user: User | null): boolean {
  return hasRole(user, ROLES.USER);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: Role[]): boolean {
  if (!user || !user.roles) return false;
  return roles.some((role) => user.roles.includes(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null, roles: Role[]): boolean {
  if (!user || !user.roles) return false;
  return roles.every((role) => user.roles.includes(role));
}

/**
 * Get user's display role (prioritize admin over user)
 */
export function getDisplayRole(user: User | null): string {
  if (!user || !user.roles || user.roles.length === 0) return "Guest";
  if (isAdmin(user)) return "Administrator";
  if (isUser(user)) return "User";
  return user.roles[0].replace("ROLE_", "");
}
