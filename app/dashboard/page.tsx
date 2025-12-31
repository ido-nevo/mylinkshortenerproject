import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserLinks } from '@/data/links';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateLinkDialog } from './CreateLinkDialog';
import { EditLinkDialog } from './EditLinkDialog';
import { DeleteLinkDialog } from './DeleteLinkDialog';
import { Pencil, Trash2 } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const links = await getUserLinks(userId);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your shortened links
          </p>
        </div>
        <CreateLinkDialog />
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No links yet. Create your first shortened link!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="font-mono text-primary">
                        /{link.shortCode}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2 break-all">
                      {link.url}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </Badge>
                    <EditLinkDialog link={link}>
                      <Button variant="ghost" size="icon" title="Edit link">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </EditLinkDialog>
                    <DeleteLinkDialog link={link}>
                      <Button variant="ghost" size="icon" title="Delete link">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteLinkDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
