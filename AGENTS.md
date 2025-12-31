# Agent Instructions - Link Shortener Project

This document serves as the central guide for AI assistants (LLMs) working on this Next.js link shortener project. Following these instructions ensures code consistency, maintainability, and adherence to best practices.

## Overview

This is a modern link shortener application built with:
- **Next.js 16** with App Router
- **TypeScript** in strict mode
- **PostgreSQL** with Drizzle ORM (Neon serverless)
- **Clerk** for authentication
- **Tailwind CSS** with shadcn/ui components

## Quick Reference


### Common Patterns

#### Creating a New Page
```typescript
// app/my-page/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  
  // Fetch data directly in Server Component
  const data = await fetchData(userId);
  
  return <div>...</div>;
}
```

#### Creating a Client Component
```typescript
// components/MyComponent.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  initialValue: string;
}

export function MyComponent({ initialValue }: MyComponentProps) {
  const [value, setValue] = useState(initialValue);
  
  return <Button onClick={() => setValue('new')}>Click</Button>;
}
```

#### Database Query
```typescript
// lib/db/links.ts
import { db } from '@/db';
import { linksTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getUserLinks(userId: string) {
  return await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId));
}
```

#### Server Action
```typescript
// lib/actions/link-actions.ts
"use server";

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';

export async function createLink(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };
  
  // Validation and database operations
  
  revalidatePath('/dashboard');
  return { success: true };
}
```




## Getting Help

If you're unsure about:
- **Authentication** → See [authentication.md](docs/authentication.md)
- **UI Components** → See [ui-components.md](docs/ui-components.md)

## Project Commands

```bash
# Development
npm run dev                 # Start dev server

# Building
npm run build              # Build for production
npm start                  # Start production server

# Code Quality
npm run lint               # Run ESLint

# Database
npx drizzle-kit generate   # Generate migrations
npx drizzle-kit push       # Push schema to database
```

## Environment Variables Required

```env
# Database
DATABASE_URL=              # PostgreSQL connection string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

---


