# Rental Mobil Anak

**Tracking & Management Application for Children's Electric Ride-On Car Rentals**

A comprehensive management system for Indonesia's largest children's electric car rental network — 250 pop-up store branches and 40,000+ units across the country.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 (Vue 3 + Nitro Server) |
| UI | Nuxt UI 4 + Tailwind CSS v4 |
| Language | TypeScript |
| Database | PostgreSQL 16 + Drizzle ORM |
| Cache | Redis 7 |
| Auth | Lucia Auth + JWT (RS256) + RBAC |
| Payment | Midtrans + Xendit (fallback) |
| Maps | Leaflet + Mapbox GL JS |
| Real-time | WebSocket + SSE fallback |
| File Storage | Cloudflare R2 |
| Deployment | Docker Compose + Coolify/CapRover |

## Core Features (MVP)

- **Branch Management** — 250 branches with profiles, GPS coordinates, operating hours
- **Unit Management** — 40,000+ units with real-time status tracking
- **Quick Rental System** — Start/stop rental, auto-calculate fees & late penalties
- **GPS Real-time Tracking** — Unit location with geofencing alerts
- **Pop-up Store Events** — Calendar management, unit allocation, operator assignment
- **Dashboard & Reports** — Revenue analytics, branch performance, daily reports
- **Authentication & RBAC** — 4 user roles with permission isolation

## Project Structure

```
internal/
├── docs/                # Documentation (blueprint, PRD, BRD, FRD, design, etc.)
│   ├── blueprint.md     # Technical architecture & system design
│   ├── brd.md           # Business requirements & market analysis
│   ├── prd.md           # Product requirements & user stories
│   ├── frd.md           # Functional specifications & API specs
│   ├── design.md        # Design system & UI tokens
│   ├── wireframe.md     # Wireframe specs for every screen
│   ├── roadmap.md       # 4-phase development roadmap
│   ├── security.md      # Security architecture & compliance
│   └── techstack.md     # Technology decisions & justifications
└── wireframe/
    └── index.html       # Interactive HTML wireframe prototype
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## License

All rights reserved.
