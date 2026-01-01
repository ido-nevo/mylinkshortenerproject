"use client";

import { useState } from 'react';
import { createLinkAction } from './actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    url?: string[];
    shortCode?: string[];
  }>({});
  const [generalError, setGeneralError] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    const shortCode = formData.get('shortCode') as string;

    const result = await createLinkAction({ 
      url, 
      ...(shortCode && { shortCode })
    });

    if (result.error) {
      if (result.details) {
        setErrors(result.details);
      } else {
        setGeneralError(result.error);
      }
      setIsLoading(false);
    } else {
      // Success - close dialog and reset form
      setOpen(false);
      setIsLoading(false);
      // Reset form will happen when dialog closes
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
          <DialogDescription>
            Enter the URL you want to shorten. Optionally choose a custom short code, or one will be generated from the domain.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                required
                disabled={isLoading}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortCode">Short Code (optional)</Label>
              <Input
                id="shortCode"
                name="shortCode"
                placeholder="my-link"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate from URL domain. Or use 3-20 characters: letters, numbers, hyphens, and underscores only
              </p>
              {errors.shortCode && (
                <p className="text-sm text-destructive">{errors.shortCode[0]}</p>
              )}
            </div>
            {generalError && (
              <p className="text-sm text-destructive">{generalError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
