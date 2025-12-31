---
description: Read this before implementing or modifying authentication in the project.
---

# Authentication Guide

This guide covers authentication implementation using Clerk in the link shortener project.

## Core Principle

**Use Clerk exclusively for all authentication.** Do not implement custom auth, JWT handling, or any other authentication methods.

## Authentication Rules

### 1. Protected Routes

The `/dashboard` route and any user-specific pages MUST be protected:

```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  
  // Page content
}
```

### 2. Homepage Redirect

If a logged-in user accesses the homepage, redirect them to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');
  
  // Public homepage content
}
```

### 3. Modal Authentication

Sign in and sign out MUST use Clerk modals, not separate pages:

```typescript
// For sign-in buttons
import { SignInButton } from '@clerk/nextjs';

<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>
```

```typescript
// For sign-out buttons
import { SignOutButton } from '@clerk/nextjs';

<SignOutButton>
  <Button>Sign Out</Button>
</SignOutButton>
```

## Common Patterns

### Server-Side Auth Check

```typescript
import { auth } from '@clerk/nextjs/server';

export default async function ProtectedPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // User is authenticated
}
```

### Client-Side Auth State

```typescript
"use client";

import { useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return null;
  
  return <div>Hello, {user.firstName}</div>;
}
```

### Middleware for Route Protection

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/links(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### Server Actions with Auth

```typescript
"use server";

import { auth } from '@clerk/nextjs/server';

export async function createLink(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    return { error: 'Unauthorized' };
  }
  
  // Proceed with authenticated action
}
```

### API Routes with Auth

```typescript
// app/api/links/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Return user's data
}
```

## Checklist

When implementing authenticated features:

- [ ] Server Components use `auth()` from `@clerk/nextjs/server`
- [ ] Client Components use `useUser()` or `useAuth()` hooks
- [ ] Protected routes check `userId` and redirect if not present
- [ ] Homepage redirects logged-in users to `/dashboard`
- [ ] Sign-in uses `<SignInButton mode="modal">`
- [ ] Sign-out uses `<SignOutButton>`
- [ ] Server Actions verify `userId` before operations
- [ ] API routes return 401 for unauthenticated requests
- [ ] User ownership verified for all data operations

## What NOT to Do

❌ **Never:**
- Create custom authentication logic
- Use JWT tokens manually
- Implement custom session management
- Use separate sign-in/sign-out pages (use modals)
- Store passwords or auth credentials
- Bypass Clerk for any auth-related feature
- Allow unauthenticated access to `/dashboard` or user data

✅ **Always:**
- Use Clerk's built-in components and hooks
- Verify `userId` exists before protected operations
- Use modal mode for sign-in/sign-out
- Redirect authenticated users from homepage
- Check authentication server-side for protected routes

## User Data Access

To access user profile information:

```typescript
import { currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) redirect('/sign-in');
  
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
```

## Environment Variables

Ensure these are configured in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

**Remember:** Clerk handles all authentication. Your job is to use Clerk's APIs correctly and protect routes appropriately.
