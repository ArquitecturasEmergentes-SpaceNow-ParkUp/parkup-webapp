# Next.js Server Actions Redirect Documentation

## Overview

This document explains how redirects work in Next.js 16 App Router, specifically when using Server Actions.

---

## The Correct Way: Using `redirect()` in Server Actions

In Next.js App Router, the `redirect()` function from `next/navigation` is the recommended way to handle redirects from Server Actions.

### Key Points

1. **`redirect()` throws an error** - This is intentional behavior, not a bug
2. **The error is caught by Next.js** - It performs the redirect automatically
3. **Code after `redirect()` won't execute** - The function throws and exits immediately
4. **Works seamlessly with forms** - No client-side JavaScript needed

---

## Implementation Example

### Server Action (`app/actions.ts`)

```typescript
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Authenticate user
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    
    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set("session", data.token, { httpOnly: true });
    
    // Redirect based on role
    // redirect() throws - code below won't execute
    if (data.roles.includes("ROLE_ADMIN")) {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  } else {
    // Return error for client to handle
    return { error: "Invalid credentials" };
  }
}
```

### Client Component (`app/login/page.tsx`)

```typescript
"use client";

import { login } from "@/app/actions";
import { toast } from "sonner";

export default function LoginPage() {
  async function handleSubmit(formData: FormData) {
    try {
      toast.success("Logging in...");
      
      // Call server action
      const result = await login(formData);
      
      // If redirect() was called, we never reach here
      // If we do reach here, there was an error
      if (result?.error) {
        toast.error("Login failed", {
          description: result.error,
        });
      }
    } catch (error) {
      // redirect() throws an error to perform the redirect
      // This is EXPECTED behavior - don't treat it as an error
      console.log("Redirect initiated by server action");
    }
  }

  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Why `redirect()` Throws

### Technical Explanation

```typescript
// Inside Next.js source code (simplified)
export function redirect(url: string): never {
  throw new RedirectError(url, RedirectType.push);
}
```

The `redirect()` function:
1. Throws a special `RedirectError`
2. Next.js catches this error
3. Performs the redirect on the server
4. Sends a redirect response to the client

### Why This Design?

- **Ensures code doesn't continue executing** after redirect
- **Works with React Server Components** seamlessly
- **Prevents race conditions** between redirect and other operations
- **Server-side redirect** is more secure and reliable

---

## Common Mistakes

### ❌ WRONG: Treating redirect as an error

```typescript
try {
  await login(formData);
} catch (error) {
  // DON'T show error toast here!
  toast.error("Something went wrong");
}
```

### ✅ CORRECT: Understanding redirect behavior

```typescript
try {
  const result = await login(formData);
  
  // Only handle actual errors returned from the action
  if (result?.error) {
    toast.error(result.error);
  }
} catch {
  // redirect() throws - this is expected
  // No error handling needed
}
```

---

## Alternative Approaches (NOT Recommended)

### ⚠️ Client-Side Redirect with `useRouter()`

```typescript
// This works but is less efficient
const router = useRouter();

const result = await login(formData);
if (result.success) {
  router.push(result.redirectTo);
}
```

**Issues:**
- Requires extra data to be sent from server to client
- Two round trips: server action + client navigation
- Doesn't work without JavaScript
- More complex error handling

### ⚠️ Using `window.location.href`

```typescript
// This works but loses React state
window.location.href = "/dashboard";
```

**Issues:**
- Full page reload (loses React state)
- Slower than Next.js navigation
- Doesn't use React Router
- No smooth transitions

---

## Comparison: redirect() vs router.push()

| Feature | `redirect()` in Server Action | `router.push()` in Client |
|---------|------------------------------|---------------------------|
| Location | Server-side | Client-side |
| JavaScript Required | ❌ No | ✅ Yes |
| Round Trips | 1 | 2 |
| React State | Preserved | Preserved |
| SEO Friendly | ✅ Better | ✅ Good |
| Progressive Enhancement | ✅ Yes | ❌ No |
| Complexity | Low | Medium |

---

## Best Practices

### 1. Use `redirect()` for Post-Action Redirects

```typescript
export async function createPost(formData: FormData) {
  const post = await db.posts.create({
    title: formData.get("title"),
  });
  
  // Redirect after successful creation
  redirect(`/posts/${post.id}`);
}
```

### 2. Return Errors, Redirect on Success

```typescript
export async function updateProfile(formData: FormData) {
  try {
    await db.users.update(userId, data);
    redirect("/profile"); // Success
  } catch (error) {
    return { error: "Failed to update" }; // Error
  }
}
```

### 3. Don't Mix redirect() with return

```typescript
// ❌ WRONG: Code after redirect() never executes
export async function login(formData: FormData) {
  if (success) {
    redirect("/dashboard");
    return { success: true }; // This never happens!
  }
}

// ✅ CORRECT: Early return for errors
export async function login(formData: FormData) {
  if (!success) {
    return { error: "Invalid credentials" };
  }
  
  redirect("/dashboard"); // Always redirects if we get here
}
```

---

## Debugging Redirects

### Enable Debug Logs

```typescript
export async function login(formData: FormData) {
  console.log("[Server] Login attempt for:", email);
  
  if (response.ok) {
    console.log("[Server] Login successful, redirecting...");
    redirect("/dashboard");
  } else {
    console.log("[Server] Login failed");
    return { error: "Invalid credentials" };
  }
}
```

### Check Network Tab

1. Open browser DevTools → Network
2. Submit form
3. Look for redirect response:
   - Status: `303 See Other` or `307 Temporary Redirect`
   - Location header: destination URL

### Check Server Logs

```bash
# In Next.js terminal
[Server] Login attempt for: user@example.com
[Server] Login successful, redirecting...
POST /login 303 in 1.2s
GET /dashboard 200 in 50ms
```

---

## When NOT to Use redirect()

### Client-Only Navigation

If you need to navigate without calling a server action:

```typescript
"use client";
import { useRouter } from "next/navigation";

export function NavigateButton() {
  const router = useRouter();
  return <button onClick={() => router.push("/about")}>About</button>;
}
```

### Conditional Client-Side Logic

```typescript
"use client";
export function ConditionalNavigate() {
  const router = useRouter();
  
  function handleClick() {
    if (someClientSideCondition) {
      router.push("/path-a");
    } else {
      router.push("/path-b");
    }
  }
  
  return <button onClick={handleClick}>Navigate</button>;
}
```

---

## Summary

### ✅ DO:
- Use `redirect()` in Server Actions for post-action redirects
- Understand that `redirect()` throws (this is intentional)
- Return errors from Server Actions for client handling
- Log redirects for debugging

### ❌ DON'T:
- Treat `redirect()` throw as an error
- Try to execute code after `redirect()`
- Use `window.location.href` when `redirect()` works
- Mix `redirect()` with return statements

---

## References

- [Next.js redirect() Documentation](https://nextjs.org/docs/app/api-reference/functions/redirect)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [useRouter Hook](https://nextjs.org/docs/app/api-reference/functions/use-router)

---

**Last Updated:** 2024
**Next.js Version:** 16.0.0
**Router:** App Router