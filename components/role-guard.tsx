"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/dashboard/user-provider";
import { hasRole, hasAnyRole, hasAllRoles, type Role } from "@/lib/auth";
import type { User } from "@/app/actions";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
  requiredRoles?: Role[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
  onUnauthorized?: (user: User | null) => void;
}

/**
 * RoleGuard component for client-side role-based access control
 *
 * @example
 * // Require single role
 * <RoleGuard requiredRole={ROLES.ADMIN}>
 *   <AdminContent />
 * </RoleGuard>
 *
 * @example
 * // Require any of multiple roles
 * <RoleGuard requiredRoles={[ROLES.ADMIN, ROLES.MODERATOR]}>
 *   <ModeratorContent />
 * </RoleGuard>
 *
 * @example
 * // Require all roles
 * <RoleGuard requiredRoles={[ROLES.ADMIN, ROLES.USER]} requireAll={true}>
 *   <RestrictedContent />
 * </RoleGuard>
 *
 * @example
 * // With custom fallback
 * <RoleGuard requiredRole={ROLES.ADMIN} fallback={<AccessDenied />}>
 *   <AdminContent />
 * </RoleGuard>
 *
 * @example
 * // With redirect
 * <RoleGuard requiredRole={ROLES.ADMIN} redirectTo="/dashboard">
 *   <AdminContent />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  requiredRole,
  requiredRoles,
  requireAll = false,
  fallback = null,
  redirectTo,
  onUnauthorized,
}: RoleGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const hasAccess = useCallback(
    (user: User | null): boolean => {
      if (!user) return false;

      if (requiredRole) {
        return hasRole(user, requiredRole);
      }

      if (requiredRoles && requiredRoles.length > 0) {
        if (requireAll) {
          return hasAllRoles(user, requiredRoles);
        }
        return hasAnyRole(user, requiredRoles);
      }

      return true;
    },
    [requiredRole, requiredRoles, requireAll],
  );

  useEffect(() => {
    if (!isLoading && !hasAccess(user) && redirectTo) {
      router.push(redirectTo);
    }
  }, [user, isLoading, redirectTo, router, hasAccess]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check access
  const authorized = hasAccess(user);

  // Handle unauthorized access
  if (!authorized) {
    if (onUnauthorized) {
      onUnauthorized(user);
    }

    if (redirectTo) {
      return null; // Will redirect via useEffect
    }

    return <>{fallback}</>;
  }

  // Render children if authorized
  return <>{children}</>;
}

/**
 * Hook to check if current user has specific role(s)
 */
export function useRole(role: Role): boolean {
  const { user } = useUser();
  return hasRole(user, role);
}

/**
 * Hook to check if current user has any of the specified roles
 */
export function useAnyRole(roles: Role[]): boolean {
  const { user } = useUser();
  return hasAnyRole(user, roles);
}

/**
 * Hook to check if current user has all of the specified roles
 */
export function useAllRoles(roles: Role[]): boolean {
  const { user } = useUser();
  return hasAllRoles(user, roles);
}
