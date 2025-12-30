# UI Components Guide

This guide covers UI component usage with shadcn/ui in the link shortener project.

## Core Principle

**Use shadcn/ui components exclusively for all UI elements.** Do not create custom UI components from scratch. Always leverage the shadcn/ui library.

## Component Rules

### 1. Never Create Custom Components

❌ **Don't create custom UI components:**
```typescript
// DON'T DO THIS
export function CustomButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 bg-blue-500 rounded">
      {children}
    </button>
  );
}
```

✅ **Use shadcn/ui components:**
```typescript
// DO THIS
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return <Button>Click Me</Button>;
}
```

### 2. Installing New Components

When you need a shadcn/ui component that isn't installed yet:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components are automatically added to `@/components/ui/` and configured with the project's theme.

### 3. Component Customization

Customize shadcn/ui components using Tailwind utility classes and variants:

```typescript
import { Button } from '@/components/ui/button';

// Using variants
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>

// Adding custom styles
<Button className="w-full">Full Width</Button>
```

## Common Components

### Button
```typescript
import { Button } from '@/components/ui/button';

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Card
```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input
```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="url">URL</Label>
  <Input id="url" type="url" placeholder="https://example.com" />
</div>
```

### Dialog (Modal)
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Form
```typescript
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const form = useForm();

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>URL</FormLabel>
          <FormControl>
            <Input placeholder="https://example.com" {...field} />
          </FormControl>
          <FormDescription>Enter the URL to shorten</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Alert
```typescript
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

<Alert>
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Your link has been created.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

### Table
```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableCaption>A list of your recent links</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Short URL</TableHead>
      <TableHead>Destination</TableHead>
      <TableHead>Clicks</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>abc123</TableCell>
      <TableCell>https://example.com</TableCell>
      <TableCell>42</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Best Practices

### 1. Composition Over Creation
Build complex UIs by composing shadcn/ui components, not by creating new ones.

### 2. Use Tailwind for Layout
Use Tailwind utility classes for spacing, layout, and responsive design:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### 3. Consistent Variants
Stick to shadcn/ui's built-in variants for consistency:
- Button: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`
- Alert: `default`, `destructive`

### 4. Accessibility
shadcn/ui components are built with accessibility in mind. Don't remove ARIA attributes or keyboard navigation.

## Available Components

Check which components are installed:
```bash
ls components/ui/
```

Common components you may need:
- `button` - Buttons with variants
- `card` - Content containers
- `input` - Form inputs
- `label` - Form labels
- `dialog` - Modals/dialogs
- `alert` - Alert messages
- `table` - Data tables
- `form` - Form components
- `dropdown-menu` - Dropdown menus
- `select` - Select dropdowns
- `checkbox` - Checkboxes
- `radio-group` - Radio buttons
- `textarea` - Text areas
- `badge` - Status badges
- `skeleton` - Loading skeletons
- `toast` - Toast notifications

## When You Need a Component

1. **Check if it exists**: Look in `@/components/ui/`
2. **Install if missing**: Run `npx shadcn@latest add [component-name]`
3. **Import and use**: Import from `@/components/ui/[component-name]`
4. **Never create custom**: Always use shadcn/ui

---

**Remember:** The goal is UI consistency and maintainability. shadcn/ui provides all the building blocks you need.
