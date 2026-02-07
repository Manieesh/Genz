# Code Review Agent Documentation

Welcome to the Code Review Agent documentation. This guide will help you understand, set up, and use the application.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](./GETTING_STARTED.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Features](./FEATURES.md)
- [API Reference](./API.md)
- [Development Guide](./DEVELOPMENT.md)

## Project Overview

Code Review Agent is an AI-powered code review application that helps you find bugs, security issues, and performance problems in your code automatically. The application provides:

- **Security Scanning** - Detect potential security vulnerabilities
- **Performance Analysis** - Identify performance bottlenecks
- **Transparent AI** - Understand how the AI makes decisions

## Quick Start

1. **Clone or download the project**
2. **Install dependencies**: `npm install` or `bun install`
3. **Start development server**: `npm run dev`
4. **Open in browser**: `http://localhost:8081`

For detailed setup instructions, see [Getting Started](./GETTING_STARTED.md).

## Key Features

- AI-powered code analysis
- Support for multiple programming languages (JS, TS, Python, Java, C++, Go, Rust, Ruby)
- Code history tracking
- Configurable analysis settings
- Responsive UI with dark theme

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Form Handling**: React Hook Form
- **Testing**: Vitest
- **Package Manager**: Bun (or npm)

## Project Structure

```
src/
├── components/     # React components (UI, layout, common)
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── data/          # Mock data
├── test/          # Test files
```

See [Project Structure](./PROJECT_STRUCTURE.md) for more details.

## Development

- **Development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Run tests**: `npm run test`
- **Watch tests**: `npm run test:watch`
- **Lint code**: `npm run lint`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is managed through Lovable. See the main README.md for more information.
