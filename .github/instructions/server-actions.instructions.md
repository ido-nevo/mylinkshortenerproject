---
description: Read this before creating or modifying server actions for data mutations in the project.
---

# Server Actions Instructions

## Overview

All data mutations in this application must be performed through server actions. This ensures consistent security, validation, and data handling patterns.

## File Structure

- **File Name**: Server action files MUST be named `actions.ts`
- **Location**: Colocate in the same directory as the component that calls the actions

```
app/
  dashboard/
    page.tsx
    actions.ts          ← Server actions for dashboard
  profile/
    page.tsx
    actions.ts          ← Server actions for profile
```

## Server Action Pattern

```typescript
// app/dashboard/actions.ts
"use server";

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createLink, updateLink } from '@/data/links';

// 1. Define validation schema
const CreateLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).max(100),
  shortCode: z.string().min(3).max(20).optional(),
});

// 2. Define TypeScript types from schema
type CreateLinkInput = z.infer<typeof CreateLinkSchema>;

// 3. Server action with proper typing
export async function createLinkAction(input: CreateLinkInput) {
  // Step 1: Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Step 2: Validate input
  const validationResult = CreateLinkSchema.safeParse(input);
  if (!validationResult.success) {
    return { error: 'Invalid input', details: validationResult.error.flatten() };
  }

  const validData = validationResult.data;

  // Step 3: Database operation via helper function
  try {
    const link = await createLink({
      userId,
      url: validData.url,
      title: validData.title,
      shortCode: validData.shortCode,
    });

    revalidatePath('/dashboard');
    return { success: true, data: link };
  } catch (error) {
    return { error: 'Failed to create link' };
  }
}
```

## Client Component Usage

Server actions must be called from client components:

```typescript
// app/dashboard/CreateLinkForm.tsx
"use client";

import { useState } from 'react';
import { createLinkAction } from './actions';

export function CreateLinkForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Pass typed data, NOT FormData
    const result = await createLinkAction({
      url: formData.get('url') as string,
      title: formData.get('title') as string,
      shortCode: formData.get('shortCode') as string,
    });

    if (result.error) {
      // Handle error
    } else {
      // Handle success
    }
    
    setIsLoading(false);
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Required Steps (Checklist)

Every server action MUST follow these steps in order:

1. ✅ **Check Authentication** - Use `auth()` from Clerk
2. ✅ **Validate Input** - Use Zod schema validation
3. ✅ **Database Operation** - Call helper function from `/data` directory
4. ✅ **Revalidate Cache** - Use `revalidatePath()` if data changed
5. ✅ **Return Result** - Return `{ success, data }` or `{ error }`

## Rules

- ❌ **NO** FormData TypeScript type as server action parameter
- ❌ **NO** direct Drizzle queries in server actions
- ❌ **NO** database operations before auth check
- ❌ **NO** throwing errors - always catch and return error objects
- ✅ **YES** - Define Zod schemas for all inputs
- ✅ **YES** - Use TypeScript types inferred from Zod schemas
- ✅ **YES** - Call helper functions from `/data` directory
- ✅ **YES** - Always wrap operations in try-catch blocks
- ✅ **YES** - Return `{ success, data }` or `{ error }` objects

## Data Layer Helper Functions

Database operations are abstracted in the `/data` directory:

```typescript
// data/links.ts
import { db } from '@/db';
import { linksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createLink(input: {
  userId: string;
  url: string;
  title: string;
  shortCode?: string;
}) {
  const [link] = await db
    .insert(linksTable)
    .values({
      userId: input.userId,
      url: input.url,
      title: input.title,
      shortCode: input.shortCode,
    })
    .returning();
  
  return link;
}
```

## Common Patterns

### Multiple Operations
```typescript
export async function bulkDeleteLinksAction(input: { ids: string[] }) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const schema = z.object({ ids: z.array(z.string()) });
  const result = schema.safeParse(input);
  if (!result.success) return { error: 'Invalid input' };

  try {
    await deleteUserLinks(userId, result.data.ids);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete links' };
  }
}
```

### With Authorization Check
```typescript
export async function deleteLinkAction(input: { id: string }) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  // Verify ownership before deletion
  const link = await getLinkById(input.id);
  if (!link || link.userId !== userId) {
    return { error: 'Not found or unauthorized' };
  }

  await deleteLink(input.id);
  revalidatePath('/dashboard');
  return { success: true };
}
```

### Error Handling Pattern
```typescript
export async function updateLinkAction(input: { id: string; url: string; title: string }) {
  // Step 1: Authentication check
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Step 2: Validation
  const schema = z.object({
    id: z.string(),
    url: z.string().url(),
    title: z.string().min(1).max(100),
  });

  const validationResult = schema.safeParse(input);
  if (!validationResult.success) {
    return { 
      error: 'Invalid input', 
      details: validationResult.error.flatten() 
    };
  }

  // Step 3: Database operations wrapped in try-catch
  try {
    // Verify ownership
    const link = await getLinkById(validationResult.data.id);
    if (!link || link.userId !== userId) {
      return { error: 'Link not found or unauthorized' };
    }

    // Update link
    const updatedLink = await updateLink({
      id: validationResult.data.id,
      url: validationResult.data.url,
      title: validationResult.data.title,
    });

    revalidatePath('/dashboard');
    return { success: true, data: updatedLink };
  } catch (error) {
    // Log error for debugging (optional)
    console.error('Failed to update link:', error);
    
    // Return user-friendly error - NEVER throw
    return { error: 'Failed to update link. Please try again.' };
  }
}
```
