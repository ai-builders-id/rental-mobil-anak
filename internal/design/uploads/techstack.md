# Technology Stack Document — Aplikasi Tracking Mobil-Mobilan Rental Anak

> **Versi:** 1.0.0
> **Tanggal:** 2026-06-07
> **Penulis:** Lead Software Architect
> **Acuan Blueprint:** `internal/docs/blueprint.md`

---

## Daftar Isi

1. [Ikhtisar Stack](#1-ikhtisar-stack)
2. [Frontend](#2-frontend)
3. [Backend](#3-backend)
4. [Database & ORM](#4-database--orm)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [State Management](#6-state-management)
7. [Real-time Communication](#7-real-time-communication)
8. [Payment Gateway](#8-payment-gateway)
9. [Maps & Geolocation](#9-maps--geolocation)
10. [File Storage](#10-file-storage)
11. [Deployment & DevOps](#11-deployment--devops)
12. [CI/CD](#12-cicd)
13. [Monitoring & Observability](#13-monitoring--observability)
14. [Analytics](#14-analytics)
15. [Nuxt Modules](#15-nuxt-modules)
16. [Dependency Versions](#16-dependency-versions)

---

## 1. Ikhtisar Stack

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (BROWSER)                     │
│  Vue 3 · Nuxt UI 4 · Tailwind CSS v4 · Pinia · Leaflet  │
├─────────────────────────────────────────────────────────┤
│                     SERVER (NITRO)                       │
│  h3 Engine · REST API · WebSocket · Drizzle ORM         │
├─────────────────────────────────────────────────────────┤
│                     INFRASTRUCTURE                       │
│  PostgreSQL · Redis · Cloudflare R2 · Docker · Coolify  │
└─────────────────────────────────────────────────────────┘
```

| Layer | Teknologi | Versi Target |
|-------|-----------|-------------|
| Runtime | Node.js | 22 LTS |
| Framework | Nuxt 4 | ^4.0.0 |
| UI Framework | Nuxt UI 4 | ^4.0.0 |
| CSS | Tailwind CSS | ^4.0.0 |
| Server Engine | Nitro (h3) | ^2.10.0 |
| Database | PostgreSQL | 16 |
| ORM | Drizzle ORM | ^0.39.0 |
| Cache | Redis | 7.x |
| Language | TypeScript | ^5.6.0 |
| Package Manager | pnpm | ^9.0.0 |

---

## 2. Frontend

### Nuxt 4

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^4.0.0 |
| **Mengapa Dipilih** | Nuxt 4 adalah full-stack Vue framework dengan Nitro server bawaan. Menyediakan SSR (Server-Side Rendering) untuk SEO dan performa awal yang cepat, file-based routing yang intuitif, auto-imports untuk komponen dan composables, serta integrasi native dengan Cloudflare. Arsitektur monolith Nuxt 4 memungkinkan satu codebase untuk frontend dan backend. |
| **Alternatif Dipertimbangkan** | |
| | **Next.js 15** — Ekosistem React yang mature, tetapi tim lebih familiar dengan Vue. App Router paradigm masih transisi. |
| | **SvelteKit** — Performa superior dan bundle size kecil, tetapi ekosistem UI library dan komponen lebih kecil dibanding Vue. |
| | **Laravel + Vue** — Full-stack mature, tetapi dua repository terpisah dan PHP hosting lebih mahal. |
| **Rendering Mode** | Hybrid: SSR untuk halaman publik (SEO), CSR untuk dashboard (interaktivitas), Static Generation untuk landing page. Target: `ssr: true` dengan `routeRules` per halaman. |
| **Kompatibilitas Cloudflare** | Nuxt 4 + Nitro memiliki preset Cloudflare Workers dan Cloudflare Pages native, memudahkan deploy di ekosistem Cloudflare. |

### Vue 3 Composition API

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^3.5.0 |
| **Mengapa Dipilih** | Vue 3 dengan Composition API (`<script setup>`) dipilih untuk semua komponen karena memberikan organisasi kode yang lebih baik, type inference yang superior dengan TypeScript, dan reuse logic yang mudah via composables. Tidak menggunakan Options API demi konsistensi. |
| **Alternatif Dipertimbangkan** | React 19 (Hooks) — alternatif kuat, tetapi keputusan framework Nuxt sudah mengunci Vue. |
| **Reactivity** | `ref()`, `reactive()`, `computed()`, `watch()` — standar Vue 3 reactivity system. |

### Nuxt UI 4

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^4.0.0 |
| **Mengapa Dipilih** | Nuxt UI 4 adalah library komponen resmi untuk Nuxt 4, dibangun di atas Tailwind CSS dan Headless UI. Menyediakan komponen siap pakai yang dioptimasi untuk Nuxt: `UButton`, `UModal`, `UTable` (dengan sorting/pagination), `UInput`, `USelect`, `UCard`, `UBadge`, `UAlert`, `UCommandPalette`, `UDropdown`, `UTooltip`, dsb. Auto-import + theming terpusat via `app.config.ts`. |
| **Alternatif Dipertimbangkan** | |
| | **PrimeVue 4** — Komponen lebih banyak (DataTable, Chart, Editor), tetapi bundle size lebih besar dan styling lebih berat dikustomisasi. |
| | **Vuetify 3** — Material Design, kurang fleksibel untuk custom branding. |
| | **Shadcn-Vue** — Komponen copy-paste, kontrol penuh, tetapi tidak ada maintainer resmi, lebih rawan breaking changes. |

### Tailwind CSS v4

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^4.0.0 |
| **Mengapa Dipilih** | Tailwind CSS v4 adalah utility-first CSS framework dengan pendekatan design system. v4 memperkenalkan CSS-first configuration (tanpa `tailwind.config.js`), performa build yang lebih cepat, dan integrasi native dengan Vite. Dipilih karena: (1) Konsistensi design system antar developer, (2) Produktivitas tinggi — styling inline tanpa context-switch ke file CSS, (3) Bundle size minimal dengan purging otomatis, (4) Nuxt UI 4 dibangun di atas Tailwind. |
| **Alternatif Dipertimbangkan** | |
| | **UnoCSS** — Lebih cepat dan ringan, tetapi ekosistem dan komunitas lebih kecil. |
| | **Vanilla CSS** — Kontrol penuh, tetapi produktivitas rendah untuk tim. |
| | **Panda CSS** — Type-safe CSS-in-JS, masih terlalu baru dan belum banyak adopsi. |

### TypeScript

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^5.6.0 |
| **Mengapa Dipilih** | TypeScript wajib digunakan di seluruh codebase (`strict: true`). Memberikan type safety, autocomplete, dan self-documenting code. Kritis untuk aplikasi dengan domain bisnis kompleks (rental, tracking, payment) — mencegah bug runtime yang sulit ditemukan. |

### Peta & Visualisasi (Frontend)

| Library | Versi | Deskripsi |
|---------|-------|-----------|
| **Leaflet** | ^1.9.4 | Library peta open-source, ringan (~40KB), untuk rendering marker unit di dashboard cabang. Tile layer dari OpenStreetMap (gratis). |
| **vue-leaflet** | ^4.0.0 | Wrapper Vue 3 untuk Leaflet, menyediakan komponen deklaratif (`LMap`, `LMarker`, `LTileLayer`). |
| **Mapbox GL JS** | ^3.6.0 | Alternatif premium untuk peta dengan visualisasi lebih kaya (3D, custom style). Digunakan untuk dashboard admin pusat dengan tampilan heatmap semua cabang. |
| **Chart.js** | ^4.4.0 | Library charting ringan untuk dashboard analitik (revenue chart, unit utilization). Via wrapper `vue-chartjs`. |

---

## 3. Backend

### Nitro Server (h3 Engine)

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^2.10.0 (bundled with Nuxt 4) |
| **Mengapa Dipilih** | Nitro adalah server engine bawaan Nuxt 4, dibangun di atas h3 (high-performance HTTP framework). Menyediakan: (1) File-based routing di `server/api/`, (2) Hot Module Replacement untuk server code, (3) Auto-import server utils dan composables, (4) Multi-preset deploy (Node.js, Cloudflare Workers, Bun, Deno), (5) Built-in storage layer (Redis, Cloudflare KV, filesystem), (6) Route caching dengan `defineCachedEventHandler`, (7) WebSocket support native. |
| **Alternatif Dipertimbangkan** | |
| | **Express.js** — Mature dan familiar, tetapi tidak terintegrasi dengan Nuxt, perlu server terpisah. |
| | **Fastify** — Performa tinggi, tetapi lagi-lagi perlu proses server terpisah dari Nuxt. |
| | **Hono** — Ringan, edge-native, tetapi integrasi dengan Nuxt tidak se-native Nitro. |
| **Route Handler Pattern** | `defineEventHandler()` dengan Zod validation. Setiap file di `server/api/` otomatis menjadi endpoint. |

### API Style

| Aspek | Keterangan |
|-------|-----------|
| **Arsitektur** | REST API dengan resource-based routing |
| **Format** | JSON request/response |
| **Validasi** | Zod schema untuk request body, query, dan params. Middleware validasi di `server/middleware/validate.ts` |
| **Error Handling** | Global error handler via Nitro `onError` hook. Kustom error class: `AppError(code, message, statusCode)` |
| **Pagination** | Cursor-based (untuk data real-time) dan offset-based (untuk data statis). Standar: `?page=1&limit=20` |
| **Versioning** | URL prefix `/api/v1/` untuk breaking changes di masa depan. v1 saat ini adalah default. |

### Background Jobs

| Library | Versi | Deskripsi |
|---------|-------|-----------|
| **BullMQ** | ^5.0.0 | Queue system berbasis Redis untuk operasi async: export laporan ke Excel/PDF, bulk notification, cleanup data expired. Job retry dengan backoff, job scheduling (cron). |

---

## 4. Database & ORM

### PostgreSQL 16

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | 16 |
| **Mengapa Dipilih** | PostgreSQL adalah relational database paling mature dan feature-rich di ekosistem open-source. Dipilih karena: (1) ACID compliance untuk data transaksional (rental, pembayaran), (2) PostGIS extension untuk operasi geospasial (tracking GPS, radius pencarian), (3) JSONB untuk metadata fleksibel tanpa kehilangan relational integrity, (4) Row-Level Security (RLS) untuk isolasi data per cabang, (5) Performa query kompleks dengan indexing (B-tree, GiST, GIN, BRIN), (6) Ekosistem tooling yang luas (pgAdmin, DBeaver, pgBouncer). |
| **Alternatif Dipertimbangkan** | |
| | **MySQL 8.4** — Populer, performa read tinggi, tetapi kurang unggul di geospasial dan JSONB dibanding PostgreSQL. |
| | **Cloudflare D1** — Serverless SQLite di edge, latency rendah, tetapi (per Juni 2026) masih beta untuk workload produksi besar, tidak ada PostGIS, dan storage terbatas. Dipertimbangkan sebagai read-replica / cache layer di masa depan. |
| | **Supabase** — Managed PostgreSQL dengan API auto-generated, bagus untuk prototyping, tetapi vendor lock-in dan biaya membesar di skala. |
| | **MongoDB** — Fleksibel untuk schema-less data, tetapi transaksi multi-dokumen lemah dan tidak cocok untuk data relasional (rental-pembayaran-unit-cabang). |

### Cloudflare D1 (Opsional — Read Replica)

| Aspek | Keterangan |
|-------|-----------|
| **Peran** | Read replica untuk query laporan dan dashboard yang tidak memerlukan real-time consistency. Mengurangi beban PostgreSQL utama. |
| **Sinkronisasi** | Cron job (setiap 15 menit) via Nitro task untuk sync data agregat: `dashboard_stats`, `laporan_harian`, `unit_summary`. |
| **Keterbatasan** | Tidak mendukung PostGIS, transaksi, atau stored procedure. Hanya untuk query read-only sederhana. |

### Redis 7

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | 7.x (Alpine) |
| **Peran** | (1) Session store (menggantikan in-memory), (2) API response cache, (3) Real-time position buffer (GEOADD untuk koordinat unit), (4) Pub/Sub untuk WebSocket scaling, (5) Rate limiting counter, (6) Job queue backend (BullMQ). |
| **Konfigurasi** | `maxmemory-policy allkeys-lru`, persistence AOF + RDB, maxmemory 512MB (tunable). |
| **Alternatif Dipertimbangkan** | **Dragonfly** — Redis-compatible dengan performa lebih tinggi, tetapi ekosistem tooling lebih kecil. **Cloudflare KV** — Edge-native, tetapi latency tidak sekonsisten Redis untuk real-time. |

### Drizzle ORM

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^0.39.0 |
| **Mengapa Dipilih** | Drizzle ORM adalah TypeScript-native ORM dengan fokus pada type safety, performa, dan SQL-like API. Dipilih karena: (1) Zero runtime overhead — query dibangun pada compile time, (2) SQL-like syntax yang familiar bagi developer yang sudah terbiasa dengan SQL, (3) Migration tool bawaan (`drizzle-kit`), (4) Mendukung PostgreSQL, D1, dan SQLite dalam satu codebase, (5) Bundle size minimal (~50KB) vs Prisma (~500KB+), (6) Relational queries dengan type inference penuh. |
| **Alternatif Dipertimbangkan** | |
| | **Prisma** — DX superior (Prisma Studio, auto-generated client), tetapi bundle size besar, cold start lambat di serverless, dan query engine binary overhead. |
| | **Kysely** — Type-safe SQL builder, performa terbaik, tetapi tidak ada migration tool dan relation mapping. |
| | **TypeORM** — Mature dan dekorator-based, tetapi kurang type-safe dibanding Drizzle dan maintenance menurun. |

### Schema Management

| Alat | Keterangan |
|------|-----------|
| **drizzle-kit** | Generate migrations dari Drizzle schema TypeScript. Command: `drizzle-kit generate`, `drizzle-kit migrate`, `drizzle-kit push` (untuk dev). |
| **Migrasi** | File SQL di `server/db/migrations/`. Dijalankan otomatis saat startup aplikasi via Nitro plugin. |
| **Seeding** | Script `server/db/seed.ts` untuk data awal: role, admin user, cabang demo. |

---

## 5. Authentication & Authorization

### Lucia Auth

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^3.2.0 |
| **Mengapa Dipilih** | Lucia Auth adalah library autentikasi untuk TypeScript yang session-based dan database-agnostic. Dipilih karena: (1) Session-based auth (cocok untuk SSR + SPA hybrid Nuxt), (2) Mendukung multiple database adapter termasuk Drizzle ORM, (3) Tidak opinionated — kontrol penuh atas flow login, session, dan user management, (4) Type-safe API, (5) Ringan (~10KB). |
| **Alternatif Dipertimbangkan** | |
| | **NextAuth / Auth.js v5** — Framework-agnostic, tetapi dokumentasi dan ekosistem berfokus pada Next.js. Integrasi Nuxt masih experimental. |
| | **Nuxt Auth (sidebase/nuxt-auth)** — Module resmi Nuxt untuk auth. Mengabstraksi banyak hal, tetapi kurang fleksibel untuk kustomisasi mendalam. Akan digunakan sebagai wrapper di atas Lucia untuk kemudahan integrasi dengan Nuxt. |
| | **Clerk / Auth0** — Managed auth service, cepat setup, tetapi biaya per MAU dan ketergantungan pada third-party. |
| **Integrasi dengan Nuxt** | Lucia digunakan langsung di Nitro server. `@sidebase/nuxt-auth` module sebagai jembatan ke client-side composable `useAuth()`. |
| **Session Store** | Redis (primary) + PostgreSQL (fallback). |

### Password Hashing

| Library | Versi | Deskripsi |
|---------|-------|-----------|
| **bcrypt** (via `bcryptjs`) | ^2.4.3 | Hashing password dengan cost factor 12. `bcryptjs` dipilih sebagai pure-JS implementation (tidak perlu native binding seperti `bcrypt`), memudahkan deploy di berbagai platform. |

### MFA (Multi-Factor Authentication)

| Library | Versi | Deskripsi |
|---------|-------|-----------|
| **otplib** | ^12.0.0 | Library TOTP (Time-based One-Time Password) untuk MFA. Digenerate QR code via `qrcode` library. MFA wajib untuk role `superadmin` dan `admin`, opsional untuk `cabang_manager`. |

---

## 6. State Management

### Pinia

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^2.3.0 |
| **Mengapa Dipilih** | Pinia adalah state management library resmi untuk Vue 3 (penerus Vuex). Dipilih karena: (1) TypeScript-native dengan type inference penuh, (2) DevTools integration, (3) Modular store (tidak perlu satu root store), (4) Ringan (~1.5KB), (5) SSR-safe — state bisa dihydrate dari server ke client, (6) Composables-style API (`defineStore`). |
| **Alternatif Dipertimbangkan** | |
| | **Vuex 4** — Pendahulu Pinia, masih didukung tetapi tidak lagi direkomendasikan untuk project baru. |
| | **TanStack Store** — Framework-agnostic, bagus untuk multi-framework, tetapi overkill untuk Vue-only app. |
| **Stores yang Digunakan** | `useAuthStore` (user, session, role), `useBranchStore` (cabang detail, units), `useRentalStore` (active rentals, history), `useTrackingStore` (WebSocket connection, unit positions), `useUIStore` (sidebar state, theme, notifications). |

### State Hydration (SSR)

Pinia mendukung SSR hydration via Nuxt plugin `@pinia/nuxt`. State yang di-set di server (misalnya data dashboard yang di-fetch saat SSR) secara otomatis dikirim ke client dan dihydrate — menghindari duplicate fetch.

---

## 7. Real-time Communication

### WebSocket (Nitro Native)

| Aspek | Keterangan |
|-------|-----------|
| **Mengapa Dipilih** | Nitro 2.10+ mendukung WebSocket native via `defineWebSocketHandler()`. WebSocket dipilih untuk real-time tracking karena: (1) Full-duplex — server bisa push update tanpa client request, (2) Latency minimal — tidak ada HTTP overhead per message, (3) Connection persistent — cocok untuk tracking yang perlu koneksi terus-menerus, (4) Redis Pub/Sub integration untuk scaling multi-instance. |
| **Alternatif Dipertimbangkan** | |
| | **SSE (Server-Sent Events)** — Lebih sederhana (HTTP-based, auto-reconnect), tetapi unidirectional (server → client) dan batas 6 koneksi per domain di browser. Digunakan sebagai fallback jika WebSocket gagal. |
| | **Socket.IO** — Abstraksi WebSocket dengan auto-reconnect, room, dan fallback ke long polling. Tetapi bundle size besar (client ~60KB) dan memerlukan server Socket.IO terpisah. |
| | **Cloudflare Durable Objects** — WebSocket di edge, skalabel, tetapi vendor lock-in dan pricing model yang kompleks. |
| **Protokol** | JSON message dengan field `type`, `data`, dan `timestamp`. Lihat `blueprint.md` Section 8 untuk detail protokol. |
| **Connection Limit** | 100 concurrent per instance Nitro. 500 total dengan 5 instance. |
| **Heartbeat** | Ping/Pong setiap 30 detik. Disconnect setelah 60 detik tanpa respons. |

### Fallback: SSE

| Aspek | Keterangan |
|-------|-----------|
| **Endpoint** | `GET /api/tracking/sse` |
| **Format** | `text/event-stream` (SSE standard) |
| **Event Types** | `unit_update`, `unit_status`, `alert` |
| **Reconnect** | Browser-native auto-reconnect via `EventSource` API |

---

## 8. Payment Gateway

### Midtrans (Primary)

| Aspek | Keterangan |
|-------|-----------|
| **Versi SDK** | `midtrans-client` ^1.4.0 |
| **Mengapa Dipilih** | Midtrans adalah payment gateway paling populer di Indonesia. Dipilih karena: (1) 20+ metode pembayaran (QRIS, GoPay, ShopeePay, transfer bank, OVO, Dana, LinkAja, Indomaret, Alfamart), (2) Snap API — halaman pembayaran hosted oleh Midtrans (mengurangi beban PCI compliance), (3) Webhook callback untuk notifikasi status pembayaran, (4) Dashboard merchant untuk rekonsiliasi, (5) Biaya transaksi kompetitif, (6) Dokumentasi bahasa Indonesia yang lengkap. |
| **Alternatif Dipertimbangkan** | |
| | **Xendit** — Alternatif kuat dengan API modern dan lebih banyak metode disbursement. Dipilih sebagai fallback jika Midtrans bermasalah. |
| | **Stripe** — Paling developer-friendly, tetapi coverage metode pembayaran Indonesia masih terbatas (baru mendukung sebagian bank transfer dan kartu kredit). |
| | **OY! Indonesia** — Pemain baru, fitur mirip Midtrans, tetapi track record lebih pendek. |
| **Integrasi** | `POST /api/payment/create` → Midtrans Snap API → return `redirect_url` / token. Webhook `POST /api/payment/callback` untuk notifikasi status. |
| **Environment** | Sandbox (`app.sandbox.midtrans.com`) untuk development, Production setelah testing. |

### Xendit (Secondary / Fallback)

| Aspek | Keterangan |
|-------|-----------|
| **Versi SDK** | `xendit-node` ^2.0.0 |
| **Peran** | Payment gateway cadangan. Jika Midtrans mengalami outage, sistem otomatis switch ke Xendit. Konfigurasi toggle di env variable `PAYMENT_GATEWAY=midtrans|xendit`. |
| **Metode** | QRIS, Virtual Account (BCA, BNI, BRI, Mandiri), Retail Outlet (Alfamart, Indomaret), E-Wallet (OVO, Dana, LinkAja, ShopeePay). |

---

## 9. Maps & Geolocation

### Leaflet (Primary — Operator Dashboard)

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^1.9.4 |
| **Mengapa Dipilih** | Leaflet adalah library peta open-source paling populer. Dipilih untuk dashboard operator cabang karena: (1) Gratis tanpa API key, (2) Ringan (~40KB), (3) Tile layer dari OpenStreetMap gratis, (4) Cukup untuk kebutuhan: marker unit, geofence circle, basic interaction, (5) Plugin ekosistem luas (marker cluster, heatmap, routing). |
| **Wrapper Vue** | `@vue-leaflet/vue-leaflet` ^4.0.0 — menyediakan komponen deklaratif (`LMap`, `LMarker`, `LTileLayer`, `LCircle`, `LPopup`). |
| **Tile Provider** | OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) untuk environment development. Untuk production, bisa switch ke tile provider yang lebih reliable (Mapbox, Stadia Maps). |

### Mapbox GL JS (Secondary — Admin Dashboard)

| Aspek | Keterangan |
|-------|-----------|
| **Versi Target** | ^3.6.0 |
| **Mengapa Dipilih** | Mapbox GL JS digunakan untuk dashboard admin pusat yang membutuhkan visualisasi lebih kaya: (1) Heatmap distribusi unit di seluruh Indonesia, (2) Custom map style (branding), (3) 3D building view, (4) Geocoding API untuk pencarian alamat cabang, (5) Directions API untuk estimasi jarak antar cabang. |
| **Keterbatasan** | Berbayar — free tier 50.000 map load/bulan. Jika melebihi batas, fallback ke Leaflet + OpenStreetMap. |
| **Integrasi** | Mapbox GL JS di-load sebagai client-plugin di Nuxt (`app/plugins/mapbox.ts`), hanya di halaman admin. |

### Kalkulasi Geospasial (Backend)

| Library | Versi | Deskripsi |
|---------|-------|-----------|
| **haversine-distance** | ^1.2.3 | Kalkulasi jarak antara dua koordinat GPS untuk geofencing (cek apakah unit di dalam radius cabang). |
| **PostGIS** | 3.4 (Ext PostgreSQL) | Spatial extension untuk query berbasis lokasi: `ST_DWithin` (radius search), `ST_Distance` (jarak). Digunakan di query `unit_location` untuk analitik dan laporan. |

---

## 10. File Storage

### Cloudflare R2

| Aspek | Keterangan |
|-------|-----------|
| **Versi SDK** | `@aws-sdk/client-s3` ^3.700.0 |
| **Mengapa Dipilih** | Cloudflare R2 adalah object storage S3-compatible dengan zero egress fee. Ini adalah faktor kritis karena aplikasi akan sering menyajikan foto unit/cabang ke banyak client (operator, admin), dan biaya egress AWS S3 bisa signifikan di skala 250 cabang. Integrasi native dengan Cloudflare CDN berarti file di-cache di edge, latency rendah untuk user di seluruh Indonesia. |
| **Alternatif Dipertimbangkan** | |
| | **AWS S3** — Standar industri, fitur paling lengkap (versioning, lifecycle, replication). Tetapi biaya egress ($0.09/GB) membuatnya tidak ekonomis untuk asset serving skala nasional. |
| | **DigitalOcean Spaces** — S3-compatible, $5/bulan untuk 250GB + 1TB egress. Alternatif terjangkau, tetapi CDN terpisah. |
| | **Uploadthing** — Simplifikasi upload, tetapi pricing per file bisa mahal untuk volume besar. |
| **Bucket Structure** | `rental-tracking-prod/{units,cabangs,exports,backups,payments}/` |
| **Public Access** | Foto unit dan cabang public via Cloudflare CDN dengan caching 1 tahun. Export dan backup private — akses via signed URL (expire 1 jam). |
| **Upload Flow** | Client → Presigned POST URL dari backend → Direct upload ke R2 → Callback ke backend untuk finalisasi. |

---

## 11. Deployment & DevOps

### Cloudflare VPS

| Aspek | Keterangan |
|-------|-----------|
| **Provider Alternatif** | DigitalOcean Droplet, Vultr Compute, UpCloud — pilih yang menyediakan data center di Jakarta atau Singapore untuk latency minimal ke user Indonesia. |
| **OS** | Ubuntu 24.04 LTS |
| **Web Server** | Caddy (reverse proxy, auto-TLS via Let's Encrypt) menggantikan Nginx. Dipilih karena: konfigurasi sederhana (Caddyfile ~10 baris), auto-HTTPS tanpa setup manual, HTTP/3 support. |
| **Container Runtime** | Docker + Docker Compose untuk orkestrasi container sederhana. Tidak menggunakan Kubernetes di tahap awal karena overhead operasional. |

### Coolify / CapRover

| Aspek | Keterangan |
|-------|-----------|
| **Peran** | Platform as a Service (PaaS) self-hosted untuk mengelola deploy, environment variable, domain, dan SSL. |
| **Pilihan: Coolify** | Open-source PaaS. Menyediakan: (1) UI dashboard untuk deploy management, (2) GitHub integration — auto-deploy on push, (3) Environment variable management, (4) Database provisioning (PostgreSQL, Redis), (5) Backup otomatis ke S3/R2, (6) Monitoring dasar (CPU, RAM). |
| **Alternatif: CapRover** | Lebih mature, komunitas lebih besar, one-click app store. Dipilih sebagai alternatif jika Coolify tidak memenuhi kebutuhan. |
| **Konfigurasi Docker** | Satu `docker-compose.yml` dengan 4 service: `app` (Nuxt 4), `postgres`, `redis`, `caddy`. |

### DNS & CDN

| Service | Peran |
|---------|-------|
| **Cloudflare DNS** | Nameserver utama. Menyediakan: DNS management, DDoS protection, WAF, CDN caching. |
| **Cloudflare CDN** | Cache static assets (CSS, JS, images, fonts) di edge. Cache API response dengan `Cache-Control` header. |
| **Cloudflare Tunnels** | Opsional — ekspos service VPS ke internet tanpa membuka port (zero-trust). |

---

## 12. CI/CD

### GitHub Actions

| Aspek | Keterangan |
|-------|-----------|
| **Mengapa Dipilih** | GitHub Actions adalah CI/CD bawaan GitHub, gratis untuk repository publik (dan 2,000 menit/bulan untuk private). Dipilih karena: (1) Integrasi native dengan repository, (2) Marketplace actions yang kaya (Docker Build & Push, SSH Deploy, Cache), (3) Matrix builds, (4) Environment secrets untuk kredensial deploy. |
| **Alternatif Dipertimbangkan** | GitLab CI (self-hosted runner, lebih fleksibel, tetapi butuh setup sendiri). CircleCI (UI lebih baik, tetapi pricing untuk parallelism). |

### Pipeline Stages

| Stage | Action | Waktu (estimasi) |
|-------|--------|-----------------|
| **Lint** | `pnpm lint` (ESLint) + `pnpm typecheck` (TypeScript) + `pnpm format:check` (Prettier) | ~30 detik |
| **Test** | `pnpm test` (Vitest: unit + integration) + `pnpm test:e2e` (Playwright) | ~2 menit |
| **Security** | `npm audit` + Snyk / Dependabot alert check | ~30 detik |
| **Build** | `docker build -t app:${SHA} .` (multi-stage Dockerfile) | ~2 menit |
| **Push** | `docker push ghcr.io/org/rental-tracking:latest` | ~1 menit |
| **Deploy** | SSH into VPS → `docker compose pull && docker compose up -d` | ~1 menit |
| **Verify** | Health check `curl https://domain/api/health` → wait 200 | ~30 detik |
| **Total** | | **~7 menit** |

### Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./
EXPOSE 3000
CMD ["node", "server/index.mjs"]
```

### Environment Strategy

| Environment | Branch | Domain | Database |
|-------------|--------|--------|----------|
| **Development** | `develop` | `dev.rental-anak.id` | PostgreSQL Dev (VPS) |
| **Staging** | `staging` | `stg.rental-anak.id` | PostgreSQL Staging (VPS) |
| **Production** | `main` | `rental-anak.id` | PostgreSQL Prod (VPS) |

---

## 13. Monitoring & Observability

### Sentry

| Aspek | Keterangan |
|-------|-----------|
| **Versi SDK** | `@sentry/nuxt` ^8.0.0 |
| **Mengapa Dipilih** | Sentry adalah platform error tracking dan performance monitoring paling mature. Dipilih karena: (1) Real-time error alerting dengan stack trace lengkap, (2) Performance monitoring (transaction tracing) — identifikasi endpoint lambat, (3) Session replay untuk debug error di frontend, (4) Integrasi native dengan Nuxt via `@sentry/nuxt` module, (5) Free tier: 5,000 errors/bulan, cukup untuk tahap awal. |
| **Alternatif Dipertimbangkan** | **GlitchTip** — Open-source alternative Sentry, self-hosted, lebih murah untuk skala besar. **LogRocket** — Session replay superior, tetapi lebih mahal. |
| **Scope** | Frontend errors (Vue), Backend errors (Nitro), API performance tracing. |

### Uptime Kuma

| Aspek | Keterangan |
|-------|-----------|
| **Peran** | Self-hosted uptime monitoring. Monitor endpoint `/api/health` setiap 30 detik. Alert via Telegram, Email, atau Discord jika service down. |
| **Mengapa Dipilih** | Gratis, self-hosted (satu Docker container), UI dashboard yang bersih, multiple notification channel. Cukup untuk kebutuhan monitoring uptime tanpa biaya. |
| **Alternatif** | Better Uptime, Pingdom, UptimeRobot — managed service, tetapi berbayar di atas 50 monitor. |

### Logging

| Library | Versi | Deskripsi |
|---------|-------|-----------|
| **pino** | ^9.0.0 | JSON logger performa tinggi untuk Node.js. Digunakan di Nitro server untuk structured logging. Output ke stdout/stderr, bisa di-forward ke Sentry atau log aggregator. |

---

## 14. Analytics

### Plausible (Primary)

| Aspek | Keterangan |
|-------|-----------|
| **Mengapa Dipilih** | Plausible adalah web analytics yang privacy-first dan ringan (< 1KB script). Dipilih karena: (1) GDPR/Privacy compliant — tidak perlu cookie banner, (2) Self-hosted option untuk kontrol data penuh, (3) Dashboard sederhana — page views, bounce rate, visit duration, (4) Tidak mengganggu performa situs, (5) Open-source. |
| **Alternatif Dipertimbangkan** | |
| | **Umami** — Mirip Plausible, open-source, self-hosted. Lebih ringan dan gratis tanpa batas. Dipilih sebagai alternatif/cadangan. |
| | **Google Analytics 4 (GA4)** — Gratis, fitur paling lengkap, tetapi berat (~45KB), privacy concern, dan butuh cookie consent di Indonesia. |
| | **PostHog** — Product analytics + session replay, powerful untuk product-led growth, tetapi overkill untuk tahap awal dan self-hosting lebih berat. |

### Umami (Secondary)

| Aspek | Keterangan |
|-------|-----------|
| **Peran** | Alternatif analytics jika Plausible tidak tersedia atau sebagai analytics cadangan untuk cross-check data. |
| **Deploy** | Self-hosted via Docker di VPS yang sama (atau VPS kecil terpisah). |

---

## 15. Nuxt Modules

Nuxt modules adalah ekstensi resmi / komunitas yang menambah fungsionalitas ke aplikasi Nuxt. Berikut adalah daftar module yang akan digunakan:

| Module | Versi | Status | Deskripsi |
|--------|-------|--------|-----------|
| **`@nuxt/ui`** | ^4.0.0 | Official | Nuxt UI 4 — komponen UI, Tailwind CSS, ikon, warna. Wajib. |
| **`@nuxt/fonts`** | ^0.10.0 | Official | Optimasi font loading. Auto-download Google Fonts, self-host untuk performa. Font: Inter (body) + Plus Jakarta Sans (headings). |
| **`@nuxt/image`** | ^1.9.0 | Official | Optimasi gambar otomatis: resize, format (WebP/AVIF), lazy load, dimensi. Provider: Cloudflare R2. |
| **`@nuxt/content`** | ^3.0.0 | Official | File-based CMS untuk halaman statis (kebijakan privasi, syarat ketentuan, panduan). Markdown/MDX → HTML. |
| **`@nuxt/eslint`** | ^0.7.0 | Official | ESLint config untuk Nuxt 4. Flat config format, TypeScript-aware. |
| **`@nuxt/scripts`** | ^0.9.0 | Official | Manajemen third-party scripts (Mapbox, Midtrans Snap, Sentry) dengan loading strategy optimal. |
| **`@nuxtjs/plausible`** | ^1.0.0 | Community | Integrasi Plausible Analytics. Auto-track page views. |
| **`@pinia/nuxt`** | ^0.9.0 | Official | Pinia state management untuk Nuxt. SSR hydration, DevTools. |
| **`@vueuse/nuxt`** | ^12.0.0 | Community | VueUse composables (useLocalStorage, useGeolocation, useInterval, useWebSocket, dll). Auto-import. |
| **`nuxt-auth`** | ^0.6.0 | Community | `@sidebase/nuxt-auth` — wrapper untuk Lucia Auth di Nuxt. Menyediakan `useAuth()` composable dan session management. |
| **`@sentry/nuxt`** | ^8.0.0 | Official | Sentry error & performance monitoring untuk Nuxt. |
| **`nuxt-swiper`** | ^2.0.0 | Community | Carousel / slider untuk tampilan galeri unit di landing page. |
| **`dayjs-nuxt`** | ^2.0.0 | Community | Day.js untuk formatting tanggal di seluruh aplikasi. Ringan (~2KB). |

### Konfigurasi `nuxt.config.ts`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-06-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@sidebase/nuxt-auth',
    '@nuxtjs/plausible',
    '@sentry/nuxt',
    'dayjs-nuxt',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private (server-only)
    dbUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    midtransServerKey: process.env.MIDTRANS_SERVER_KEY,
    midtransClientKey: process.env.MIDTRANS_CLIENT_KEY,
    // Public (exposed to client)
    public: {
      midtransClientKey: process.env.NUXT_PUBLIC_MIDTRANS_CLIENT_KEY,
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN,
      plausibleDomain: 'rental-anak.id',
    }
  },

  nitro: {
    experimental: {
      websocket: true,
    },
    storage: {
      redis: {
        driver: 'redis',
        url: process.env.REDIS_URL,
      },
    },
  },

  image: {
    provider: 'cloudflare',
    providerOptions: {
      baseURL: process.env.R2_PUBLIC_URL,
    },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Plus Jakarta Sans', provider: 'google' },
    ],
  },

  plausible: {
    domain: 'rental-anak.id',
    apiHost: 'https://plausible.rental-anak.id',
    autoPageviews: true,
  },
});
```

---

## 16. Dependency Versions

### Daftar Lengkap Dependency

#### Dependencies (Production)

| Package | Versi | Deskripsi |
|---------|-------|-----------|
| `nuxt` | ^4.0.0 | Full-stack Vue framework |
| `vue` | ^3.5.0 | UI framework |
| `@nuxt/ui` | ^4.0.0 | Komponen UI resmi Nuxt |
| `tailwindcss` | ^4.0.0 | Utility-first CSS |
| `typescript` | ^5.6.0 | Type-safe JavaScript |
| `drizzle-orm` | ^0.39.0 | TypeScript ORM |
| `@aws-sdk/client-s3` | ^3.700.0 | S3-compatible client untuk R2 |
| `@aws-sdk/s3-request-presigner` | ^3.700.0 | Signed URL generation |
| `redis` | ^4.7.0 | Redis client |
| `lucia` | ^3.2.0 | Auth library |
| `@lucia-auth/adapter-drizzle` | ^1.1.0 | Drizzle adapter untuk Lucia |
| `@sidebase/nuxt-auth` | ^0.6.0 | Nuxt auth wrapper |
| `pinia` | ^2.3.0 | State management |
| `@pinia/nuxt` | ^0.9.0 | Pinia Nuxt module |
| `@vueuse/core` | ^12.0.0 | Vue composables |
| `@vueuse/nuxt` | ^12.0.0 | VueUse Nuxt module |
| `zod` | ^3.24.0 | Schema validation |
| `bcryptjs` | ^2.4.3 | Password hashing |
| `otplib` | ^12.0.0 | TOTP MFA |
| `midtrans-client` | ^1.4.0 | Midtrans SDK |
| `xendit-node` | ^2.0.0 | Xendit SDK |
| `leaflet` | ^1.9.4 | Peta interaktif |
| `@vue-leaflet/vue-leaflet` | ^4.0.0 | Leaflet Vue wrapper |
| `mapbox-gl` | ^3.6.0 | Peta premium |
| `chart.js` | ^4.4.0 | Charting library |
| `vue-chartjs` | ^5.3.0 | Chart.js Vue wrapper |
| `bullmq` | ^5.0.0 | Job queue |
| `pino` | ^9.0.0 | JSON logger |
| `haversine-distance` | ^1.2.3 | GPS distance calculation |
| `qrcode` | ^1.5.0 | QR code generation (MFA) |
| `dayjs-nuxt` | ^2.0.0 | Date formatting |

#### Dev Dependencies

| Package | Versi | Deskripsi |
|---------|-------|-----------|
| `drizzle-kit` | ^0.28.0 | Drizzle migration CLI |
| `@nuxt/eslint` | ^0.7.0 | ESLint Nuxt config |
| `eslint` | ^9.0.0 | Linter |
| `prettier` | ^3.4.0 | Code formatter |
| `prettier-plugin-tailwindcss` | ^0.6.0 | Tailwind class sorting |
| `vitest` | ^2.0.0 | Unit/integration test |
| `@vue/test-utils` | ^2.4.0 | Vue component testing |
| `@playwright/test` | ^1.49.0 | E2E testing |
| `typescript` | ^5.6.0 | Type checker |
| `@types/leaflet` | ^1.9.0 | Leaflet type definitions |
| `sass` | ^1.80.0 | SCSS preprocessor (cadangan) |

---

## Penutup

Stack teknologi ini dirancang dengan prinsip:

1. **Simplicity** — Monolith Nuxt 4 sebagai satu-satunya runtime, mengurangi jumlah teknologi yang harus dikuasai tim.
2. **Cost Efficiency** — Cloudflare R2 (zero egress), self-hosted tools (Coolify, Uptime Kuma, Plausible/Umami), PostgreSQL dan Redis di VPS yang sama — meminimalkan biaya operasional.
3. **TypeScript Everywhere** — Dari database schema (Drizzle) hingga frontend (Vue 3), type safety end-to-end mencegah runtime error.
4. **Indonesian Context** — Midtrans/Xendit sebagai payment gateway local, Leaflet + OpenStreetMap untuk peta gratis, desain untuk user Indonesia.
5. **Production Ready** — Setiap pilihan teknologi memiliki justification yang jelas, alternatif yang dievaluasi, dan versi yang dispesifikkan.

Dokumen ini bersifat living document — akan direvisi seiring perkembangan proyek, perubahan requirement, dan munculnya teknologi baru yang relevan. Setiap perubahan wajib dicatat di changelog dan di-review oleh Lead Software Architect.
