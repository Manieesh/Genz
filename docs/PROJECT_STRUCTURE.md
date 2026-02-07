# Project Structure

## Overview

```
Gen z/
├── public/                 # Static assets
│   ├── robots.txt
│   └── placeholder.svg
├── src/                    # Source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and helpers
│   ├── data/              # Mock data
│   ├── test/              # Test files
│   ├── App.tsx            # App root component
│   ├── main.tsx           # React entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite environment types
├── docs/                  # Documentation (this folder)
├── index.html             # HTML entry point
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── vitest.config.ts       # Vitest configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.js       # ESLint configuration
├── components.json        # shadcn/ui configuration
├── package.json           # Dependencies and scripts
├── bun.lockb             # Bun lock file (if using Bun)
└── README.md             # Main project README
```

## Directories

### `/src/components`

All React components organized by feature:

- **`layout/`** - Layout components for page structure
  - `AppLayout.tsx` - Main app wrapper
  - `PageLayout.tsx` - Page container
  - `TopNav.tsx` - Top navigation bar

- **`common/`** - Reusable components
  - `CodeBlock.tsx` - Display code with syntax highlighting
  - `SeverityBadge.tsx` - Severity indicator badge
  - `StatCard.tsx` - Statistics card component

- **`ui/`** - UI primitives from shadcn/ui
  - Form controls (input, button, select, etc.)
  - Layout components (card, dialog, sheet, etc.)
  - Data display (table, accordion, etc.)
  - Navigation (breadcrumb, pagination, etc.)

### `/src/pages`

Page components for routing:

- `Home.tsx` - Main analysis page with file upload
- `History.tsx` - View past analyses
- `Results.tsx` - Display analysis results
- `Settings.tsx` - Application settings
- `NotFound.tsx` - 404 error page

### `/src/hooks`

Custom React hooks:

- `use-mobile.tsx` - Detect mobile viewport
- `use-toast.ts` - Toast notification system

### `/src/lib`

Utility functions:

- `utils.ts` - Class merging and other helpers

### `/src/data`

Mock data:

- `mockData.ts` - Sample analysis data for development

### `/src/test`

Test files:

- `example.test.ts` - Example test
- `setup.ts` - Vitest setup configuration

## Key Files

### Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.ts` | Vite bundler configuration |
| `vitest.config.ts` | Test runner configuration |
| `tailwind.config.ts` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS plugins |
| `eslint.config.js` | Linting rules |
| `components.json` | shadcn/ui component registry |

### Entry Points

| File | Purpose |
|------|---------|
| `index.html` | HTML document root |
| `src/main.tsx` | React application bootstrap |
| `src/App.tsx` | Root React component |

## Component Architecture

### Layout Structure

```
AppLayout (main wrapper)
└── TopNav (navigation)
    └── PageLayout (page container)
        └── Page component (Home, History, Settings, etc.)
```

### Data Flow

1. Pages import and use hooks
2. Hooks manage state and fetch data
3. Components receive props and render
4. UI components from `src/components/ui` are reusable primitives

## Styling Approach

- **Tailwind CSS** for utility-based styling
- **CSS Modules** optional (using `.module.css`)
- Global styles in `src/index.css`
- Component-specific styles inline with Tailwind classes

## Dependencies

### Frontend Libraries
- `react` - UI framework
- `react-router-dom` - Routing
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation

### UI & Styling
- `tailwindcss` - Utility CSS framework
- `@radix-ui/*` - Accessible UI primitives
- `class-variance-authority` - CSS class utilities
- `clsx` - Conditional class names

### Utilities
- `date-fns` - Date manipulation
- `lucide-react` - Icon library
- `framer-motion` - Animation library
- `tanstack/react-query` - Data fetching

### Development
- `typescript` - Type safety
- `vite` - Build tool
- `vitest` - Test runner
- `eslint` - Code linting

## Adding New Components

1. Create component in appropriate folder (`components/common`, `components/ui`, `components/layout`, or `pages`)
2. Use TypeScript for type safety
3. Use Tailwind classes for styling
4. Import shadcn/ui components from `src/components/ui`
5. Export component at bottom of file

Example:
```tsx
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div className="flex items-center gap-2">
      <h1>{title}</h1>
      <Button onClick={onClick}>Click me</Button>
    </div>
  );
}
```
