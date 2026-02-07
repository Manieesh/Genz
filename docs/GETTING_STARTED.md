# Getting Started

## Prerequisites

- Node.js 16+ or Bun runtime
- npm or Bun package manager
- Git (optional, for version control)

## Installation

### Step 1: Set Up the Project

```bash
# Navigate to the project directory
cd "path/to/Gen z"

# Install dependencies
npm install
# or if using Bun
bun install
```

### Step 2: Start the Development Server

```bash
npm run dev
# or
bun run dev
```

You should see output like:
```
VITE v5.4.19 ready in 319 ms

➜  Local:   http://localhost:8081/
➜  Network: http://10.65.13.250:8081/
```

### Step 3: Open in Browser

Navigate to `http://localhost:8081/` in your web browser.

## Available Scripts

### Development
```bash
npm run dev        # Start development server with hot reload
```

### Building
```bash
npm run build      # Build for production
npm run build:dev  # Build in development mode
npm run preview    # Preview production build locally
```

### Testing
```bash
npm run test       # Run tests once
npm run test:watch # Run tests in watch mode
```

### Code Quality
```bash
npm run lint       # Lint code with ESLint
```

## Project Pages

Once running, you can access:

- **Home** (`/`) - Main upload and analysis page
- **History** (`/history`) - View previous analyses
- **Settings** (`/settings`) - Configure application settings

## Supported File Types

The Code Review Agent supports analysis for:
- JavaScript/TypeScript (.js, .ts)
- Python (.py)
- Java (.java)
- C++ (.cpp, .cc, .cxx)
- Go (.go)
- Rust (.rs)
- Ruby (.rb)

Maximum file size: 5MB

## Troubleshooting

### Port Already in Use
If port 8081 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# Or use Bun
bun install
```

### Hot Reload Not Working
Try restarting the dev server:
```bash
# Stop the server (Ctrl+C)
# Restart
npm run dev
```

## Next Steps

- Read [Project Structure](./PROJECT_STRUCTURE.md) to understand the codebase
- Check [Features](./FEATURES.md) for a detailed feature overview
- See [Development Guide](./DEVELOPMENT.md) for development tips
