# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation website for Claude Code in Uzbek language ("O'zbekcha Professional Qo'llanma"). A single-page Vue app with 17 chapters of tutorial content, deployed on Vercel.

Live site: https://claudecode-uz.vercel.app

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build locally

No test runner or linter is configured.

## Architecture

**Stack:** Vue 3 (Composition API, `<script setup>`) + Vue Router + Tailwind CSS 3.4 + Vite 5

**Routing** is defined inline in `src/main.js` (not a separate router file):
- `/` → LandingView (marketing landing page)
- `/docs` and `/docs/:id` → DocsView (chapter reader)
- `/:pathMatch(.*)*` → NotFoundView

**Content system:** All 17 chapters live in `src/data/chapters.js` as a single exported `chapters` array. Each chapter has `{id, num, title, icon, desc, content}` where `content` is raw HTML strings built with helper functions (`tb`, `line`, `comment`, `prompt`, etc.) that generate terminal-styled code blocks.

**Key composables:**
- `useTheme` — dark/light mode toggle, persisted to localStorage, uses Tailwind `class` strategy
- `useProgress` — scroll-based reading progress percentage

**Components:** NavBar, SearchModal (Ctrl+K), ProgressBar, CodeBlock — all used in DocsView.

**Path alias:** `@` maps to `src/` (configured in `vite.config.js`).

**Styling:** Tailwind with custom `brand` and `dark` color palettes, Space Grotesk + JetBrains Mono fonts. Dark mode is default. Terminal-styled content uses `:deep()` scoped styles in DocsView.

## Conventions

- All UI text and content is in **Uzbek language**
- No TypeScript — plain JavaScript with ES modules (`"type": "module"`)
- Components use Vue 3 `<script setup>` syntax exclusively
- Dark mode classes are applied conditionally via `isDark` ref from `useTheme`
- SPA routing handled by `vercel.json` rewrites for deployment