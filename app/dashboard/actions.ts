"use server";

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createLink, checkShortCodeExists, updateLink, deleteLink } from '@/data/links';

// Validation schema
const CreateLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(20, 'Short code must be at most 20 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Short code can only contain letters, numbers, hyphens, and underscores'),
});

const UpdateLinkSchema = z.object({
  id: z.number(),
  url: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(20, 'Short code must be at most 20 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Short code can only contain letters, numbers, hyphens, and underscores'),
});

const DeleteLinkSchema = z.object({
  id: z.number(),
});

// TypeScript types
type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;
type DeleteLinkInput = z.infer<typeof DeleteLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  // Step 1: Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Step 2: Validate input
  const validationResult = CreateLinkSchema.safeParse(input);
  if (!validationResult.success) {
    return { 
      error: 'Invalid input', 
      details: validationResult.error.flatten().fieldErrors 
    };
  }

  const validData = validationResult.data;

  // Step 3: Check if short code already exists
  const exists = await checkShortCodeExists(validData.shortCode);
  if (exists) {
    return { 
      error: 'Short code already exists',
      details: { shortCode: ['This short code is already taken'] }
    };
  }

  // Step 4: Create the link
  try {
    const link = await createLink({
      userId,
      url: validData.url,
      shortCode: validData.shortCode,
    });

    revalidatePath('/dashboard');
    return { success: true, data: link };
  } catch (error) {
    console.error('Failed to create link:', error);
    return { error: 'Failed to create link. Please try again.' };
  }
}

export async function updateLinkAction(input: UpdateLinkInput) {
  // Step 1: Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Step 2: Validate input
  const validationResult = UpdateLinkSchema.safeParse(input);
  if (!validationResult.success) {
    return { 
      error: 'Invalid input', 
      details: validationResult.error.flatten().fieldErrors 
    };
  }

  const validData = validationResult.data;

  // Step 3: Check if short code already exists (excluding current link)
  const exists = await checkShortCodeExists(validData.shortCode, validData.id);
  if (exists) {
    return { 
      error: 'Short code already exists',
      details: { shortCode: ['This short code is already taken'] }
    };
  }

  // Step 4: Update the link
  try {
    const link = await updateLink(validData.id, userId, {
      url: validData.url,
      shortCode: validData.shortCode,
    });

    if (!link) {
      return { error: 'Link not found or you do not have permission to edit it' };
    }

    revalidatePath('/dashboard');
    return { success: true, data: link };
  } catch (error) {
    console.error('Failed to update link:', error);
    return { error: 'Failed to update link. Please try again.' };
  }
}

export async function deleteLinkAction(input: DeleteLinkInput) {
  // Step 1: Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Step 2: Validate input
  const validationResult = DeleteLinkSchema.safeParse(input);
  if (!validationResult.success) {
    return { error: 'Invalid input' };
  }

  const validData = validationResult.data;

  // Step 3: Delete the link
  try {
    const link = await deleteLink(validData.id, userId);

    if (!link) {
      return { error: 'Link not found or you do not have permission to delete it' };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete link:', error);
    return { error: 'Failed to delete link. Please try again.' };
  }
}
