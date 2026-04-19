# Inkora

A full-stack web application built with Express + Vite + React.

## Architecture

- **Frontend**: React + TypeScript + Vite (served on port 5000)
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui

## Key Files

- `client/src/` — React frontend
- `server/` — Express backend
- `shared/schema.ts` — Shared data model (Drizzle + Zod)
- `script/post-merge.sh` — Runs after every task merge: installs deps and pushes to GitHub

## GitHub Auto-Sync

Code is automatically pushed to GitHub (`yucky-dev/Inkora`) after each task merge via `script/post-merge.sh`. This script:
1. Runs `npm install` to install any new dependencies
2. Force-pushes the latest code to the `main` branch on GitHub using the `GITHUB_PAT` secret

## Running Locally

The "Start application" workflow runs `npm run dev`, which starts both the Express API and Vite dev server on port 5000.
