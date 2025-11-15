# Test Users for Role-Based Access Control

This document provides test user credentials for testing the role-based access control system.

## Test User Accounts

### Administrator Account

```
Email: admin@parkup.com
Password: Admin123!
Roles: ROLE_ADMIN, ROLE_USER
```

**Access:**
- ✅ Admin Panel (`/admin`)
- ✅ User Dashboard (`/dashboard`) - redirected to `/admin`
- ✅ All admin features
- ✅ User management
- ✅ Recognition units management
- ✅ System reports and analytics

**Expected Behavior:**
1. Login redirects to `/admin`
2. Accessing `/dashboard` redirects to `/admin`
3. Sidebar shows "Administrator" role
4. Can access "User Dashboard" via dropdown menu

---

### Regular User Account

```
Email: user@parkup.com
Password: User123!
Roles: ROLE_USER
```

**Access:**
- ✅ User Dashboard (`/dashboard`)
- ❌ Admin Panel (`/admin`) - redirected to `/dashboard`
- ✅ View parking spots
- ✅ Make reservations
- ✅ Manage profile

**Expected Behavior:**
1. Login redirects to `/dashboard`
2. Accessing `/admin` redirects to `/dashboard`
3. Sidebar shows "User" role
4. No admin options in dropdown menu

---

## Creating Test Users

If your backend doesn't have test users, you can create them using these SQL scripts or API calls:

### SQL Script (PostgreSQL)

```sql
-- Create admin user
INSERT INTO users (email, password, name, roles, created_at, updated_at)
VALUES (
  'admin@parkup.com',
  '$2a$10$encrypted_password_hash', -- Replace with actual bcrypt hash
  'Admin User',
  ARRAY['ROLE_ADMIN', 'ROLE_USER'],
  NOW(),
  NOW()
);

-- Create regular user
INSERT INTO users (email, password, name, roles, created_at, updated_at)
VALUES (
  'user@parkup.com',
  '$2a$10$encrypted_password_hash', -- Replace with actual bcrypt hash
  'Test User',
  ARRAY['ROLE_USER'],
  NOW(),
  NOW()
);
```

### API Registration (cURL)

```bash
# Register admin user (requires backend endpoint to assign admin role)
curl -X POST http://localhost:8090/api/v1/authentication/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@parkup.com",
    "password": "Admin123!",
    "roles": ["ROLE_ADMIN", "ROLE_USER"]
  }'

# Register regular user
curl -X POST http://localhost:8090/api/v1/authentication/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "user@parkup.com",
    "password": "User123!",
    "roles": ["ROLE_USER"]
  }'
```

### Using Postman

**Admin User:**
```json
POST http://localhost:8090/api/v1/authentication/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@parkup.com",
  "password": "Admin123!",
  "roles": ["ROLE_ADMIN", "ROLE_USER"]
}
```

**Regular User:**
```json
POST http://localhost:8090/api/v1/authentication/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "user@parkup.com",
  "password": "User123!",
  "roles": ["ROLE_USER"]
}
```

---

## Testing Scenarios

### Scenario 1: Admin Login Flow

1. Navigate to `http://localhost:3000/login`
2. Enter admin credentials
3. Click "Sign In"
4. **Expected:** Redirect to `/admin` (Admin Panel)
5. Verify sidebar shows "Administrator" role
6. Verify admin navigation items are visible

### Scenario 2: User Login Flow

1. Navigate to `http://localhost:3000/login`
2. Enter user credentials
3. Click "Sign In"
4. **Expected:** Redirect to `/dashboard`
5. Verify sidebar shows "User" role
6. Verify user navigation items are visible

### Scenario 3: Admin Accessing User Dashboard

1. Login as admin
2. From admin panel, click dropdown menu
3. Select "User Dashboard"
4. **Expected:** Navigate to `/dashboard`
5. Verify user dashboard is displayed
6. Can still access admin panel via dropdown

### Scenario 4: User Trying to Access Admin Panel

1. Login as regular user
2. Manually navigate to `/admin` in browser
3. **Expected:** Immediately redirected to `/dashboard`
4. Toast notification (optional): "Access denied"

### Scenario 5: Unauthenticated Access

1. Clear all cookies/logout
2. Navigate to `/dashboard` or `/admin`
3. **Expected:** Redirect to `/login`
4. After login, redirect to appropriate dashboard

### Scenario 6: Role Change (Manual Test)

1. Login as user
2. Using backend/database, add `ROLE_ADMIN` to user
3. Logout and login again
4. **Expected:** Now redirects to `/admin` panel
5. Has access to admin features

---

## Testing Checklist

### Admin Account Tests

- [ ] Can login successfully
- [ ] Redirects to `/admin` after login
- [ ] Admin sidebar displays correctly
- [ ] All admin menu items are accessible
- [ ] Can view Users Management page
- [ ] Can view Recognition Units (Admin) page
- [ ] Can view Reports & Analytics
- [ ] Can view System Logs
- [ ] Sidebar shows "Administrator" role
- [ ] Can access User Dashboard via dropdown
- [ ] Accessing `/dashboard` redirects to `/admin`
- [ ] Can logout successfully

### User Account Tests

- [ ] Can login successfully
- [ ] Redirects to `/dashboard` after login
- [ ] User sidebar displays correctly
- [ ] All user menu items are accessible
- [ ] Can view Dashboard page
- [ ] Can view Recognition Units page
- [ ] Can view Reservations page
- [ ] Sidebar shows "User" role
- [ ] No admin options in dropdown
- [ ] Accessing `/admin` redirects to `/dashboard`
- [ ] Can logout successfully

### Security Tests

- [ ] Unauthenticated users redirected to login
- [ ] User cannot access admin API endpoints
- [ ] Admin can access all endpoints
- [ ] Role changes require re-login
- [ ] Tokens are validated on each request
- [ ] Invalid tokens redirect to login

---

## Troubleshooting

### Issue: User not redirecting correctly

**Solution:**
1. Clear browser cookies
2. Check proxy.ts is configured correctly
3. Verify backend returns roles in user object
4. Check browser console for errors

### Issue: Roles not displaying

**Solution:**
1. Verify backend returns roles array in `/users/{id}` endpoint
2. Check `getCurrentUser()` function in `app/actions.ts`
3. Verify UserProvider is wrapping the layout
4. Check browser console for API errors

### Issue: Infinite redirect loop

**Solution:**
1. Check proxy.ts logic for conflicting redirects
2. Verify user has valid roles in database
3. Clear all cookies and re-login
4. Check Next.js console for proxy errors

### Issue: Admin can't access user dashboard

**Solution:**
1. Admin can access user dashboard via dropdown menu
2. Direct navigation to `/dashboard` redirects to `/admin` by design
3. Update proxy.ts if you want different behavior

---

## Backend Requirements

Your backend MUST return user roles in these endpoints:

### Login Response

```json
POST /api/v1/authentication/login

Response:
{
  "id": 1,
  "email": "admin@parkup.com",
  "token": "jwt_token_here",
  "roles": ["ROLE_ADMIN", "ROLE_USER"]
}
```

### Get User Response

```json
GET /api/v1/users/{userId}
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "email": "admin@parkup.com",
  "name": "Admin User",
  "roles": ["ROLE_ADMIN", "ROLE_USER"],
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

## Additional Test Users (Optional)

### Moderator (Future Role)

```
Email: moderator@parkup.com
Password: Moderator123!
Roles: ROLE_MODERATOR, ROLE_USER
```

### Inactive User

```
Email: inactive@parkup.com
Password: Inactive123!
Roles: ROLE_USER
Status: INACTIVE
```

### Blocked User

```
Email: blocked@parkup.com
Password: Blocked123!
Roles: ROLE_USER
Status: BLOCKED
```

---

## Notes

- Password requirements may vary based on backend validation
- Roles are case-sensitive: use `ROLE_ADMIN` not `role_admin`
- A user can have multiple roles
- The frontend prioritizes admin role over user role
- Token expiration handled by backend
- Sessions stored in httpOnly cookies for security

---

## Contact

For issues with test users or role-based access control, refer to:
- [Role-Based Access Control Documentation](./ROLE_BASED_ACCESS.md)
- Backend API documentation
- System administrator