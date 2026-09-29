# Operit TypeScript Project

This is a TypeScript + pnpm project created with Operit.

## Quick Start

### 1. Install dependencies
```bash
Click the "pnpm install" button
```

### 2. Development mode (live compilation)
```bash
Click the "tsc watch" button
# TypeScript will automatically watch for file changes and compile
```

### 3. Build the project
```bash
Click the "pnpm build" button
```

### 4. Run the project
```bash
Click the "pnpm start" button
Then click "Browser Preview" to see the result
```

## Project Structure

```
.
├── src/
│   └── index.ts          # TypeScript source code
├── dist/                 # Build output directory
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── .operit/config.json   # Operit workspace configuration
```

## Tech Stack

- 🔷 **TypeScript** - A type-safe superset of JavaScript
- 📦 **pnpm** - A fast, disk-space-efficient package manager
- 🟢 **Node.js** - JavaScript runtime

## Why pnpm?

- ⚡ Faster installation speed
- 💾 Saves disk space (dependencies are shared via hard links)
- 🔒 Strict dependency management
- 🎯 Compatible with npm/yarn commands

## Common Commands

- `pnpm install` - Install dependencies
- `pnpm build` - Compile the TypeScript
- `tsc watch` - Compile in watch mode
- `pnpm start` - Run the compiled code

## Development Tips

- Keep TypeScript source code in the `src/` directory
- Compiled JavaScript goes to the `dist/` directory
- Rebuild after changing code
- Use watch mode to compile automatically

Happy Coding with TypeScript! 🎉
