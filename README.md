# Inkora

> A sophisticated agricultural marketplace platform engineered for longevity, scalability, and trust.

---

## Introduction

Inkora is a full-stack, production-grade web application and brand identity system built to connect verified farmers with professional buyers across the United Kingdom. Designed from the ground up with high-end scalability in mind, Inkora operates as a living platform — one that has been continuously refined to meet the demands of a real agricultural marketplace. From verified seller profiles and multi-photo crop listings to real-time upvote ratings and a Facebook Marketplace-style browsing experience, Inkora represents a mature, battle-tested product.

The platform is engineered not just as software, but as a system — one where every architectural decision supports the long-term growth of a trusted agricultural ecosystem.

---

## Technical Provenance

Inkora is built on a clean, modern full-stack JavaScript architecture with a clear separation between client, server, and shared layers.

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS, Shadcn UI |
| Routing | Wouter (client-side), Express (server-side) |
| Data Fetching | TanStack Query v5 |
| Backend | Node.js + Express |
| Database | PostgreSQL (Drizzle ORM + Drizzle Zod) |
| Auth | Session-based authentication with bcrypt |
| Build | Vite (frontend) + tsx (server) |

### Project Structure

```
inkora/
├── client/               # Frontend React application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom data + auth hooks
│       ├── pages/        # Route-level page components
│       └── lib/          # Query client, utilities
├── server/               # Express backend
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database abstraction layer
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schema
│   └── schema.ts         # Drizzle schema + Zod types
└── script/               # Automation scripts
```

The modular structure ensures clean boundaries between concerns — the server never bleeds into the client, and the shared schema layer guarantees type safety end-to-end.

---

## Core Pillars

### Minimalist Design
Inkora's UI is built around restraint and clarity. The Facebook Marketplace-inspired listing grid, brand palette (`#003F3A`, `#D8C9A3`, `#8C6239`), and Outfit + DM Sans typography combine to deliver a professional, high-trust experience for both farmers and buyers.

### Secure Data Architecture
User authentication is session-based with bcrypt-hashed passwords. Role separation (Farmer / Buyer / Admin) is enforced at both the API and UI layers. Sensitive credentials are stored exclusively as environment secrets — never hardcoded.

### Developer-First Infrastructure
The codebase is structured for velocity: shared Zod schemas validate both database writes and API inputs, TanStack Query handles all cache invalidation automatically, and the Drizzle ORM provides fully type-safe database access. A post-merge script keeps the GitHub repository in sync automatically on every deployment.

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (connection string in `DATABASE_URL`)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts both the Express API server and the Vite development server concurrently on port **5000**.

### Database

```bash
npm run db:push
```

Pushes the Drizzle schema to your PostgreSQL database. Demo seed data is loaded automatically on first run.

---

## Features

- **Phone + password authentication** with role-based access (Farmer / Buyer / Admin)
- **Crop listings** with multi-photo galleries (3–7 photos), USD pricing, and category tags
- **Seller upvote system** — buyers rate delivery speed and performance independently
- **Public seller profile pages** at `/seller/:id` with full listing history
- **Facebook Marketplace-style browse** with sidebar filters by crop, location, and price range
- **UK crop reference sidebar** with estimated USD market prices
- **Farmer dashboard** with listing management, boost controls, and view tracking
- **Farm profile pages** with district/county location display

---

## Development Journey

Inkora has undergone significant architectural refinement across its lifetime. Early iterations established the core authentication and marketplace flow. Subsequent phases introduced the seller reputation system, multi-photo listings, and the public profile infrastructure. Each layer was added deliberately — the current state of the codebase reflects not a first draft, but a stable, evolved platform ready for production deployment.

---

## License

Private. All rights reserved.
