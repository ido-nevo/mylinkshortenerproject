"use client";

import { useState } from 'react';
import { deleteLinkAction } from './actions';
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
import type { SelectLink } from '@/db/schema';

interface DeleteLinkDialogProps {
  link: SelectLink;
  children: React.ReactNode;
}

export function DeleteLinkDialog({ link, children }: DeleteLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  async function handleDelete() {
    setIsLoading(true);
    setError('');

    const result = await deleteLinkAction({ id: link.id });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Success - close dialog
      setOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-md bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">
              Short Code: <span className="font-mono text-primary">/{link.shortCode}</span>
            </p>
            <p className="text-sm text-muted-foreground break-all">
              {link.url}
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive mt-4">{error}</p>
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
