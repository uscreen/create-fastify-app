# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@uscreen.de/create-fastify-app` is a `pnpm create` CLI that scaffolds a new `@uscreen.de/fastify-app` (run as `pnpm create @uscreen.de/fastify-app <name>`). It has two distinct halves that are easy to conflate:

- **`bin/cli.js`** — the entire CLI logic, a single file. This is the tool itself.
- **`skeleton/`** — template files copied verbatim into every generated app. This is _not_ part of the tool's runtime; it is product output. Its `package.json` declares the _generated_ app's deps/scripts (fastify 5, `@uscreen.de/fastify-app`, etc.), not the CLI's.

When editing, always be clear which half you're in. Changes under `skeleton/` ship to every newly created app.

## Commands

```bash
pnpm test                                              # all tests, spec reporter (node:test)
pnpm test:cov                                          # + c8 HTML/text coverage
node --test --test-reporter spec test/cli.test.js      # a single test file
pnpm lint           # eslint check
pnpm lint:fix       # eslint autofix
```

- Tests use the **Node.js built-in runner** (`node:test`) with `node:assert/strict` — no Jest/Mocha. Coverage is `c8`.
- `pnpm install` / `pnpm dev` instructions in the README refer to the _generated_ app, not this repo.

## How the CLI works

`bin/cli.js` defines one commander command taking `<name>`, then runs five steps in order against `path.resolve(cwd, name)`:

1. `ensurePath` — `fs.ensureDir` the target dir
2. `initializePnpm` — `spawn('pnpm', ['init'])` in it (inherits stdio, so its output is what tests assert against)
3. `addPackageConfig` — read both package.jsons via `read-package-up`, overlay the skeleton's `main`/`type`/`scripts`/`dependencies`/`devDependencies` onto the freshly-init'd one, then `writePackage`. Also strips `_id`, `readme`, and `devEngines` (the last is injected by `pnpm init` and its caret range breaks `pnpm install` — there is a regression test for this).
4. `copySkeleton` — `fs.copy(skeleton, target, { overwrite: false })`
5. `copyEnv` — copy `skeleton/.env.example` to the app's `.env`

There is no flag/option surface beyond `<name>` and `--version`; the old `-y` flag is gone (it's the default).

## Testing the CLI

`test/setup.js` provides `cli(args)`, which `exec`s `bin/cli.js` in a temp `test/_arena/` dir and resolves `{ code, error, stdout, stderr }`. `before`/`after` create and remove `_arena/`. Tests assert on real CLI output and on files written to disk, so they actually invoke `pnpm init` — pnpm must be on PATH.

## Gotchas

- **Skeleton tests need `--ignore-workspace`.** The repo root has a `pnpm-workspace.yaml`, so a plain `pnpm install` inside `skeleton/` (or a generated app under this tree) silently no-ops. Use `pnpm install --ignore-workspace` when working inside the skeleton.
- `skeleton/` is **excluded from linting** (see `eslint.config.js` ignores). Don't expect lint to catch issues there.
- pnpm only (no npm/yarn). Node 20+; CI matrix is 20/22/24, `.nvmrc` pins 24.

## Style

ESLint flat config via `@antfu/eslint-config` with `formatters: true`: **no semicolons, no trailing commas**, single quotes, 2-space indent. ESM only (`"type": "module"`) — local imports keep the `.js` extension, core modules use the `node:` prefix. `no-console` is off (it's a CLI). Prefer `fs-extra` over native `fs`.
