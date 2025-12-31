"use client";

import { useState } from 'react';
import { updateLinkAction } from './actions';
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
import type { SelectLink } from '@/db/schema';

interface EditLinkDialogProps {
  link: SelectLink;
  children: React.ReactNode;
}

export function EditLinkDialog({ link, children }: EditLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    url?: string[];
    shortCode?: string[];
  }>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [formData, setFormData] = useState({
    url: link.url,
    shortCode: link.shortCode,
  });

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (newOpen) {
      // Reset form when opening
      setFormData({
        url: link.url,
        shortCode: link.shortCode,
      });
      setErrors({});
      setGeneralError('');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    const result = await updateLinkAction({
      id: link.id,
      url: formData.url,
      shortCode: formData.shortCode,
    });

    if (result.error) {
      if (result.details) {
        setErrors(result.details);
      } else {
        setGeneralError(result.error);
      }
      setIsLoading(false);
    } else {
      // Success - close dialog
      setOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the URL or short code for this link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">Destination URL</Label>
              <Input
                id="edit-url"
                name="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/very/long/url"
                required
                disabled={isLoading}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shortCode">Short Code</Label>
              <Input
                id="edit-shortCode"
                name="shortCode"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                placeholder="my-link"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                3-20 characters: letters, numbers, hyphens, and underscores only
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
