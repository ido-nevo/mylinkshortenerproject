import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2, Zap, BarChart3, Shield, QrCode, Globe } from 'lucide-react';

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-24 lg:py-32">
        <div className="container flex max-w-6xl flex-col items-center text-center">
          <Badge className="mb-4" variant="secondary">
            Free & Open Source
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Shorten URLs.
            <br />
            <span className="text-primary">Track Performance.</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Create short, memorable links in seconds. Track clicks, analyze traffic, and optimize your marketing campaigns with our powerful link management platform.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="text-base">
              <Link href="/sign-up">
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage links
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to help you create, track, and optimize your links
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Link2 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Custom Short Links</CardTitle>
                <CardDescription>
                  Create branded short links that are easy to remember and share across all platforms
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Track clicks, geographic data, and referral sources to understand your audience better
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Instant link generation and redirect speeds under 100ms for the best user experience
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <QrCode className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>QR Code Generation</CardTitle>
                <CardDescription>
                  Automatically generate QR codes for every short link to bridge offline and online marketing
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with 99.9% uptime guarantee and HTTPS encryption for all links
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Global Infrastructure</CardTitle>
                <CardDescription>
                  Distributed worldwide for fast redirects no matter where your users are located
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to shorten your first link?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of users who trust our platform to manage their links
          </p>
          <Button asChild size="lg" className="text-base">
            <Link href="/sign-up">
              Start Shortening Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
