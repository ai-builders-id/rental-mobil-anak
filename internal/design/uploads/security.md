# Security Architecture — Rental Mobil Anak

> **Versi:** 1.0.0
> **Klasifikasi:** Internal — Confidential
> **Target:** Aplikasi tracking & manajemen rental mobil-mobilan anak
> **Standar:** OWASP Top 10 (2021), UU PDP Indonesia No. 27/2022, ISO 27001 considerations
> **Referensi:** `design.md`, `wireframe.md`

---

## Daftar Isi

1. [Authentication](#1-authentication)
2. [Authorization](#2-authorization)
3. [Data Encryption](#3-data-encryption)
4. [API Security](#4-api-security)
5. [Database Security](#5-database-security)
6. [Infrastructure Security](#6-infrastructure-security)
7. [Compliance](#7-compliance)
8. [Security Headers](#8-security-headers)
9. [Secrets Management](#9-secrets-management)
10. [Audit Logging](#10-audit-logging)
11. [Incident Response Plan](#11-incident-response-plan)
12. [Security Testing](#12-security-testing)
13. [OWASP Top 10 Mitigations](#13-owasp-top-10-mitigations)

---

## 1. Authentication

### 1.1 Arsitektur

```
┌──────────┐       ┌─────────────┐       ┌──────────┐
│  Client  │──────▶│  Nuxt API   │──────▶│  Backend │
│ (Browser)│       │  Server     │       │  Service │
│          │◀──────│  (Nitro)    │◀──────│          │
└──────────┘       └─────────────┘       └──────────┘
      │                                       │
      │  HTTPS (TLS 1.3)                      │  Internal mTLS
      ▼                                       ▼
 ┌──────────┐                          ┌──────────┐
 │ Cloudflare│                          │ PostgreSQL│
 │ WAF / CDN│                          │           │
 └──────────┘                          └──────────┘
```

### 1.2 JWT Authentication Flow

**Protocol:** JWT (JSON Web Token) dengan access + refresh token.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                                  │
│                                                                     │
│  1. Client POST /api/auth/login { email, password }                │
│  2. Server verifikasi bcrypt hash password                          │
│  3. Server generate:                                                │
│     - Access Token (JWT, 15 menit)                                  │
│     - Refresh Token (opaque, 7 hari, disimpan di DB)                │
│  4. Response:                                                       │
│     - Access Token  → HTTP-only, Secure, SameSite=Lax cookie       │
│     - Refresh Token → HTTP-only, Secure, SameSite=Strict cookie    │
│     - User profile data (id, nama, role, cabang_id)                 │
│                                                                     │
│                         REFRESH FLOW                                │
│                                                                     │
│  1. Client detect access token expired (401)                        │
│  2. POST /api/auth/refresh (cookie otomatis terkirim)              │
│  3. Server verifikasi refresh token (DB lookup + expiry)            │
│  4. Server revoke refresh token lama, generate pasangan baru        │
│  5. Response: set cookie baru + user profile                        │
│                                                                     │
│                         LOGOUT FLOW                                 │
│                                                                     │
│  1. POST /api/auth/logout                                           │
│  2. Server revoke refresh token di DB                               │
│  3. Server clear cookie (expire=0)                                  │
│  4. Client redirect ke login page                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 JWT Token Specification

**Access Token Payload:**
```json
{
  "sub": "user_uuid_abc123",
  "role": "ADMIN_CABANG",
  "cabang_id": "cabang_789",
  "iat": 1717765200,
  "exp": 1717766100,
  "jti": "unique_token_id_xyz456",
  "iss": "rental-mobil-anak"
}
```

**Signing Algorithm:** `RS256` (RSA 2048-bit key pair)
- Private key: disimpan di Cloudflare Secrets / environment variable
- Public key: tersedia di JWKS endpoint (`/.well-known/jwks.json`) untuk verifikasi antar service

**Token Validation Checklist:**
- [ ] Verify signature (RS256)
- [ ] Verify `exp` (not expired)
- [ ] Verify `iss` (issuer match)
- [ ] Verify `sub` exists
- [ ] Verify `jti` not blacklisted (Redis blacklist untuk revoked tokens)
- [ ] Verify user still active di database

### 1.4 Password Policy

| Aturan | Nilai |
|--------|-------|
| Panjang minimum | 8 karakter |
| Panjang maksimum | 128 karakter (bcrypt limit) |
| Kompleksitas | Minimal 1 huruf besar, 1 huruf kecil, 1 angka |
| Khusus (operator) | Boleh 6-digit PIN + hardware token |
| Hash algorithm | bcrypt, cost factor 12 |
| Password history | 5 password terakhir tidak boleh diulang |
| Max login attempts | 5 gagal → akun terkunci 15 menit |
| Password expiry | 90 hari (admin), 180 hari (operator) |
| Forgot password token | 256-bit random, expire 15 menit, single-use |

### 1.5 Multi-Factor Authentication (MFA)

**Admin (Super Admin & Admin Cabang):** Wajib TOTP (Time-based One-Time Password)

- Setup via QR code scan (Google Authenticator / Authy compatible)
- Backup recovery codes: 8 kode, masing-masing 10 karakter, single-use
- TOTP diwajibkan setiap login dari IP baru / device baru
- TOTP bisa diingat 30 hari pada device terpercaya (trusted device cookie)

**Operator:** Opsional TOTP, direkomendasikan saat akses laporan keuangan.

**Customer:** Hanya password (tidak ada akses sistem — data customer diinput oleh operator).

### 1.6 Session Management

| Parameter | Nilai |
|-----------|-------|
| Access Token lifetime | 15 menit |
| Refresh Token lifetime | 7 hari |
| Refresh Token rotation | Setiap refresh, token lama di-revoke |
| Concurrent sessions | Maksimal 5 per user |
| Inactive timeout | 30 menit (server-side via Redis session tracker) |
| Absolute timeout | 12 jam (wajib re-login setelah shift) |
| Device tracking | IP + User-Agent fingerprint dicatat |

### 1.7 Brute Force Protection

```
Rate Limiting per IP:
├── /api/auth/login         5 req/15 menit  (1 IP)
├── /api/auth/forgot-pw     3 req/15 menit  (1 IP)
├── /api/auth/refresh       20 req/15 menit (1 IP)
└── /api/auth/totp-verify   5 req/15 menit  (1 user)
```

**Penanganan:**
- Setelah 5 gagal → akun terkunci 15 menit (Redis `login_attempts:{user_id}`)
- Setelah lockout ke-3 → akun wajib reset password via admin
- Notifikasi email ke user saat ada percobaan login gagal ≥3 kali
- Logging semua percobaan login (berhasil + gagal) ke audit trail

---

## 2. Authorization

### 2.1 Role-Based Access Control (RBAC)

```
┌──────────────────────────────────────────────────────────────┐
│                     HIERARKI ROLE                            │
│                                                              │
│  ┌────────────────────────────────┐                          │
│  │       SUPER_ADMIN              │                          │
│  │  - Semua akses                 │                          │
│  │  - Kelola cabang & user        │                          │
│  │  - Lihat semua data            │                          │
│  │  - Konfigurasi sistem          │                          │
│  └──────────┬─────────────────────┘                          │
│             │                                                │
│  ┌──────────▼─────────────────────┐                          │
│  │       ADMIN_CABANG             │                          │
│  │  - Akses terbatas per cabang   │                          │
│  │  - Kelola unit di cabang       │                          │
│  │  - Kelola operator cabang      │                          │
│  │  - Lihat laporan cabang        │                          │
│  │  - Atur pop-up store           │                          │
│  └──────────┬─────────────────────┘                          │
│             │                                                │
│  ┌──────────▼─────────────────────┐                          │
│  │         OPERATOR               │                          │
│  │  - Buat sewa                   │                          │
│  │  - Tracking unit               │                          │
│  │  - Lihat unit (cabang)         │                          │
│  │  - Selesaikan sewa             │                          │
│  │  - Dashboard cabang            │                          │
│  └────────────────────────────────┘                          │
│                                                              │
│  ┌────────────────────────────────┐                          │
│  │        CUSTOMER                │                          │
│  │  - Tidak login ke sistem       │                          │
│  │  - Data diinput oleh operator  │                          │
│  └────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Permission Matrix

| Permission | SUPER_ADMIN | ADMIN_CABANG | OPERATOR |
|-----------|:-----------:|:------------:|:--------:|
| **Dashboard** ||||
| `dashboard:view:all` | ✅ | ❌ | ❌ |
| `dashboard:view:branch` | ✅ | ✅ | ✅ |
| `dashboard:export` | ✅ | ✅ | ❌ |
| **Unit** ||||
| `unit:create` | ✅ | ✅ | ❌ |
| `unit:read:all` | ✅ | ❌ | ❌ |
| `unit:read:branch` | ✅ | ✅ | ✅ |
| `unit:update` | ✅ | ✅ | ❌ |
| `unit:delete` | ✅ | ❌ | ❌ |
| `unit:qr:print` | ✅ | ✅ | ✅ |
| **Sewa** ||||
| `rent:create` | ✅ | ✅ | ✅ |
| `rent:read:all` | ✅ | ❌ | ❌ |
| `rent:read:branch` | ✅ | ✅ | ✅ |
| `rent:cancel` | ✅ | ✅ | ❌ |
| `rent:refund` | ✅ | ❌ | ❌ |
| **Tracking** ||||
| `tracking:view:all` | ✅ | ❌ | ❌ |
| `tracking:view:branch` | ✅ | ✅ | ✅ |
| `tracking:geofence:manage` | ✅ | ✅ | ❌ |
| **Pop-up Store** ||||
| `popup:create` | ✅ | ✅ | ❌ |
| `popup:read:all` | ✅ | ❌ | ❌ |
| `popup:read:branch` | ✅ | ✅ | ✅ |
| `popup:update` | ✅ | ✅ | ❌ |
| `popup:delete` | ✅ | ✅ | ❌ |
| **Laporan** ||||
| `report:view:all` | ✅ | ❌ | ❌ |
| `report:view:branch` | ✅ | ✅ | ❌ |
| `report:export` | ✅ | ✅ | ❌ |
| `report:financial` | ✅ | ❌ | ❌ |
| **User Management** ||||
| `user:create` | ✅ | ✅ (operator only) | ❌ |
| `user:read` | ✅ | ✅ (branch) | ❌ |
| `user:update` | ✅ | ✅ (branch) | ❌ |
| `user:delete` | ✅ | ❌ | ❌ |
| `user:role:change` | ✅ | ❌ | ❌ |
| **Branch Management** ||||
| `branch:create` | ✅ | ❌ | ❌ |
| `branch:read` | ✅ | ✅ (own) | ❌ |
| `branch:update` | ✅ | ❌ | ❌ |
| `branch:settings` | ✅ | ❌ | ❌ |
| **System** ||||
| `system:settings` | ✅ | ❌ | ❌ |
| `system:audit-log` | ✅ | ❌ | ❌ |
| `system:backup` | ✅ | ❌ | ❌ |

### 2.3 Middleware Implementation (Nitro)

```typescript
// server/middleware/auth.ts
import { getServerSession } from '#auth';
import { verifyAccessToken } from '../utils/jwt';
import { checkPermission } from '../utils/permissions';

export default defineEventHandler(async (event) => {
  const { path } = event;
  
  // Public routes
  const publicPaths = ['/api/auth/login', '/api/auth/refresh', '/api/health'];
  if (publicPaths.some(p => path.startsWith(p))) return;

  // Verify JWT
  const token = getCookie(event, 'access_token');
  if (!token) throw createError({ statusCode: 401, message: 'Tidak terautentikasi' });

  const payload = await verifyAccessToken(token);
  if (!payload) throw createError({ statusCode: 401, message: 'Token tidak valid atau sudah kedaluwarsa' });

  // Attach user ke context
  event.context.user = {
    id: payload.sub,
    role: payload.role,
    cabangId: payload.cabang_id,
  };

  // RBAC check via permission map
  const requiredPermission = getRequiredPermission(path, event.method);
  if (requiredPermission) {
    const hasAccess = await checkPermission(event.context.user, requiredPermission);
    if (!hasAccess) {
      throw createError({ statusCode: 403, message: 'Anda tidak memiliki akses' });
    }
  }
});
```

### 2.4 Data Isolation per Cabang

```typescript
// Query level data isolation
async function getUnitsForUser(user: UserContext, filters: UnitFilters) {
  if (user.role === 'SUPER_ADMIN') {
    return db.query.units.findMany({ where: filters });
  }
  // Non-super-admin: otomatis filter by cabang
  return db.query.units.findMany({
    where: {
      ...filters,
      cabangId: user.cabangId, // Wajib — tidak bisa melihat unit cabang lain
    },
  });
}
```

---

## 3. Data Encryption

### 3.1 Encryption at Rest

| Jenis Data | Algoritma | Key Size | Mode |
|------------|-----------|----------|------|
| Database (PostgreSQL) | AES-256-GCM | 256-bit | Full Disk Encryption (filesystem) |
| Kolom sensitif DB (PII) | AES-256-GCM per field | 256-bit | Application-level encryption |
| Backup database | AES-256-CBC | 256-bit | Encrypted backup file |
| File uploads (struk, foto) | AES-256-GCM | 256-bit | Object-level encryption (Cloudflare R2) |
| Redis cache | AES-256-GCM | 256-bit | Memory encryption (Redis Enterprise) |

**Master Key Management:**
```
┌─────────────────┐
│ Cloudflare      │
│ Secrets  ───────▶ Environment Variable: DB_ENCRYPTION_KEY
│ (Master Key)    │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Data Encryption │  ← Per-field DEK di-generate dari Master Key
│ Key (DEK)       │    via HKDF-SHA256 dengan salt per kolom
└─────────────────┘
```

**PII Fields that MUST be encrypted at application level:**
- `customer.nama` — nama orang tua (AES-256-GCM)
- `customer.nomor_hp` — nomor telepon (AES-256-GCM)
- `customer.nama_anak` — nama anak (AES-256-GCM)
- `user.email` — email user (AES-256-GCM)
- `user.phone` — nomor telepon user (AES-256-GCM)

### 3.2 Encryption in Transit

| Layer | Protocol | Konfigurasi |
|-------|----------|-------------|
| Client ↔ Cloudflare | TLS 1.3 | Strict, HSTS, minimum TLS 1.3 |
| Cloudflare ↔ Origin Server | TLS 1.3 | Full (strict) SSL mode, certificate pinning |
| Service ↔ Database | TLS 1.3 | CA-signed certificates, client certificate verification |
| Service ↔ Redis | TLS 1.3 | stunnel or Redis TLS |
| Service ↔ Service (internal) | mTLS 1.3 | Mutual TLS dengan internal CA |
| WebSocket (tracking) | WSS (TLS) | Same origin policy, token-based auth |

### 3.3 TLS Configuration

```nginx
# Nginx / reverse proxy TLS configuration
ssl_protocols TLSv1.3;
ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256;
ssl_prefer_server_ciphers off;  # TLS 1.3 client preference

ssl_ecdh_curve X25519:prime256v1;
ssl_session_tickets off;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
```

---

## 4. API Security

### 4.1 Rate Limiting

Menggunakan Cloudflare Rate Limiting + Nitro server middleware.

| Endpoint | Limit | Window | Action on Exceed |
|----------|-------|--------|------------------|
| `/api/auth/login` | 5 | 15 menit | Block + 429 response |
| `/api/auth/*` | 20 | 15 menit | 429 response |
| `/api/units/*` | 100 | 1 menit | 429 response |
| `/api/rent/*` | 30 | 1 menit | 429 response |
| `/api/tracking/*` | 60 | 1 menit | 429 response |
| `/api/reports/*` | 20 | 1 menit | 429 response |
| Global (all endpoints) | 600 | 1 menit | IP ban 5 menit |
| WebSocket connections | 10 per IP | Concurrent | Reject new |

**Rate Limit Response:**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Terlalu banyak permintaan. Coba lagi dalam 45 detik.",
  "retry_after": 45
}
```

### 4.2 CORS Policy

```typescript
// Nuxt Nitro CORS configuration
export default defineNitroConfig({
  cors: {
    // Hanya allow origin yang diketahui
    origin: [
      'https://rentalmobilanak.id',
      'https://admin.rentalmobilanak.id',
      // Development
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials: true,
    maxAge: 86400, // 24 jam
  },
});
```

### 4.3 CSRF Protection

- **Nuxt API routes:** built-in CSRF protection via `useCsrf()` composable
- **Token synchronization:** Double Submit Cookie pattern
- **CSRF token:** Set via cookie `csrf_token` (SameSite=Strict, HTTP-only=false, Secure)
- **Header:** Client baca cookie dan kirim via `X-CSRF-Token` header
- **State-changing methods** (POST, PUT, PATCH, DELETE) wajib CSRF token

```typescript
// Nitro middleware CSRF check
export default defineEventHandler(async (event) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.method)) {
    const csrfCookie = getCookie(event, 'csrf_token');
    const csrfHeader = getHeader(event, 'X-CSRF-Token');
    
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      throw createError({ statusCode: 403, message: 'CSRF token tidak valid' });
    }
  }
});
```

### 4.4 Input Validation

Semua input WAJIB divalidasi server-side. Client-side validation hanya untuk UX.

**Validasi menggunakan Zod schema:**

```typescript
// server/utils/validation.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid').max(255),
  password: z.string().min(8, 'Password minimal 8 karakter').max(128),
});

export const CreateRentalSchema = z.object({
  unitId: z.string().uuid('ID unit tidak valid'),
  customerName: z.string().min(2).max(100).trim(),
  customerPhone: z.string().regex(/^08\d{8,11}$/, 'Format nomor HP tidak valid'),
  childName: z.string().min(1).max(50).trim(),
  durationMinutes: z.number().int().min(15).max(480).multipleOf(15),
  paymentMethod: z.enum(['TUNAI', 'QRIS', 'TRANSFER']),
  cabangId: z.string().uuid(),
});

export const UnitFilterSchema = z.object({
  search: z.string().max(100).optional(),
  status: z.enum(['TERSEDIA', 'DISEWA', 'SERVICE', 'RUSAK', 'NONAKTIF']).optional(),
  type: z.string().max(50).optional(),
  cabangId: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(10).max(100).default(50),
});

// Middleware validasi
export async function validateInput<T>(event: any, schema: z.ZodSchema<T>): Promise<T> {
  const body = await readBody(event);
  const result = schema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: 'Input tidak valid',
      data: result.error.flatten().fieldErrors,
    });
  }
  return result.data;
}
```

### 4.5 Request ID & Tracing

Setiap request wajib memiliki `X-Request-ID`:
- Client generate UUID v4 jika tidak ada
- Dicatat di log
- Dikirim ke downstream services
- Dipakai untuk debugging & incident response

---

## 5. Database Security

### 5.1 Drizzle ORM — Parameterized Queries

**Semua query wajib menggunakan Drizzle ORM query builder** untuk mencegah SQL injection.

```typescript
// ✅ BENAR — Parameterized via Drizzle
const units = await db.query.units.findMany({
  where: eq(units.cabangId, cabangId),
});

// ✅ BENAR — Dynamic filters
const result = await db.select()
  .from(units)
  .where(
    and(
      cabangId ? eq(units.cabangId, cabangId) : undefined,
      status ? eq(units.status, status) : undefined,
    )
  );

// ❌ SALAH — JANGAN gunakan raw SQL string dengan interpolasi
const result = await db.execute(`SELECT * FROM units WHERE cabang_id = '${cabangId}'`);

// ✅ Raw SQL hanya dengan parameterized ($1, $2)
const result = await db.execute(
  `SELECT * FROM units WHERE cabang_id = $1 AND status = $2`,
  [cabangId, status]
);
```

### 5.2 Database Connection Security

| Parameter | Konfigurasi |
|-----------|-------------|
| Host | Internal IP only (tidak exposed ke internet) |
| Port | 5432 (PostgreSQL), hanya dari VPC private subnet |
| SSL | Wajib, full verification (`sslmode=verify-full`) |
| Authentication | SCRAM-SHA-256 |
| Connection pool | Max 20 connections, timeout 30s |
| Credential rotation | Setiap 90 hari |
| Firewall | Hanya allowlist IP app server |

### 5.3 Database User Permissions

```sql
-- Principle of Least Privilege: 3 user roles

-- App user (read/write data, no DDL)
CREATE ROLE app_user WITH LOGIN PASSWORD '<secret>';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
REVOKE CREATE ON SCHEMA public FROM app_user;

-- Read-only user (reporting)
CREATE ROLE app_readonly WITH LOGIN PASSWORD '<secret>';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;

-- Migration user (DDL only, used in CI/CD)
CREATE ROLE app_migration WITH LOGIN PASSWORD '<secret>';
GRANT ALL PRIVILEGES ON SCHEMA public TO app_migration;
```

### 5.4 Sensitive Data Handling

| Data | Storage | Query |
|------|---------|-------|
| Password hash | bcrypt ($2a$12$...) | Never returned in API response |
| PII (nama, HP, email) | AES-256-GCM encrypted | Decrypt only when needed, never in logs |
| Refresh token hash | SHA-256 | Compare hash, never store raw |
| TOTP secret | AES-256-GCM encrypted | Decrypt only for verification |
| API keys | SHA-256 hashed | Compare hash, never store raw |
| Payment data | Tokenized (payment gateway) | Never store full card number |

### 5.5 Backup Security

- Backup otomatis setiap 6 jam, disimpan di Cloudflare R2
- Encrypted dengan AES-256-CBC sebelum upload
- Retensi: 30 hari (daily), 12 bulan (monthly)
- Backup diuji restore setiap bulan
- Akses R2 bucket hanya via IAM role, tidak pakai access key

---

## 6. Infrastructure Security

### 6.1 Arsitektur Keamanan Jaringan

```
                          INTERNET
                             │
                    ┌────────▼────────┐
                    │  Cloudflare WAF  │
                    │  - DDoS (L3/4/7) │
                    │  - Bot Management│
                    │  - Rate Limiting │
                    │  - Managed Rules │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Load Balancer │
                    │   - TLS termin. │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
  ┌─────▼─────┐      ┌──────▼──────┐      ┌──────▼──────┐
  │  Nuxt App │      │  Nuxt App   │      │ Background  │
  │  Server 1 │      │  Server 2   │      │ Worker      │
  └─────┬─────┘      └──────┬──────┘      └──────┬──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐  ┌────▼─────┐  ┌─────▼─────┐
        │ PostgreSQL │  │  Redis   │  │ Cloudflare│
        │ (Primary)  │  │ (Cache)  │  │    R2     │
        └───────────┘  └──────────┘  └───────────┘
```

**Network Rules:**
- Semua komponen di VPC private subnet
- Hanya Load Balancer yang di public subnet
- Database & Redis: private subnet, no public IP
- Service-to-service communication: internal VPC network + mTLS
- Egress filtering: allowlist domains only (payment gateway, Cloudflare API, monitoring)

### 6.2 Cloudflare Firewall Rules

```
# WAF Managed Rulesets
- Cloudflare Managed Ruleset (OWASP Core)  → Block
- Cloudflare OWASP XSS, SQLi               → Block  
- Cloudflare Sensitive Data Detection      → Log only
- Custom rules:

# Rule 1: Block known malicious IPs
(ip.src in $malicious_ips) → Block

# Rule 2: Geo-restrict admin access  
(http.host eq "admin.rentalmobilanak.id" and ip.geoip.country ne "ID") → Challenge

# Rule 3: Rate limit API
(http.request.uri.path contains "/api/" and http.request.method eq "POST") → Rate Limit (30 req/1m)

# Rule 4: Block suspicious user agents
(http.user_agent contains "sqlmap" or http.user_agent contains "nikto") → Block

# Rule 5: Bot Fight Mode
cf.bot_management.score lt 30 → Challenge
```

### 6.3 DDoS Protection

| Layer | Proteksi |
|-------|----------|
| L3/4 | Cloudflare Magic Transit (atau Spectrum) — volumetric attack absorption |
| L7 | Cloudflare WAF rate limiting + JS Challenge |
| DNS | Cloudflare DNS (anycast, high capacity) |
| Origin | Origin IP tidak pernah exposed; hanya terima traffic dari Cloudflare IP ranges (authenticated origin pulls) |

### 6.4 Container / Server Hardening

- App server: minimal base image (Alpine Linux)
- No root user dalam container
- Read-only filesystem untuk app (kecuali `/tmp` dan `/data`)
- Security patches: auto-update minor, manual approval major
- Tidak ada SSH access ke production server (gunakan Cloudflare Tunnel / Tailscale untuk emergency)
- Runtime security monitoring via Falco (syscall anomaly detection)
- Resource limits per container (CPU, memory)

---

## 7. Compliance

### 7.1 UU PDP Indonesia (UU No. 27 Tahun 2022)

Sebagai aplikasi yang mengumpulkan dan memproses data pribadi (nama, nomor HP, nama anak), kami wajib mematuhi Undang-Undang Pelindungan Data Pribadi Indonesia.

**Kewajiban:**

| Pasal | Kewajiban | Implementasi |
|-------|-----------|--------------|
| Pasal 20 | Dasar pemrosesan data | Persetujuan eksplisit (consent) via checkbox saat input data customer |
| Pasal 21 | Pemberitahuan tujuan | Privacy notice di form, jelaskan data digunakan hanya untuk keperluan sewa |
| Pasal 22 | Pembatasan tujuan | Data customer hanya untuk operasional rental, tidak dijual/dibagikan |
| Pasal 24 | Hak akses & koreksi | Admin dapat melihat & mengedit data customer |
| Pasal 25 | Hak hapus (right to erasure) | Admin dapat menghapus data customer via soft-delete; hard-delete setelah 90 hari |
| Pasal 26 | Hak batasi pemrosesan | Flag `do_not_process` di database |
| Pasal 30 | Notifikasi kebocoran data | Procedure incident response (lihat §11) — notifikasi ke BSSN dalam 3×24 jam |
| Pasal 32 | Data Protection Officer | DPO internal ditunjuk (opsional untuk skala ini, tapi direkomendasikan) |
| Pasal 35 | Keamanan pemrosesan | Enkripsi, access control, audit logging (seluruh dokumen ini) |
| Pasal 39 | Retensi data | Data customer dihapus setelah 2 tahun tidak ada transaksi |
| Pasal 40 | Transfer data lintas batas | Data disimpan di server Indonesia (Cloudflare data center Jakarta jika tersedia, atau Singapore dengan SCC) |

**Privacy Notice (ditampilkan di form pendaftaran customer):**
```
Privasi Data Anda

Kami mengumpulkan nama, nomor HP, dan nama anak semata-mata untuk keperluan
operasional penyewaan mobil-mobilan. Data Anda:

- TIDAK akan dijual atau dibagikan ke pihak ketiga
- Disimpan dengan enkripsi keamanan tinggi
- Dihapus otomatis setelah 2 tahun tidak ada aktivitas sewa
- Dapat diakses, dikoreksi, atau dihapus kapan saja dengan menghubungi operator

Dengan melanjutkan, Anda menyetujui pemrosesan data sesuai kebijakan privasi kami.
```

### 7.2 ISO 27001 Considerations

Rekomendasi kontrol yang relevan (tidak wajib sertifikasi, tapi sebagai referensi):

| ISO 27001 Annex A | Kontrol | Implementasi |
|-------------------|---------|--------------|
| A.5.1 | Information security policies | Dokumen ini |
| A.6.1 | Organization of information security | DPO + incident response team |
| A.7.1 | Human resource security | Background check operator, confidentiality agreement |
| A.8.1 | Asset management | Inventaris server, domain, database |
| A.9.1 | Access control | RBAC (lihat §2) |
| A.9.4 | System and application access control | JWT + permission matrix |
| A.10.1 | Cryptographic controls | AES-256, TLS 1.3, bcrypt |
| A.12.4 | Logging and monitoring | Audit logging (lihat §10) |
| A.12.6 | Technical vulnerability management | SAST/DAST testing (lihat §12) |
| A.14.2 | Security in development | Secure SDLC, code review |
| A.16.1 | Incident management | Incident response plan (lihat §11) |
| A.17.1 | Business continuity | Backup & disaster recovery |

---

## 8. Security Headers

### 8.1 Content Security Policy (CSP)

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  connect-src 'self' https://api.rentalmobilanak.id wss://tracking.rentalmobilanak.id;
  media-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  block-all-mixed-content;
  report-uri /api/csp-report;
```

**Catatan:** `'unsafe-inline'` pada script disediakan hanya untuk Turnstile (Cloudflare CAPTCHA). Evaluasi untuk dihapus setelah uji coba. `'unsafe-inline'` pada style karena Nuxt inline CSS di SSR.

**CSP Violation Reporting:**
```typescript
// server/api/csp-report.post.ts
export default defineEventHandler(async (event) => {
  const report = await readBody(event);
  console.warn('[CSP Violation]', JSON.stringify(report));
  // Kirim ke monitoring service (Sentry/Cloudflare Logpush)
  return { ok: true };
});
```

### 8.2 Full Security Headers

```http
# HTTP Response Headers (via Nitro server middleware)

Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0  # (deprecated, digantikan CSP; set 0 to avoid false positives)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cross-Origin-Resource-Policy: same-origin
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cache-Control: no-store (untuk halaman yang mengandung data sensitif)
Pragma: no-cache
X-Permitted-Cross-Domain-Policies: none
```

### 8.3 Header Middleware (Nitro)

```typescript
// server/middleware/security-headers.ts
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
  });
});
```

---

## 9. Secrets Management

### 9.1 Secret Inventory

| Secret | Lokasi | Rotasi | Akses |
|--------|--------|--------|-------|
| JWT Private Key (RS256) | Cloudflare Secrets / Env var | 90 hari | App server only |
| JWT Public Key (JWKS) | `/.well-known/jwks.json` | Ikut private key | Public read |
| Database Password | Cloudflare Secrets | 90 hari | App server + migration |
| Redis Password | Cloudflare Secrets | 90 hari | App server |
| DB Encryption Key (AES-256) | Cloudflare Secrets | 180 hari | App server |
| Cloudflare API Token | Cloudflare Secrets | 30 hari | CI/CD + admin |
| Payment Gateway API Key | Cloudflare Secrets | 90 hari | App server |
| TOTP Issuer Secret | Cloudflare Secrets | 180 hari | App server |
| Session Secret (cookie sign) | Env var | On deploy | App server |
| SMTP Password (email) | Cloudflare Secrets | 90 hari | App server |
| Sentry DSN | Env var | On change | App server |

### 9.2 Rules

1. **TIDAK ADA secret dalam source code.** Semua secret via environment variable atau Cloudflare Secrets.
2. **TIDAK ADA secret dalam log.** Semua logger wajib men-sanitasi header Authorization, cookie, query param yang mengandung token/key.
3. **Environment variable validation:** App gagal start jika required secret tidak ada.
4. **`.env` file:** Hanya `.env.example` (template) yang di-commit. `.env` di `.gitignore`.
5. **Production secret rotasi** via Cloudflare API / dashboard, bukan file manual.
6. **Audit akses secret:** Cloudflare audit log mencatat siapa yang mengakses secret.

### 9.3 .gitignore

```gitignore
# Secrets & environment
.env
.env.*
!.env.example

# Certificates
*.pem
*.key
*.crt
*.p12

# Cloudflare
.wrangler/state/

# Credentials
credentials.json
service-account.json
```

---

## 10. Audit Logging

### 10.1 Events yang Wajib Dicatat

| Kategori | Event | Detail |
|----------|-------|--------|
| **Authentication** | Login berhasil | user_id, IP, User-Agent, timestamp |
| | Login gagal | user_id/email, IP, alasan gagal, timestamp |
| | Logout | user_id, session_id, timestamp |
| | Password changed | user_id, oleh siapa, timestamp |
| | TOTP setup / reset | user_id, timestamp |
| **Authorization** | Access denied (403) | user_id, resource, permission required, timestamp |
| | Role changed | target_user_id, old_role, new_role, oleh siapa, timestamp |
| **Data** | Unit created / updated / deleted | unit_id, changes (diff), oleh siapa, timestamp |
| | Rental created / cancelled / refunded | rental_id, amount, oleh siapa, timestamp |
| | Customer data accessed / changed | customer_id, field changed, oleh siapa, timestamp |
| | Report exported | report_type, filter params, oleh siapa, timestamp |
| **System** | Server start / stop | version, environment, timestamp |
| | Configuration changed | setting_key, old_value, new_value, oleh siapa, timestamp |
| | Backup executed | backup_id, size, status, timestamp |
| | Error 500 | error message (sanitized), stack trace, request_id |

### 10.2 Log Format (Structured JSON)

```json
{
  "timestamp": "2026-06-07T14:32:15.123Z",
  "level": "INFO",
  "event": "user.login.success",
  "request_id": "uuid-request-12345",
  "actor": {
    "user_id": "user_abc123",
    "role": "ADMIN_CABANG",
    "cabang_id": "cabang_789",
    "ip": "192.168.1.1",
    "user_agent": "Mozilla/5.0 ..."
  },
  "target": {
    "type": "user",
    "id": "user_abc123"
  },
  "context": {
    "mfa_used": true,
    "session_duration": 86400
  },
  "metadata": {
    "version": "1.0.0",
    "environment": "production"
  }
}
```

### 10.3 Log Pipeline

```
App Server ──▶ stdout (JSON) ──▶ Cloudflare Logpush ──▶ Cloudflare R2
                                      │
                                      ▼
                                 Cloudflare Logs
                                 (Search & Analytics)
                                      │
                                      ▼
                                 Alerting Rules
                                 - >5 login gagal berturut-turut
                                 - >100 request 403 dalam 5 menit
                                 - Error 500 terjadi
```

### 10.4 Retention

| Log Type | Retensi Hot (R2) | Retensi Cold (Archive) |
|----------|-----------------|----------------------|
| Audit log | 90 hari | 2 tahun |
| Access log | 30 hari | 6 bulan |
| Error log | 90 hari | 1 tahun |
| Security events | 365 hari | 3 tahun |

### 10.5 Log Sanitization

Logger MUST sanitize:
- `Authorization` header (hanya simpan 6 karakter pertama)
- `Cookie` header (jangan log isinya)
- Password fields (mask entirely)
- `access_token` dan `refresh_token` di query parameter (jika ada, jangan log)
- PII yang tidak diperlukan untuk debugging

---

## 11. Incident Response Plan

### 11.1 Incident Severity Classification

| Severity | Deskripsi | Response Time | Eskalasi |
|----------|-----------|--------------|----------|
| **P1 — Critical** | Data breach, system down, financial loss | 15 menit | CEO, CTO, DPO, Legal |
| **P2 — High** | Partial service disruption, security bypass | 1 jam | CTO, Eng Lead |
| **P3 — Medium** | Bug keamanan non-critical, rate limit triggered | 4 jam | Eng Team |
| **P4 — Low** | Minor security issue, info disclosure non-sensitive | 24 jam | Eng Team |

### 11.2 Incident Response Workflow

```
┌──────────────┐
│ 1. DETECT    │ ← Alert dari monitoring / laporan user / bug bounty
└──────┬───────┘
       ▼
┌──────────────┐
│ 2. TRIAGE    │ ← Tentukan severity, assign Incident Commander
└──────┬───────┘
       ▼
┌──────────────┐
│ 3. CONTAIN   │ ← Blokir akses, revoke token, isolate system
└──────┬───────┘
       ▼
┌──────────────┐
│ 4. ANALYZE   │ ← Root cause analysis, scope impact, preserve evidence
└──────┬───────┘
       ▼
┌──────────────┐
│ 5. RESOLVE   │ ← Fix vulnerability, restore service
└──────┬───────┘
       ▼
┌──────────────┐
│ 6. NOTIFY    │ ← Internal stakeholders, BSSN (3x24h if data breach), affected users
└──────┬───────┘
       ▼
┌──────────────┐
│ 7. LEARN     │ ← Post-mortem, update security controls, prevent recurrence
└──────────────┘
```

### 11.3 Specific Scenarios

#### Data Breach (P1)

1. **Immediate (0–15 menit):**
   - Revoke semua token aktif (invalidate semua refresh token)
   - Putar database key (re-encrypt dengan key baru)
   - Putar JWT key pair
   - Blokir IP sumber (jika teridentifikasi)
2. **Short-term (15–60 menit):**
   - Identifikasi scope: data apa yang terekspos, berapa user terdampak
   - Preserve log sebagai bukti
   - Hubungi tim hukum
3. **Notification (3×24 jam):**
   - Notifikasi ke BSSN sesuai UU PDP Pasal 30
   - Notifikasi ke user terdampak: apa yang terjadi, data apa yang terekspos, langkah yang diambil, rekomendasi untuk user
4. **Post-mortem (1 minggu):**
   - RCA document
   - Update security controls
   - Penetration test ulang

#### Ransomware (P2)

1. Segera isolasi server terdampak dari network
2. Restore dari backup terakhir yang bersih
3. Analisis entry point
4. JANGAN bayar tebusan

#### DDoS (P2)

1. Cloudflare auto-mitigation (L3/4)
2. Jika L7 attack berlanjut: enable "I'm Under Attack" mode
3. Rate limit agresif
4. Geo-block jika attack dari region spesifik

### 11.4 Contact List

| Role | Kontak | Kapan |
|------|--------|-------|
| CTO | [INSERT] | P1, P2 |
| Engineering Lead | [INSERT] | P1, P2, P3 |
| DPO (Data Protection Officer) | [INSERT] | P1, data-related incidents |
| Legal Counsel | [INSERT] | P1, breach notification |
| Cloudflare Support | Enterprise plan | P1, infrastructure |

---

## 12. Security Testing

### 12.1 SAST (Static Application Security Testing)

**Tool:** Semgrep (open-source, CI-integrated)

```yaml
# .github/workflows/sast.yml (conceptual)
name: SAST
on: [pull_request]
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: semgrep/semgrep-action@v1
        with:
          config: p/typescript
          fail-on: error
          auditOn: push
```

**Ruleset yang dipakai:**
- `p/typescript` — TypeScript/JavaScript security rules
- `p/sql-injection` — SQL injection detection
- `p/secrets` — Hardcoded secrets detection
- `p/xss` — Cross-site scripting
- `p/jwt` — JWT security issues
- Custom rules: forbid `innerHTML`, `dangerouslySetInnerHTML`, raw SQL via `db.execute` with template literals

### 12.2 DAST (Dynamic Application Security Testing)

**Tool:** OWASP ZAP (Zed Attack Proxy) — scheduled weekly

```yaml
# Scheduled scan — weekly
name: DAST — OWASP ZAP Baseline
on:
  schedule:
    - cron: '0 2 * * 0'  # Minggu 02:00 WIB
jobs:
  zap_scan:
    runs-on: ubuntu-latest
    steps:
      - uses: zaproxy/action-baseline@v0.12.0
        with:
          target: 'https://staging.rentalmobilanak.id'
          fail_on_severity: 'High'
          rules_file_name: '.zap/rules.tsv'
```

**ZAP scan termasuk:**
- Passive scanning (semua request yang melewati proxy)
- Active scanning (POST ke staging environment)
- Spider dan AJAX spider untuk menemukan endpoint
- Custom context: authentication script untuk login sebagai tiap role

### 12.3 Dependency Scanning

**Tool:** Dependabot (GitHub) + `npm audit`

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
      time: "09:00"
      timezone: "Asia/Jakarta"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "security"
    assignees:
      - "engineering-team"
```

**Kebijakan:**
- Critical/High vulnerability: patch dalam 24 jam
- Medium: patch dalam 7 hari
- Low: patch dalam 30 hari
- Auto-merge untuk patch-level updates via CI (jika semua tes lolos)

### 12.4 Manual Security Review

- Code review WAJIB menyertakan security checklist (lihat §13)
- Penetration test tahunan oleh pihak ketiga
- Bug bounty program (opsional untuk fase awal; minimal ada kontak `security@rentalmobilanak.id` untuk pelaporan)

### 12.5 Pre-Commit Hooks

```bash
# .husky/pre-commit
npx lint-staged

# lint-staged.config.js
export default {
  '*.{ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{env,env.example}': ['git diff --exit-code -- .env || echo "WARNING: .env changes detected"'],
}
```

---

## 13. OWASP Top 10 Mitigations

### OWASP Top 10 (2021) — Mapping ke Implementasi

| # | Vulnerability | Mitigation | Status |
|---|--------------|------------|--------|
| **A01** | Broken Access Control | RBAC (§2), permission middleware, data isolation per cabang | ✅ |
| **A02** | Cryptographic Failures | AES-256-GCM, bcrypt cost 12, TLS 1.3 only, Cloudflare Secrets (§3, §9) | ✅ |
| **A03** | Injection | Drizzle ORM parameterized queries (§5.1), Zod input validation (§4.4), CSP (§8.1) | ✅ |
| **A04** | Insecure Design | Security review at PRD phase, threat modeling, secure SDLC (§12) | ✅ |
| **A05** | Security Misconfiguration | Security headers (§8), hardened containers (§6.4), Cloudflare WAF (§6.2) | ✅ |
| **A06** | Vulnerable Components | Dependabot + npm audit (§12.3), base image pinning | ✅ |
| **A07** | Auth Failures | JWT + refresh rotation (§1.2), bcrypt (§1.4), MFA (§1.5), brute force (§1.7) | ✅ |
| **A08** | Software & Data Integrity Failures | npm lockfile, artifact signing, SRI for CDN scripts, DB integrity checks | ✅ |
| **A09** | Logging & Monitoring Failures | Structured audit log (§10), Cloudflare Logpush, alerting rules | ✅ |
| **A10** | SSRF | Allowlist egress (§6.1), validate all outbound URLs, disable URL fetching from user input | ✅ |

### A01 — Broken Access Control Details

```
✓ Semua endpoint dilindungi middleware auth
✓ Permission check di setiap handler (bukan hanya di UI)
✓ Data isolation: query otomatis filter by cabang_id untuk non-super-admin
✓ Tidak ada IDOR: verifikasi ownership sebelum akses resource
✓ CSRF protection di semua state-changing request
✓ CORS strict whitelist
```

### A03 — Injection Details

```
✓ SQL: Drizzle ORM parameterized queries, no raw SQL concatenation
✓ XSS: Vue auto-escaping + CSP 'self' + no v-html without sanitization
✓ Command Injection: tidak ada exec() dengan user input
✓ LDAP/XML/Path Traversal: tidak relevan (tidak pakai LDAP/XML, path dibatasi)
✓ NoSQL Injection: tidak pakai MongoDB
```

### A08 — Integrity Details

```
✓ npm lockfile (package-lock.json) committed
✓ npm ci (bukan npm install) di CI/CD
✓ Subresource Integrity (SRI) untuk CDN-hosted third-party scripts
✓ Database integrity: foreign key constraints, CHECK constraints
✓ Backup integrity: checksum verification sebelum restore
```

---

## 14. Secure Development Lifecycle

### 14.1 Phase Gate Security Checklist

| Fase | Security Activity |
|------|------------------|
| **Design** | Threat modeling, data flow analysis, privacy review |
| **Development** | Input validation, parameterized queries, secure defaults |
| **Code Review** | Security checklist review, SAST scan pass |
| **Staging** | DAST scan (ZAP), dependency audit clean, security headers check |
| **Deploy** | Cloudflare WAF rules review, secret rotation check, rollback plan |
| **Post-Deploy** | Monitor error rate, audit log review, CSP violation report review |

### 14.2 Developer Security Checklist (per PR)

```markdown
## Security Checklist — Code Review

### Authentication & Authorization
- [ ] Apakah endpoint baru sudah dilindungi middleware auth?
- [ ] Apakah permission check sesuai role yang diizinkan?
- [ ] Apakah data diisolasi per cabang untuk non-super-admin?

### Input & Output
- [ ] Apakah semua input divalidasi dengan Zod schema?
- [ ] Apakah output di-escape (Vue auto-escaping)?
- [ ] Apakah tidak ada `v-html` atau `innerHTML` tanpa sanitasi?

### Database
- [ ] Apakah query menggunakan Drizzle ORM (bukan raw SQL string)?
- [ ] Apakah tidak ada SQL injection vector?
- [ ] Apakah kolom PII baru dienkripsi?

### Data
- [ ] Apakah ada data sensitif di log atau error message?
- [ ] Apakah response API tidak mengandung data yang tidak perlu?
- [ ] Apakah password/token tidak pernah di-return ke client?

### Dependencies
- [ ] Apakah `npm audit` tidak ada critical/high vulnerability?
- [ ] Apakah dependency baru sudah direview?
```

---

## 15. Quick Reference — Emergency Procedures

### Revoke All Sessions
```bash
# Via Cloudflare Worker / admin endpoint
POST /api/admin/emergency/revoke-all
# Revokes all refresh tokens, invalidates all JWTs
# Requires SUPER_ADMIN + TOTP
```

### Rotate Encryption Keys
```bash
# 1. Generate new key
openssl rand -hex 32 > new_encryption_key.hex

# 2. Update Cloudflare Secret
# Via Cloudflare Dashboard → Workers & Pages → Secrets

# 3. Re-encrypt database (one-time script)
npm run security:reencrypt-db

# 4. Verify
npm run security:verify-encryption
```

### Block Malicious IP
```bash
# Via Cloudflare Dashboard
# Security → WAF → Firewall Rules → Create Rule
# Field: IP Source Address → Operator: equals → Value: <IP>
# Action: Block
```

### Emergency Database Restore
```bash
# 1. Spin up new DB instance (isolated)
# 2. Download latest backup from R2
# 3. Decrypt backup
# 4. Restore
pg_restore -h $NEW_DB_HOST -U app_user -d rental_mobil_anak latest_backup.sql
# 5. Verify integrity
# 6. Switch app server to new DB
# 7. Investigate cause on old DB (forensic mode)
```

---

## 16. Document Control

| Field | Value |
|-------|-------|
| Created | 2026-06-07 |
| Last Review | 2026-06-07 |
| Review Cycle | Setiap 6 bulan atau setelah insiden signifikan |
| Classification | Internal — Confidential |
| Owner | Security Team / CTO |
| Approved By | [Pending Review] |
