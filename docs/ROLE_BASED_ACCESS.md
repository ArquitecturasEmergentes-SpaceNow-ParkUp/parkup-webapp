# Role-Based Access Control (RBAC) Documentation

> **📌 Next.js 16 Note:** This project uses `proxy.ts` instead of the deprecated `middleware.ts`. All route protection and role-based redirects are handled in the proxy function. If you're migrating from an older Next.js version, rename your `middleware.ts` to `proxy.ts` and update the export from `middleware()` to `proxy()`.

## Overview

This document explains how the role-based access control system works in the ParkUp application. The system supports two main roles: `ROLE_USER` and `ROLE_ADMIN`, with complete separation of views and functionality.

## Roles

### Available Roles

- **ROLE_USER**: Regular users who can access the standard dashboard and user features
- **ROLE_ADMIN**: Administrators with full access to admin panel and management features

### Role Constants

```typescript
import { ROLES } from "@/lib/auth";

ROLES.USER  // "ROLE_USER"
ROLES.ADMIN // "ROLE_ADMIN"
```

## Architecture

### 1. Proxy Protection (`proxy.ts`)

> **Next.js 16+:** Uses `proxy.ts` (replaces deprecated `middleware.ts`)

The proxy function handles automatic role-based routing at the server level:

- **Unauthenticated users**: Redirected to `/login`
- **Authenticated ROLE_ADMIN**: Automatically redirected to `/admin` when accessing `/dashboard`
- **Authenticated ROLE_USER**: Automatically redirected to `/dashboard` when accessing `/admin`
- **Login/Register pages**: Authenticated users are redirected to their appropriate dashboard

### 2. Route Structure

```
/dashboard              → User Dashboard (ROLE_USER only)
  ├── /profile
  ├── /recognition-units
  ├── /reservations
  ├── /settings
  └── /support

/admin                  → Admin Panel (ROLE_ADMIN only)
  ├── /users
  ├── /recognition-units
  ├── /reports
  ├── /logs
  ├── /settings
  ├── /security
  └── /support
```

### 3. Server-Side Protection

Both dashboard layouts include server-side role checks:

**Dashboard Layout** (`app/dashboard/layout.tsx`):
```typescript
const user = await getCurrentUser();

// Redirect admins to admin panel
if (user && isAdmin(user)) {
  redirect("/admin");
}
```

**Admin Layout** (`app/admin/layout.tsx`):
```typescript
const user = await getCurrentUser();

// Redirect non-admins to dashboard
if (!user || !isAdmin(user)) {
  redirect("/dashboard");
}
```

**Note:** In Next.js 16+, use `proxy.ts` instead of `middleware.ts` for route protection.

## Utility Functions

### Authentication Helpers (`lib/auth.ts`)

```typescript
import { isAdmin, isUser, hasRole, hasAnyRole, hasAllRoles, getDisplayRole, ROLES } from "@/lib/auth";

// Check if user is admin
isAdmin(user); // boolean

// Check if user is regular user
isUser(user); // boolean

// Check for specific role
hasRole(user, ROLES.ADMIN); // boolean

// Check if user has any of the roles
hasAnyRole(user, [ROLES.ADMIN, ROLES.USER]); // boolean

// Check if user has all roles
hasAllRoles(user, [ROLES.ADMIN, ROLES.USER]); // boolean

// Get display-friendly role name
getDisplayRole(user); // "Administrator" | "User" | "Guest"
```

## Client-Side Protection

### Using RoleGuard Component

The `RoleGuard` component provides client-side protection for specific UI elements:

#### Basic Usage

```typescript
import { RoleGuard } from "@/components/role-guard";
import { ROLES } from "@/lib/auth";

// Require single role
<RoleGuard requiredRole={ROLES.ADMIN}>
  <AdminOnlyContent />
</RoleGuard>

// Require any of multiple roles
<RoleGuard requiredRoles={[ROLES.ADMIN, ROLES.MODERATOR]}>
  <ModeratorContent />
</RoleGuard>

// Require all roles
<RoleGuard requiredRoles={[ROLES.ADMIN, ROLES.USER]} requireAll={true}>
  <RestrictedContent />
</RoleGuard>
```

#### With Custom Fallback

```typescript
<RoleGuard 
  requiredRole={ROLES.ADMIN} 
  fallback={<AccessDeniedMessage />}
>
  <AdminContent />
</RoleGuard>
```

#### With Redirect

```typescript
<RoleGuard 
  requiredRole={ROLES.ADMIN} 
  redirectTo="/dashboard"
>
  <AdminContent />
</RoleGuard>
```

#### With Custom Handler

```typescript
<RoleGuard 
  requiredRole={ROLES.ADMIN}
  onUnauthorized={(user) => {
    console.log("Unauthorized access attempt by:", user?.email);
    toast.error("You don't have permission to view this content");
  }}
>
  <AdminContent />
</RoleGuard>
```

### Using Role Hooks

```typescript
import { useRole, useAnyRole, useAllRoles } from "@/components/role-guard";
import { ROLES } from "@/lib/auth";

function MyComponent() {
  const isAdmin = useRole(ROLES.ADMIN);
  const hasAccess = useAnyRole([ROLES.ADMIN, ROLES.MODERATOR]);
  const hasAllPermissions = useAllRoles([ROLES.ADMIN, ROLES.USER]);

  if (isAdmin) {
    return <AdminView />;
  }

  return <UserView />;
}
```

## UI Components

### Sidebar Navigation

Each role has its own sidebar component:

- **User Sidebar**: `components/app-sidebar.tsx`
  - Navigation: Dashboard, Recognition Units, Reservations
  - Account: Settings, Help & Support
  - Shows link to Admin Panel if user is admin

- **Admin Sidebar**: `components/admin-sidebar.tsx`
  - Management: Dashboard, Users, Recognition Units, Reports, Logs
  - Administration: Settings, Security, Help & Support
  - Shows link to User Dashboard

### User Context

The `UserProvider` component provides user data throughout the application:

```typescript
import { useUser } from "@/components/dashboard/user-provider";

function MyComponent() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Spinner />;
  if (!user) return <Login />;

  return <div>Welcome, {user.email}</div>;
}
```

## Adding New Roles

To add a new role:

1. **Update Role Constants** (`lib/auth.ts`):
```typescript
export const ROLES = {
  USER: "ROLE_USER",
  ADMIN: "ROLE_ADMIN",
  MODERATOR: "ROLE_MODERATOR", // New role
} as const;
```

2. **Update Proxy** (`proxy.ts`):
```typescript
const isModerator = roles.includes("ROLE_MODERATOR");
const isModeratorPath = path.startsWith("/moderator");

if (isModerator && !isModeratorPath && !isAdminPath) {
  return NextResponse.redirect(new URL("/moderator", request.url));
}
```

3. **Create Route Structure**:
```
app/moderator/
  ├── layout.tsx
  ├── page.tsx
  └── ...
```

4. **Create Sidebar Component**:
```typescript
components/moderator-sidebar.tsx
```

5. **Update Display Role Function**:
```typescript
export function getDisplayRole(user: User | null): string {
  if (!user || !user.roles || user.roles.length === 0) return "Guest";
  if (isAdmin(user)) return "Administrator";
  if (isModerator(user)) return "Moderator"; // Add this
  if (isUser(user)) return "User";
  return user.roles[0].replace("ROLE_", "");
}
```

## Best Practices

### 1. Always Use Server-Side Protection

Client-side guards are for UX only. Always validate permissions on the server:

```typescript
// app/admin/users/page.tsx (Server Component)
import { getCurrentUser } from "@/app/actions";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  
  if (!user || !isAdmin(user)) {
    redirect("/dashboard");
  }

  // Fetch and display admin data
}
```

### 2. Use Proxy for Route Protection

The proxy function automatically handles redirects, so you don't need to check roles in every page.

### 3. Combine Server and Client Protection

Use server-side protection for routes and API endpoints, and client-side `RoleGuard` for UI elements within pages.

### 4. Handle Loading States

Always handle loading states when checking user roles:

```typescript
const { user, isLoading } = useUser();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAdmin(user)) {
  return <AccessDenied />;
}
```

### 5. Log Authorization Attempts

Consider logging unauthorized access attempts:

```typescript
<RoleGuard 
  requiredRole={ROLES.ADMIN}
  onUnauthorized={(user) => {
    logSecurityEvent({
      type: "UNAUTHORIZED_ACCESS",
      user: user?.id,
      timestamp: new Date(),
      resource: "/admin/users"
    });
  }}
>
  <AdminContent />
</RoleGuard>
```

## Testing Role-Based Access

### Manual Testing

1. **Create test users with different roles**:
   - `user@example.com` with ROLE_USER
   - `admin@example.com` with ROLE_ADMIN

2. **Test navigation**:
   - Login as user → Should see `/dashboard`
   - Try to access `/admin` → Should redirect to `/dashboard`
   - Login as admin → Should see `/admin`
   - Try to access `/dashboard` → Should redirect to `/admin`

3. **Test UI elements**:
   - Verify admin-only buttons/links are hidden for users
   - Verify user-specific content is hidden from admins in admin panel

### Unit Testing Example

```typescript
import { hasRole, isAdmin, isUser, ROLES } from "@/lib/auth";

describe("Role Utilities", () => {
  const adminUser = {
    id: 1,
    email: "admin@test.com",
    roles: ["ROLE_ADMIN", "ROLE_USER"]
  };

  const regularUser = {
    id: 2,
    email: "user@test.com",
    roles: ["ROLE_USER"]
  };

  test("isAdmin returns true for admin users", () => {
    expect(isAdmin(adminUser)).toBe(true);
    expect(isAdmin(regularUser)).toBe(false);
  });

  test("hasRole correctly identifies roles", () => {
    expect(hasRole(adminUser, ROLES.ADMIN)).toBe(true);
    expect(hasRole(regularUser, ROLES.ADMIN)).toBe(false);
  });
});
```

## Security Considerations

1. **Never trust client-side checks alone**: Always validate on the server
2. **Use HTTPS**: All authentication cookies should be secure
3. **Token validation**: Middleware validates tokens on every request
4. **Session management**: Tokens are stored in httpOnly cookies
5. **Role changes**: Users must log out and back in for role changes to take effect
6. **API protection**: All API endpoints should validate roles server-side

## Troubleshooting

### User stuck in redirect loop

- Check middleware logic for conflicting redirect rules
- Verify user has valid roles in database
- Clear cookies and re-login

### Roles not updating after change

- User must logout and login again
- Check if `getCurrentUser()` is fetching fresh data
- Verify token contains updated role information

### Unauthorized access to protected routes

**Solution:**
- Check proxy matcher configuration in proxy.ts
- Verify role checking logic in layouts
- Ensure API endpoints validate roles

## API Endpoints

All API endpoints should validate roles:

```typescript
// app/api/admin/users/route.ts
import { getCurrentUser } from "@/app/actions";
import { isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  
  if (!user || !isAdmin(user)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  // Handle admin request
  const users = await fetchAllUsers();
  return NextResponse.json(users);
}
```

## Summary

The ParkUp RBAC system provides:
- ✅ Automatic role-based routing via proxy function
- ✅ Server-side protection at layout level
- ✅ Client-side UI guards with `RoleGuard`
- ✅ Comprehensive utility functions
- ✅ Separate admin and user interfaces
- ✅ Flexible and extensible architecture

For questions or issues, please refer to the source code in:
- `lib/auth.ts` - Role utilities and constants
- `proxy.ts` - Next.js 16+ route protection (replaces deprecated `middleware.ts`)
- `components/role-guard.tsx` - Client-side role guards
- `app/dashboard/layout.tsx` - User layout with role checks
- `app/admin/layout.tsx` - Admin layout with role checks

## Next.js 16 Migration Notes

If you're upgrading from an older Next.js version:

1. **Rename file:** `middleware.ts` → `proxy.ts`
2. **Update export:** `export function middleware()` → `export function proxy()`
3. **Keep the same logic:** The proxy function works identically to the old middleware
4. **Config stays the same:** The `export const config` remains unchanged

### Before (Next.js 15 and earlier):
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // ... logic
}
```

### After (Next.js 16+):
```typescript
// proxy.ts
export async function proxy(request: NextRequest) {
  // ... same logic
}
```

No other changes are required. The proxy function receives the same `NextRequest` and returns the same `NextResponse` types.
