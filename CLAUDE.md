# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

CSS Hooks is a CSS-in-JS library that enables conditional styling via CSS custom
properties (variables) without runtime style injection or build steps. It
generates a static stylesheet once, then uses CSS variable toggling to apply
conditional styles (hover, media queries, etc.) inline.

## Development Commands

Node.js version is specified in `.nvmrc` (currently 24.x). Use npm workspaces.

```bash
# Install dependencies
npm install

# Build a specific package
npm run build -w packages/core
npm run build -w packages/react

# Run tests for a specific package
npm test -w packages/core

# Run tests for all packages
npm -r test

# Build all packages (from root, builds with wireit caching)
npm run build -w packages/core && npm run build -w packages/react  # etc.

# Generate API docs (requires all packages built)
npm run docs

# Lint/format (runs automatically on commit via lint-staged)
npx eslint --fix <file>
npx prettier --write <file>
```

**Running a single test file:** Tests use Node.js native test runner. The
`@css-hooks/source` condition resolves packages to TypeScript source:

```bash
node --conditions @css-hooks/source --test packages/core/src/index.test.ts
```

## Architecture

### Core Concept

`@css-hooks/core` exports `buildHooksSystem()`, which returns a `createHooks()`
factory. `createHooks()` takes a map of named conditions (selectors/at-rules)
and returns:

- `styleSheet()` — generates the static CSS to inject once into the page
- `on(condition, style)` — returns a style object with CSS variable overrides
  for conditional values
- `and()`, `or()`, `not()` — compose conditions with boolean logic

Framework packages (`@css-hooks/react`, `@css-hooks/preact`, etc.) call
`buildHooksSystem()` with a framework-specific `stringify` function (handling
unitless numbers for React, etc.) and re-export `createHooks` pre-configured for
that framework.

### Key Types (packages/core/src/index.ts)

- `Condition<S>` — a selector string, or `{ and: [...] }`, `{ or: [...] }`,
  `{ not: ... }`
- `Selector` — either a string with `&` placeholder (e.g., `"&:hover"`) or an
  at-rule starting with `@media`, `@container`, or `@supports`
- `StringifyFn` — `(value, propertyName) => string | null` — converts CSS values
  to strings

### Monorepo Structure

```
packages/core        → framework-agnostic core (no dependencies)
packages/react       → depends on core, peer: react
packages/preact      → depends on core, peer: preact
packages/solid       → depends on core, peer: solid-js
packages/qwik        → depends on core, peer: @builder.io/qwik
example/             → React demo app (local dep on @css-hooks/react)
site/                → React Router documentation site
scripts/             → release automation (apply-version, calculate-version, readme)
docs/                → generated API docs (do not edit manually)
temp/                → api-extractor output (do not edit manually)
```

### Build System

Wireit orchestrates builds with caching. Each package compiles TypeScript twice:

- `tsc` → `esm/` (ES modules)
- `tsc --project tsconfig.cjs.json` → `cjs/` (CommonJS)

Types go to `types/`. The `@css-hooks/source` export condition maps to the raw
TypeScript source, used during testing.

## Site Development (Visual Feedback Loop)

Only use Puppeteer to verify changes visually when the user explicitly asks for
it. Do not take screenshots proactively.

If the user does ask for visual verification:

```bash
# 1. Start the dev server — never use 5173 (user may have their own instance there)
npm run dev -w site -- --port 5174

# 2. After making changes, write a temporary script to take a screenshot and
#    delete it when done — it doesn't need to be kept
```

## Code Conventions

### Commit Messages

Conventional Commits with these types only: `fix`, `feat`, `breaking`, `misc`
(lowercase required).

### TypeScript

- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- Use `import type` for type-only imports (enforced by ESLint)
- Target: ES2019, module: ES2015

### ESLint / Prettier

- 80-character line width, 2-space indent, trailing commas, arrow parens
- Import sorting enforced via `eslint-plugin-simple-import-sort`
- Pre-commit hook runs lint-staged automatically
