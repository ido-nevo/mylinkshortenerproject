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

### Core Principles
1. **📚 READ DOCS FIRST** - ALWAYS read the relevant documentation file in `/docs` BEFORE writing any code
2. **Type Safety First** - Always use TypeScript strict mode, no `any` types
3. **Server Components Default** - Use Server Components unless interactivity is needed
4. **Path Aliases** - Always use `@/` imports, never relative paths
5. **Code Style** - Run ESLint before committing, fix all warnings
6. **Security** - Always verify user ownership for data operations

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

## 🚨 CRITICAL: Documentation Structure

**⚠️ YOU MUST READ THE RELEVANT DOCUMENTATION BEFORE WRITING CODE ⚠️**

The `/docs` directory contains detailed, project-specific guidelines for different aspects of the codebase.

**MANDATORY WORKFLOW:**
1. **STOP** - Before writing ANY code
2. **IDENTIFY** - Which documentation file applies to your task
3. **READ** - The complete documentation file thoroughly
4. **UNDERSTAND** - The patterns, examples, and requirements
5. **IMPLEMENT** - Following the documented guidelines

**Available Documentation:**
- `authentication.md` - For auth-related features (login, user data, protected routes)
- `ui-components.md` - For UI/component development (forms, layouts, interactive elements)
- More docs will be added as the project grows

**❌ NEVER generate code without reading the relevant docs first**
**✅ ALWAYS review the appropriate .md file before implementation**



## When Starting a New Task

1. **🔴 READ DOCUMENTATION FIRST** - Identify and thoroughly read the relevant file(s) in `/docs` directory
2. **Understand the requirement** - Ask clarifying questions if needed
3. **Check existing patterns** - Look at similar features in the codebase
4. **Verify you read the docs** - Seriously, did you read the documentation in step 1?
5. **Plan the implementation** - Consider Server vs Client Components
6. **Write type-safe code** - Define interfaces/types first
7. **Test the feature** - Ensure it works and handles errors
8. **Run linter** - Fix any ESLint errors/warnings

## Common Mistakes to Avoid

❌ **Don't:**
- **Skip reading the documentation in `/docs` before coding** (MOST IMPORTANT)
- Use `any` type in TypeScript
- Use relative imports like `'../../components'`
- Create Client Components unnecessarily (add `"use client"` only when needed)
- Forget to validate user authorization for data operations
- Skip error handling in API routes and Server Actions
- Use inline styles instead of Tailwind classes
- Forget to add loading and error states

✅ **Do:**
- Use explicit types with interfaces/types
- Use `@/` path aliases for imports
- Default to Server Components, use Client only when needed
- Always verify `userId` matches resource owner
- Wrap async operations in try-catch blocks
- Use Tailwind utility classes and shadcn/ui components
- Implement proper loading.tsx and error.tsx files

## File Naming Checklist

- [ ] Component files: PascalCase (e.g., `LinkCard.tsx`)
- [ ] Utility files: camelCase (e.g., `validateUrl.ts`)
- [ ] Page files: `page.tsx`
- [ ] Layout files: `layout.tsx`
- [ ] API routes: `route.ts`
- [ ] Use `@/` imports throughout

## Code Quality Checklist

- [ ] **📚 Read relevant documentation in `/docs` before coding**
- [ ] All TypeScript errors resolved
- [ ] ESLint passes with no errors/warnings
- [ ] Proper error handling implemented
- [ ] Loading states added where needed
- [ ] Authentication/authorization verified
- [ ] Database queries use parameterized queries (Drizzle handles this)
- [ ] Components are accessible (proper ARIA labels, keyboard navigation)
- [ ] Responsive design tested (mobile, tablet, desktop)

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

**Remember:** These guidelines ensure code quality, maintainability, and consistency. When in doubt, refer to the detailed documentation in `/docs` or examine existing code patterns in the project.
