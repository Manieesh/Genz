# Quick Reference

## Setup & Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:8081
```

## npm Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint code with ESLint |

## Directory Structure

```
src/
├── components/     # React components
│   ├── common/     # Reusable components
│   ├── layout/     # Layout components
│   └── ui/         # UI primitives
├── pages/          # Page components  
├── hooks/          # Custom hooks
├── lib/            # Utilities
├── data/           # Mock data
└── test/           # Tests
```

## Keyboard Shortcuts

### Development Server

| Key | Action |
|-----|--------|
| `h + Enter` | Show help |
| `r` | Restart server |
| `u` | Show file updates |
| `c` | Clear console |
| `q` | Quit server |

### Browser DevTools

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools |
| `Ctrl+Shift+I` | Open Inspector |
| `Ctrl+Shift+C` | Element selector |
| `Ctrl+Shift+J` | Open Console |

## File Upload Requirements

- **Supported Languages**: JS, TS, Python, Java, C++, Go, Rust, Ruby
- **Max File Size**: 5MB
- **Clear Format**: Single file per upload

## Issue Severity Levels

| Level | Color | Meaning |
|-------|-------|---------|
| Critical | 🔴 Red | Must fix immediately |
| High | 🟠 Orange | Should fix soon |
| Medium | 🟡 Yellow | Should fix before production |
| Low | 🟢 Green | Nice to fix |

## Common Development Patterns

### Creating a New Page

```tsx
// src/pages/MyPage.tsx
import PageLayout from '@/components/layout/PageLayout';

export default function MyPage() {
  return (
    <PageLayout title="My Page">
      {/* Content */}
    </PageLayout>
  );
}
```

### Creating a Component

```tsx
// src/components/common/MyComponent.tsx
interface MyComponentProps {
  label: string;
}

export default function MyComponent({ label }: MyComponentProps) {
  return <div>{label}</div>;
}
```

### Using State

```tsx
import { useState } from 'react';

const [count, setCount] = useState(0);
```

### Using Effects

```tsx
import { useEffect } from 'react';

useEffect(() => {
  console.log('Effect runs');
}, [dependency]);
```

## File Icons (lucide-react)

```tsx
import { Home, Settings, History, ChevronDown } from 'lucide-react';
```

[Browse more icons →](https://lucide.dev)

## Tailwind Classes

### Common Classes

```tsx
// Layout
flex, grid, block, inline, float

// Spacing
m-4 (margin), p-4 (padding), gap-4, space-y-4

// Sizing
w-full, h-screen, max-w-6xl

// Colors
bg-primary, text-white, border-gray-200

// Responsive
sm:(breakpoint), md:(breakpoint), lg:(breakpoint)

// Effects
rounded-md, shadow-lg, hover:bg-gray-100
```

## Component Usage

### Button

```tsx
import { Button } from '@/components/ui/button';

<Button onClick={() => {}}>Click</Button>
```

### Card

```tsx
import { Card } from '@/components/ui/card';

<Card><Card.Header>Title</Card.Header></Card>
```

### Dialog

```tsx
import { Dialog } from '@/components/ui/dialog';

<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>Content</Dialog.Content>
</Dialog>
```

### Form

```tsx
import { useForm } from 'react-hook-form';

const { register, watch, handleSubmit } = useForm();
```

## Debugging Tips

```tsx
// Log to console
console.log('Debug:', variable);

// Pause execution
debugger;

// Check type
console.log(typeof variable);

// Check array/object
console.table(array);
```

## Performance Tips

- Use `React.memo()` to prevent re-renders
- Use `useCallback` for memoized functions
- Use `useMemo` for expensive calculations
- Lazy load components with `React.lazy()`

## Useful Links

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite Docs](https://vitejs.dev)
- [Vitest Docs](https://vitest.dev)

## Package Managers

### npm

```bash
npm install  # Install dependencies
npm run <script>  # Run script
npm uninstall <package>  # Remove package
```

### Bun (faster alternative)

```bash
bun install
bun run <script>
bun remove <package>
```

## Project Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Upload and analyze code |
| History | `/history` | View past analyses |
| Settings | `/settings` | Configure app |

## Environment Setup

Check workspace structure:
```bash
ls -la

# On Windows with PowerShell
Get-ChildItem
```

View current directory:
```bash
pwd  # Unix-like
echo %cd%  # Windows cmd
$PWD  # Windows PowerShell
```

## Troubleshooting Checklist

- [ ] Dependencies installed? (`npm install`)
- [ ] Dev server running? (`npm run dev`)
- [ ] Correct port? (8081)
- [ ] TypeScript errors? (`npx tsc --noEmit`)
- [ ] ESLint issues? (`npm run lint`)
- [ ] Hot reload working? (Try `r` in terminal)
- [ ] Browser cache cleared? (Hard refresh: Ctrl+Shift+R)
- [ ] node_modules clean? (`rm -rf node_modules && npm install`)

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

For more detailed information, see:
- [Getting Started](./GETTING_STARTED.md)
- [Development Guide](./DEVELOPMENT.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Features](./FEATURES.md)
- [API Reference](./API.md)
