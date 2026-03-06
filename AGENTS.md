# Agent Guidelines for create-fastify-app

This document provides guidelines for AI coding agents working on this codebase.

## Project Overview

A CLI tool (`create-fastify-app`) that bootstraps new Fastify applications with a predefined skeleton structure. Uses ESM modules, pnpm package manager, and follows @uscreen.de conventions. The sole source file is `bin/cli.js`; the `skeleton/` directory contains the template files copied into new projects.

## Build, Lint, and Test Commands

```bash
pnpm lint              # Run ESLint (check only, no auto-fix)
pnpm lint:fix          # Run ESLint with auto-fix
pnpm test              # Run all tests with spec reporter
pnpm test:cov          # Run tests with HTML and text coverage reports
pnpm test:ci           # Run tests with lcov coverage for CI

# Run a single test file
node --test --test-reporter spec ./test/cli.test.js
```

- Uses **Node.js built-in test runner** (`node:test`) — not Jest, Mocha, or any third-party framework
- Test files use `.test.js` suffix and live in `./test/`
- Coverage via `c8`; assertions via `node:assert/strict`

## Code Style Guidelines

### ESLint Configuration

Uses **`@antfu/eslint-config`** with ESLint v9 flat config (`eslint.config.js`):

- **No trailing commas** (`comma-dangle: never`)
- **No semicolons** (antfu default)
- **Arrow functions allowed at top level** (`antfu/top-level-function: off`)
- **`console` calls allowed** (`no-console: off`) — this is a CLI tool
- `skeleton/` directory is excluded from linting
- Formatters enabled via `eslint-plugin-format`

### Module System

- **ESM only** (`"type": "module"` in package.json)
- File extension: `.js`
- Use `import.meta.url` for current file path
- Use `createRequire` from `node:module` when `require()` is needed (e.g., reading JSON)

### Import Order

```javascript
// 1. Node.js built-ins (use node: prefix)
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// 2. Third-party packages
import { program } from 'commander'
import fs from 'fs-extra'
import { readPackageUpSync } from 'read-package-up'

// 3. Local modules (always include .js extension)
import { after, before, cli } from './setup.js'
```

### Formatting

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: None (enforced by antfu config)
- **Trailing commas**: None (enforced by eslint rule)
- **Line endings**: LF
- **Final newline**: Required
- **Charset**: UTF-8

### Naming Conventions

- **Files**: kebab-case (`cli.test.js`, `setup.js`)
- **Variables/Functions**: camelCase (`ensurePath`, `initializePnpm`)
- **Constants**: camelCase or UPPER_CASE for true constants

### Functions and Error Handling

Prefer arrow functions. Use `async/await` for asynchronous operations. Use JSDoc-style block comments above functions. Propagate errors naturally via Promises:

```javascript
/**
 * ensure path of new app
 */
const ensurePath = path => fs.ensureDir(path)

/**
 * init new pnpm project
 */
const initializePnpm = path =>
  new Promise((resolve, reject) => {
    const pnpm = spawn('pnpm', ['init'], { cwd: path, stdio: [0, 1, 2] })
    pnpm.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })
```

### Testing Patterns

```javascript
import assert from 'node:assert/strict'
import test from 'node:test'
import { after, before, cli } from './setup.js'

test.before(before)   // creates temp _arena/ directory
test.after(after)     // removes temp _arena/ directory

test('basic test', async () => {
  const result = await cli(['--version'])
  assert.equal(true, result.stdout.startsWith(version))
})

test('nested tests', async (t) => {
  await t.test('sub-test', (t, done) => {
    assert.ok(true, 'message')
    done()
  })
})
```

## File Structure

```
bin/cli.js            # CLI entry point (sole source file)
skeleton/             # Template files copied to new projects
  package.json        # Template dependencies and scripts
  .env.example        # Example env file (also copied as .env)
  app/                # Application code template
    server.js, app.js, config.js, schemas.js
    plugins/noop.js, services/noop.js
  test/               # Test template for generated apps
test/                 # Tests for the CLI tool itself
  cli.test.js         # CLI integration tests
  setup.js            # Test helpers (arena dir, cli runner)
eslint.config.js      # ESLint v9 flat config
```

## Architecture

The CLI (`bin/cli.js`) creates new apps in five sequential steps:

1. **ensurePath** — create target directory via `fs.ensureDir`
2. **initializePnpm** — run `pnpm init` in the new directory
3. **addPackageConfig** — merge skeleton's package.json fields into the new package.json
4. **copySkeleton** — copy skeleton files to target (no overwrite)
5. **copyEnv** — copy `.env.example` as `.env`

## Key Constraints

- **pnpm only** — no npm or yarn
- **Node.js 20+** (CI tests on 20, 22, 24)
- Skeleton files are not linted (excluded in eslint config)
- When modifying skeleton files, remember they affect all newly generated apps
- Prefer `fs-extra` over native `fs` for file operations
- Always include `.js` extension in local imports
- Use `node:` prefix for Node.js core module imports
