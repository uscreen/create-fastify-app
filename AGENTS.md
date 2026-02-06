# Agent Guidelines for create-fastify-app

This document provides guidelines for AI coding agents working on this codebase.

## Project Overview

This is a CLI tool (`create-fastify-app`) that bootstraps new Fastify applications with a predefined skeleton structure. It uses ESM modules, pnpm package manager, and follows the @uscreen.de conventions.

## Build, Lint, and Test Commands

### Linting
```bash
pnpm lint              # Run ESLint with auto-fix
```

### Testing
```bash
pnpm test              # Run all tests with spec reporter
pnpm test:cov          # Run tests with HTML and text coverage reports
pnpm test:ci           # Run tests with lcov coverage for CI

# Run a single test file
node --test --test-reporter spec ./test/cli.test.js
```

### Testing Notes
- Uses Node.js built-in test runner (node:test)
- Test files use `.test.js` suffix
- Tests are located in `./test/` directory
- Coverage tool: c8
- Test framework: node:test with assert/strict

## Code Style Guidelines

### Module System
- **ESM only**: Use `import`/`export` syntax
- File extension: `.js` (with `"type": "module"` in package.json)
- Use `import.meta.url` for current file path
- Use `createRequire` from 'module' when needing require functionality

### Imports
```javascript
// Node.js built-ins
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'path'
import { fileURLToPath } from 'url'

// Third-party packages
import fs from 'fs-extra'
import { program } from 'commander'

// Local modules
import { before, after, cli } from './setup.js'
```

**Import order:**
1. Node.js built-in modules (prefer `node:` prefix for core modules)
2. Third-party packages
3. Local modules (always include `.js` extension)

### Formatting
- **Indentation**: 2 spaces (no tabs, except in Makefiles)
- **Quotes**: Single quotes for strings
- **Semicolons**: Not required but used in some files
- **Line endings**: LF (Unix-style)
- **Trailing whitespace**: Remove
- **Final newline**: Required
- **Charset**: UTF-8

### Naming Conventions
- **Files**: kebab-case (e.g., `cli.test.js`, `setup.js`)
- **Variables/Functions**: camelCase (e.g., `ensurePath`, `initializePnpm`)
- **Constants**: camelCase or UPPER_CASE for true constants
- **Async functions**: Use `async/await` pattern

### Functions
```javascript
// Named function expressions for exports
export default (app, opts, next) => {
  // route handler
  next()
}

// Arrow functions for callbacks
const cli = (args) => {
  return new Promise((resolve) => {
    // implementation
  })
}

// Async/await for asynchronous operations
const addPackageConfig = (path, skelPath) => {
  // sync operations returning promise
  return writePackage(pack.path, pack.packageJson)
}
```

### Error Handling
- Use Promises and async/await
- Propagate errors naturally
- Use `assert` from `node:assert/strict` in tests
- Test error conditions explicitly
```javascript
// Promise-based error handling
const initializePnpm = (path) =>
  new Promise((resolve, reject) => {
    const pnpm = spawn('pnpm', ['init'], { cwd: path, stdio: [0, 1, 2] })
    pnpm.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })
```

### Comments
- Use JSDoc-style comments for functions
```javascript
/**
 * ensure path of new app
 */
const ensurePath = (path) => fs.ensureDir(path)

/**
 * post-treatment
 */
server.ready((err) => {
  if (err) {
    throw err
  }
  // implementation
})
```

### Testing Patterns
```javascript
import test from 'node:test'
import assert from 'node:assert/strict'

// Setup/teardown hooks
test.before(before)
test.after(after)

// Basic test
test('description', async (t) => {
  // test implementation
  assert.equal(expected, actual, 'message')
})

// Nested tests
test('parent test', async (t) => {
  await t.test('nested test', (t, done) => {
    // test implementation
    done()
  })
})
```

### File Structure
```
/
├── bin/           # CLI entry points
├── skeleton/      # Template files for new apps
│   ├── app/       # App skeleton
│   └── test/      # Test skeleton
└── test/          # CLI tool tests
```

### Dependencies
- **Runtime**: Use dependencies that support ESM
- **Dev tools**: ESLint with @uscreen.de/eslint-config-prettystandard-node
- **Package manager**: pnpm (version specified in packageManager field)

### Best Practices
1. Always include file extensions in imports (`.js`)
2. Use `node:` prefix for Node.js core modules in new code
3. Prefer `fs-extra` over native `fs` for file operations
4. Use `path.resolve()` and `path.join()` for cross-platform paths
5. Avoid deprecated Node.js APIs
6. Keep functions small and focused
7. Export functions that can be tested independently
8. Use descriptive variable and function names
9. Handle graceful shutdowns (SIGINT, SIGTERM)
10. Use `assert.ok()` for truthy checks, `assert.equal()` for equality

### ESLint Configuration
- Extends: `@uscreen.de/eslint-config-prettystandard-node`
- Config file: `.eslintrc.cjs` (CommonJS format for ESLint config)

### Git Conventions
- No specific commit message format enforced
- Standard .gitignore for Node.js projects
- Coverage directory is ignored

## Architecture Notes

### CLI Tool (`bin/cli.js`)
- Uses `commander` for CLI argument parsing
- Creates new apps by: ensuring path → init pnpm → configure package.json → copy skeleton → copy .env
- Entry point: `create-fastify-app <name>`

### Skeleton Structure
- Template application using `@uscreen.de/fastify-app`
- Uses `fastify-plugin` for plugin registration
- Config via `env-schema` with dotenv support
- Autoloads plugins and services from configured directories
- Includes example noop service and plugin

## Additional Notes for Agents

- This is a **monorepo-friendly** tool - generated apps are designed to work within monorepos
- Uses **pnpm** exclusively (no npm/yarn)
- Generated apps support Swagger docs and health check routes
- Test files should use the built-in Node.js test runner, not third-party frameworks
- When modifying the skeleton, remember it affects all newly generated apps
