# Development Guide

## Setting Up Your Development Environment

### IDE Setup

#### VS Code (Recommended)

1. Install recommended extensions:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)
   - ESLint
   - Prettier

2. Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "css.lint.unknownAtRules": "ignore"
}
```

### Code Style

#### TypeScript

- Use explicit type annotations for function parameters
- Prefer interfaces over types for component props
- Use strict mode in tsconfig

Example:
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

#### Tailwind CSS

- Use predefined colors from `tailwind.config.ts`
- Follow mobile-first responsive design
- Use semantic class names with modifiers

Example:
```tsx
<div className="flex flex-col gap-4 md:flex-row lg:gap-6">
  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
    Click me
  </button>
</div>
```

#### Component Organization

```tsx
// Imports
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Types
interface MyComponentProps {
  title: string;
}

// Component
export default function MyComponent({ title }: MyComponentProps) {
  const [state, setState] = useState(false);
  
  return (
    <div className="p-4">
      <h1>{title}</h1>
      <Button onClick={() => setState(!state)}>Toggle</Button>
    </div>
  );
}
```

## Common Development Tasks

### Adding a New Page

1. Create page component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/TopNav.tsx`

Example page structure:
```tsx
import { PageLayout } from '@/components/layout/PageLayout';

export default function YourPage() {
  return (
    <PageLayout title="Your Page">
      <div className="space-y-4">
        {/* Content here */}
      </div>
    </PageLayout>
  );
}
```

### Adding a New Component

1. Decide category: `common`, `layout`, or `ui`
2. Create file: `src/components/{category}/YourComponent.tsx`
3. Export component
4. Use in other components

### Using Form Validation

With React Hook Form and Zod:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

### Managing State

Use React hooks for local state:
```tsx
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

For complex state, consider Context API or React Query.

### Working with Icons

Using lucide-react:

```tsx
import { ChevronDown, Settings, Home } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="flex gap-4">
      <Home size={24} />
      <Settings size={24} />
      <ChevronDown size={24} />
    </nav>
  );
}
```

## Testing

### Running Tests

```bash
# Run tests once
npm run test

# Watch mode
npm run test:watch
```

### Writing Tests

Example test structure:
```ts
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should return expected value', () => {
    const result = myFunction(5);
    expect(result).toBe(10);
  });

  it('should handle edge cases', () => {
    expect(myFunction(0)).toBe(0);
  });
});
```

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. React DevTools extension for React debugging
3. Use `debugger` keyword in code

```tsx
export default function MyComponent() {
  debugger; // Pauses execution here
  return <div>Content</div>;
}
```

### Console Logging

```tsx
console.log('Debug value:', variable);
console.warn('Warning message');
console.error('Error message');
```

### Network Requests

Use React Query DevTools:
```tsx
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Performance Tips

### Code Splitting

Import components lazily:
```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('@/components/Heavy'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization

Prevent unnecessary re-renders:
```tsx
import { memo } from 'react';

interface ItemProps {
  name: string;
}

const Item = memo(function Item({ name }: ItemProps) {
  return <div>{name}</div>;
});
```

### Image Optimization

```tsx
<img 
  src="/image.jpg" 
  alt="Description"
  loading="lazy"
  width={400}
  height={300}
/>
```

## Building for Production

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Build in development mode (unminified)
npm run build:dev
```

Check the `dist/` folder for the compiled output.

## Troubleshooting

### Hot Reload Not Working
```bash
npm run dev
# Press 'h + enter' for help
```

### TypeScript Errors

Run type check:
```bash
npx tsc --noEmit
```

### Import Path Issues

Check `tsconfig.json` for path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Module Not Found

1. Check file path is correct
2. Verify file is exported properly
3. Clear node_modules: `rm -rf node_modules && npm install`

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
