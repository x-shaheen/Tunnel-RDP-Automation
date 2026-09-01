---
name: Next.js workspace TypeScript scope
description: Keep a root Next.js app's TypeScript project scope separate from unrelated workspace artifacts.
---

When a Next.js app shares a repository with Vite or other workspace packages, its `tsconfig.json` must include only the app's source and Next-generated types and exclude unrelated package directories.

**Why:** A broad recursive include makes `next build` typecheck other packages under the repository with incompatible ambient types, causing failures unrelated to the Next.js app.

**How to apply:** For a root Next.js app, use `next-env.d.ts`, `src/**/*.ts`, `src/**/*.tsx`, and `.next/types/**/*.ts` as includes, and exclude `node_modules` plus unrelated workspace directories.