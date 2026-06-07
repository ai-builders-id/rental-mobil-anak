# Development Roadmap
## Software Tracking & Manajemen Rental Mobil Mainan Listrik Anak

| Atribut | Nilai |
|---|---|
| **Proyek** | Sistem Tracking & Manajemen Rental Mobil Mainan Listrik Anak |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 7 Juni 2026 |
| **Acuan BRD** | `internal/docs/brd.md` v1.0 |
| **Tech Stack** | Nuxt 4 + Nuxt UI 4 (Vue 3 + Nitro Server) |
| **Target Infrastruktur** | Cloudflare VPS |

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [MVP Definition & Go-Live Criteria](#2-mvp-definition--go-live-criteria)
3. [Fase 1: Foundation](#3-fase-1-foundation)
4. [Fase 2: Core Features](#4-fase-2-core-features)
5. [Fase 3: Advanced Features](#5-fase-3-advanced-features)
6. [Fase 4: Scale & Production](#6-fase-4-scale--production)
7. [Timeline Ringkasan](#7-timeline-ringkasan)
8. [Post-Launch Support Plan](#8-post-launch-support-plan)
9. [Lampiran](#9-lampiran)

---

## 1. Gambaran Umum

### 1.1 Visi Produk

Sebuah platform digital terpadu yang menjadi **single source of truth** untuk seluruh operasional bisnis rental mobil-mobilan listrik anak di Indonesia — dari pelacakan 40.000 unit, manajemen 250 cabang, pencatatan transaksi sewa, hingga dashboard analytics untuk pengambilan keputusan strategis.

### 1.2 Prinsip Pengembangan

1. **Mobile-First** — Operator di lapangan hanya membawa smartphone; antarmuka harus optimal di layar kecil melalui PWA (Progressive Web App)
2. **Simplicity over Complexity** — Setiap fitur harus bisa digunakan oleh operator dengan literasi digital rendah; jangan tambahkan fitur yang tidak esensial
3. **Incremental Delivery** — Rilis kecil dan sering; setiap fase menghasilkan software yang bisa digunakan (bukan baru berguna di akhir)
4. **Data Integrity First** — Transaksi sewa adalah sumber kebenaran bisnis; zero tolerance untuk data loss atau inkonsistensi
5. **Scale-Ready Architecture** — Desain dari awal untuk 500+ cabang dan 80.000+ unit, meskipun MVP hanya menangani 50 cabang

### 1.3 Arsitektur High-Level

```
┌──────────────────────────────────────────────────────┐
│                   Cloudflare Layer                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ CDN (Static │  │ DNS & Proxy │  │ DDoS Protect │ │
│  │  Assets)    │  │              │  │              │ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
└──────────────────────────────────────────────────────┘
                          │
┌──────────────────────────────────────────────────────┐
│                Cloudflare VPS Instance                 │
│  ┌────────────────────────────────────────────────┐  │
│  │              Nuxt 4 Application                  │  │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────┐ │  │
│  │  │  Server  │  │   Vue 3   │  │   Nitro     │ │  │
│  │  │  Routes  │  │  Frontend  │  │   Server    │ │  │
│  │  │  (SSR)   │  │  (SPA/SSR) │  │   (API)     │ │  │
│  │  └──────────┘  └───────────┘  └─────────────┘ │  │
│  └────────────────────────────────────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Postgres │  │  Redis   │  │  Object Storage    │ │
│  │ (Primary)│  │ (Cache)  │  │  (Backup/Export)   │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 2. MVP Definition & Go-Live Criteria

### 2.1 Minimum Viable Product (MVP) — Cakupan

MVP adalah produk minimum yang **layak dan bisa digunakan** oleh pengguna nyata untuk menyelesaikan masalah bisnis inti. MVP mencakup seluruh **Fase 1 + Fase 2** dari roadmap ini.

#### Fitur MVP (Must-Have)

| No | Fitur | Deskripsi Singkat |
|---|---|---|
| 1 | Manajemen Unit | CRUD unit (ID unik, jenis, tahun beli, status), tampilan daftar dan detail unit |
| 2 | Manajemen Cabang | Pendaftaran cabang (nama, lokasi, kontak, owner) |
| 3 | Penjadwalan Event | Admin pusat dapat membuat event pop-up (tanggal, lokasi, cabang, operator bertugas) |
| 4 | Alokasi Unit ke Event | Menugaskan unit-unit spesifik ke event tertentu |
| 5 | Sistem Sewa | Operator dapat: pilih unit → mulai sewa → selesai sewa → sistem hitung biaya otomatis |
| 6 | Dashboard Dasar | Ringkasan: total unit, unit aktif, unit rusak, event hari ini, pendapatan hari ini |
| 7 | Laporan Harian | Laporan pendapatan per cabang per hari, dapat diakses admin pusat dan owner cabang |
| 8 | Autentikasi & RBAC | Login, 4 role: Super Admin, Admin Pusat, Owner Cabang, Operator |
| 9 | PWA Basic | Dapat di-install di homescreen smartphone; berfungsi di browser mobile |
| 10 | UI dengan Nuxt UI 4 | Desain responsif, konsisten, dan mudah digunakan |

#### Yang BUKAN MVP (Ditunda ke Fase 3)

- Dashboard analytics dengan grafik tren
- Laporan mingguan/bulanan otomatis (MVP: laporan harian saja)
- Maintenance tracking
- Notifikasi dan alert
- Ekspor PDF/Excel
- Pembayaran digital
- Mobile app native

### 2.2 Kriteria Go-Live (Definition of Done untuk MVP)

Sebelum dinyatakan **Go-Live**, seluruh kriteria berikut harus terpenuhi:

| No | Kriteria | Metode Verifikasi | Status Target |
|---|---|---|---|
| GL-01 | Seluruh fitur MVP berfungsi tanpa critical bug | QA sign-off; 0 bug severity "Critical" atau "High" | Wajib |
| GL-02 | Pilot testing di 10 cabang berjalan lancar selama 2 minggu | Laporan pilot; feedback positif dari operator | Wajib |
| GL-03 | Operator dapat menyelesaikan transaksi sewa dalam < 30 detik | Pengukuran waktu saat pilot | Wajib |
| GL-04 | Sistem berhasil mencatat 100% transaksi tanpa data loss | Rekonsiliasi laporan sistem vs catatan manual selama pilot | Wajib |
| GL-05 | API response time p95 < 500ms pada beban 10 cabang simultan | Load testing | Wajib |
| GL-06 | Semua halaman mobile responsive dan berfungsi di Chrome & Safari mobile | Manual testing di 5 device berbeda | Wajib |
| GL-07 | Keamanan: HTTPS enforced, input validation, RBAC berfungsi | Security audit (basic) | Wajib |
| GL-08 | Database backup otomatis harian berfungsi | Verifikasi backup restore | Wajib |
| GL-09 | Dokumentasi pengguna (manual operator) tersedia | Dokumen lengkap dan telah direview oleh 2 operator | Wajib |
| GL-10 | Deployment ke Cloudflare VPS production berhasil dan stabil | Uptime 100% selama 72 jam setelah deployment | Wajib |

---

## 3. Fase 1: Foundation

### 3.1 Ikhtisar

**Tujuan:** Menyiapkan fondasi teknis — project scaffolding, arsitektur dasar, environment development, pipeline CI/CD, dan infrastruktur deployment. Tidak ada fitur bisnis yang dikembangkan; fokus 100% pada setup teknis.

**Durasi Estimasi:** 3–4 minggu

**Output Utama:** Aplikasi Nuxt 4 berjalan di semua environment (local, staging, production) dengan CI/CD aktif.

### 3.2 Deliverables

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F1-01 | Nuxt 4 project scaffolding | Inisialisasi project dengan `npx nuxi init`, konfigurasi TypeScript strict mode, ESLint + Prettier | Must |
| F1-02 | Struktur direktori standar | Implementasi struktur: `pages/`, `components/`, `server/api/`, `server/middleware/`, `composables/`, `stores/`, `utils/`, `types/`, `assets/`, `public/`, `prisma/` | Must |
| F1-03 | Konfigurasi Nuxt UI 4 | Setup Nuxt UI 4 modul, tema, color mode (light/dark awareness), custom CSS variables | Must |
| F1-04 | Database schema — initial | Design dan migrasi schema PostgreSQL menggunakan Prisma ORM (atau Drizzle ORM): tabel `users`, `branches`, `units`, `events`, `rentals` | Must |
| F1-05 | Autentikasi (Auth) | Implementasi login/logout/register dengan Nuxt Auth (sidebase/nuxt-auth atau Lucia Auth v3), session-based | Must |
| F1-06 | Role-Based Access Control (RBAC) | Middleware otorisasi: `super_admin`, `admin_pusat`, `owner_cabang`, `operator`; guard pada API routes dan halaman | Must |
| F1-07 | Development environment | Docker Compose untuk PostgreSQL + Redis lokal; environment variables (.env.example); seeding script untuk data dummy | Must |
| F1-08 | CI/CD pipeline | GitHub Actions: lint → typecheck → build → test pada setiap push; deployment otomatis ke staging pada merge ke `develop` | Must |
| F1-09 | Staging environment | Deployment ke Cloudflare VPS staging instance; domain staging terpisah | Must |
| F1-10 | Production environment | Provisioning Cloudflare VPS production; konfigurasi nginx reverse proxy; setup domain, SSL via Cloudflare | Must |
| F1-11 | PWA module | Konfigurasi `@vite-pwa/nuxt` — service worker, manifest, icons, caching strategy (network-first untuk API, cache-first untuk static assets) | Must |
| F1-12 | Logging & error tracking | Setup Nuxt server logging; integrasi Sentry (atau alternative) untuk error tracking client & server | Should |
| F1-13 | Dokumentasi setup | README.md: cara setup development, struktur direktori, coding conventions, git workflow | Must |

### 3.3 Milestones

| Tanggal (Estimasi) | Milestone | Verifikasi |
|---|---|---|
| **Minggu 1, Hari 5** | Project scaffolding + struktur direktori selesai; `bun dev` berjalan | Aplikasi membuka halaman default Nuxt di browser |
| **Minggu 2, Hari 5** | Database schema + autentikasi + RBAC berfungsi di local | Login sebagai 4 role berbeda berfungsi; halaman berbeda per role |
| **Minggu 3, Hari 5** | CI/CD pipeline berfungsi; staging environment live | Push ke GitHub → otomatis deploy ke staging; staging dapat diakses via browser |
| **Minggu 4, Hari 3** | Production environment siap; PWA berfungsi | Production URL dapat diakses; PWA dapat di-install di smartphone |
| **Minggu 4, Hari 5** | Fase 1 complete sign-off | Semua deliverable Must terpenuhi; demo ke stakeholder |

### 3.4 Dependencies & Prasyarat

- Akses ke Cloudflare dashboard (VPS provisioning)
- Domain telah dibeli dan dikonfigurasi
- GitHub repository dibuat (private)
- Development machine: Node.js 22+, Bun, Docker Desktop
- Akses ke package registry (npm/GitHub Packages) untuk Nuxt UI 4 (jika pro license)

### 3.5 Risiko Fase 1

| Risiko | Level | Mitigasi |
|---|---|---|
| Nuxt 4 masih dalam perkembangan, mungkin ada breaking changes | Sedang | Lock versi spesifik di package.json; monitor changelog; hindari fitur eksperimental |
| Kesulitan provisioning Cloudflare VPS | Rendah | Dokumentasi Cloudflare lengkap; fallback: gunakan VPS provider alternatif (Vultr, DigitalOcean) lalu proxy via Cloudflare |
| Konfigurasi RBAC kompleks | Rendah | Gunakan middleware sederhana; tidak perlu fine-grained permissions (cukup 4 role) |

---

## 4. Fase 2: Core Features

### 4.1 Ikhtisar

**Tujuan:** Membangun seluruh fitur bisnis inti (MVP) — manajemen unit, cabang, event, sistem sewa, dan dashboard dasar. Di akhir fase ini, aplikasi **siap di-pilot** ke 10 cabang.

**Durasi Estimasi:** 8–10 minggu

**Output Utama:** Aplikasi MVP yang berfungsi penuh, siap pilot testing.

### 4.2 Deliverables

#### Modul: Manajemen Unit

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F2-01 | Halaman daftar unit | Table dengan kolom: ID, jenis, status, cabang, lokasi terakhir; filter dan search; pagination | Must |
| F2-02 | Form tambah/edit unit | Field: ID unik (auto-generated), jenis/model, tahun pembelian, warna, status (tersedia/disewa/rusak/maintenance), cabang induk, catatan | Must |
| F2-03 | Halaman detail unit | Informasi lengkap unit + riwayat perpindahan antar cabang + riwayat sewa + riwayat maintenance | Should |
| F2-04 | Bulk import unit | Upload CSV/Excel untuk registrasi banyak unit sekaligus (untuk 40.000 unit tidak mungkin input manual) | Must |
| F2-05 | Status history unit | Mencatat setiap perubahan status unit dengan timestamp dan user yang mengubah | Should |

#### Modul: Manajemen Cabang & Event

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F2-06 | Halaman daftar cabang | Table: nama cabang, kota, provinsi, owner, jumlah unit, status aktif/non-aktif | Must |
| F2-07 | Form tambah/edit cabang | Field: nama, alamat lengkap, kota, provinsi, kontak (telp, email), owner (link ke user role owner_cabang), koordinat (opsional) | Must |
| F2-08 | Halaman daftar event | Kalender/timeline event: tanggal, nama event, lokasi, cabang, operator bertugas, jumlah unit, status (dijadwalkan/berlangsung/selesai/dibatalkan) | Must |
| F2-09 | Form tambah/edit event | Field: nama event, tanggal & jam, lokasi detail, cabang, operator (multi-select), unit yang dialokasikan, catatan, status izin event | Must |
| F2-10 | Alokasi unit ke event | Interface drag-and-drop atau multi-select untuk menugaskan unit ke event; validasi unit tidak double-booked | Must |
| F2-11 | View detail event | Ringkasan event: info event, daftar unit, transaksi sewa selama event, total pendapatan event | Should |

#### Modul: Sistem Sewa

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F2-12 | Halaman "Mulai Sewa" | Operator memilih unit → klik "Mulai Sewa" → sistem mencatat timestamp mulai; UI besar dan jelas untuk digunakan di lapangan | Must |
| F2-13 | Halaman "Selesai Sewa" | Operator memilih unit yang sedang disewa → klik "Selesai Sewa" → sistem hitung durasi → tampilkan biaya → operator konfirmasi pembayaran (tunai) | Must |
| F2-14 | Perhitungan tarif otomatis | Konfigurasi tarif: tarif dasar per 15 menit, tarif per menit berikutnya; rounding rules; biaya minimal | Must |
| F2-15 | Daftar sewa aktif | Operator dapat melihat semua unit yang sedang disewa (milik event mereka) — untuk memonitor unit yang belum dikembalikan | Must |
| F2-16 | Riwayat transaksi | Tabel transaksi sewa: unit, durasi, biaya, operator, event, timestamp; dapat difilter per tanggal/event/cabang | Must |
| F2-17 | Validasi unit | Tidak bisa memulai sewa jika unit status "rusak" atau "maintenance"; tidak bisa double-book unit yang sedang disewa | Must |

#### Modul: Dashboard & Laporan

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F2-18 | Dashboard overview | Cards: total unit, unit aktif, unit disewa, unit rusak, event hari ini, pendapatan hari ini, pendapatan bulan ini | Must |
| F2-19 | Laporan harian per cabang | Tabel pendapatan per cabang untuk tanggal tertentu; filter tanggal dan cabang | Must |
| F2-20 | Laporan pendapatan per event | Tabel: nama event, tanggal, jumlah transaksi, total pendapatan | Should |
| F2-21 | Laporan ringkasan untuk owner cabang | Owner cabang hanya melihat data cabangnya: ringkasan event, pendapatan, utilisasi unit | Must |

#### Modul: Manajemen Pengguna

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F2-22 | Halaman daftar pengguna (Admin) | CRUD user; assign role; link user ke cabang (untuk role owner_cabang dan operator) | Must |
| F2-23 | Profil pengguna | Edit profil sendiri: nama, email, password, avatar (opsional) | Should |
| F2-24 | Audit log aktivitas | Mencatat: user X melakukan aksi Y pada resource Z pada waktu T | Should |

### 4.3 Milestones

| Tanggal (Estimasi) | Milestone | Verifikasi |
|---|---|---|
| **Minggu 6, Hari 5** | Modul Manajemen Unit + Cabang selesai | CRUD unit dan cabang berfungsi; bulk import unit berhasil |
| **Minggu 10, Hari 5** | Modul Event + Alokasi Unit selesai | Membuat event, mengalokasikan unit, validasi double-booking berfungsi |
| **Minggu 13, Hari 5** | Modul Sistem Sewa selesai | Alur mulai sewa → selesai sewa → biaya tercatat berfungsi penuh; operator dapat menyelesaikan dalam < 30 detik |
| **Minggu 14, Hari 5** | Dashboard + Laporan selesai | Dashboard menampilkan data real-time; laporan harian akurat |
| **Minggu 15, Hari 3** | Internal QA selesai | Semua fitur diuji; bug critical dan high diperbaiki |
| **Minggu 15, Hari 5** | MVP complete — siap pilot | Demo ke stakeholder; persiapan pilot 10 cabang |

### 4.4 Dependencies

- Fase 1 (Foundation) selesai — terutama autentikasi, RBAC, database, dan environment
- Data sampel untuk bulk import unit (format CSV disepakati)
- Daftar 10 cabang pilot beserta data unit dan operator
- Konfigurasi tarif sewa sudah diputuskan oleh manajemen

---

## 5. Fase 3: Advanced Features

### 5.1 Ikhtisar

**Tujuan:** Menambahkan fitur lanjutan yang tidak kritis untuk MVP tetapi signifikan meningkatkan nilai aplikasi — dashboard analytics, maintenance tracking, notifikasi, dan ekspor data. Dimulai setelah MVP go-live.

**Durasi Estimasi:** 8 minggu

**Prasyarat:** MVP telah go-live dan stabil (minimal 4 minggu berjalan tanpa insiden kritis).

### 5.2 Deliverables

#### Modul: Maintenance Tracking

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F3-01 | Status "Maintenance" pada unit | Operator/admin dapat menandai unit sebagai "maintenance" dengan alasan dan perkiraan selesai | Must |
| F3-02 | Riwayat maintenance | Mencatat: unit, tanggal masuk, jenis perbaikan, biaya, status, tanggal selesai, teknisi | Must |
| F3-03 | Jadwal maintenance rutin | Konfigurasi interval maintenance (misal: setiap 100 jam operasional); sistem otomatis menandai unit untuk maintenance | Should |
| F3-04 | Alert unit idle | Unit yang tidak disewa > 14 hari muncul di dashboard sebagai "unit idle" | Should |

#### Modul: Dashboard Analytics

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F3-05 | Grafik tren pendapatan | Line chart pendapatan harian/mingguan/bulanan; filter per cabang, wilayah, atau nasional | Must |
| F3-06 | Heatmap utilisasi | Visualisasi utilisasi unit per wilayah/kota (warna hijau = tinggi, merah = rendah) | Should |
| F3-07 | Leaderboard cabang | Ranking cabang berdasarkan pendapatan, utilisasi, dan jumlah transaksi | Should |
| F3-08 | Leaderboard unit | Unit terproduktif (total pendapatan, total jam disewa) — membantu keputusan pembelian unit baru | Could |
| F3-09 | Dashboard "Business Overview" untuk manajemen | Dashboard eksekutif: revenue, cost (perkiraan), profit margin, unit utilization rate, event count, top/bottom branches | Must |

#### Modul: Notifikasi & Alert

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F3-10 | In-app notification | Bell icon di header dengan daftar notifikasi: event reminder, alert pendapatan rendah, unit maintenance selesai | Must |
| F3-11 | Notifikasi untuk operator | Reminder 1 hari sebelum event; reminder unit yang harus dikembalikan | Should |
| F3-12 | Notifikasi untuk admin | Alert: cabang tidak ada transaksi > 3 hari; unit rusak > 5; event tanpa operator | Should |
| F3-13 | WhatsApp notification (opsional) | Integrasi WhatsApp Business API untuk notifikasi penting (jika diperlukan dan ada budget) | Could |

#### Modul: Ekspor Data

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F3-14 | Ekspor laporan ke Excel | Semua laporan (harian, event, unit) dapat di-export ke .xlsx dengan format rapi | Must |
| F3-15 | Ekspor laporan ke PDF | Laporan ringkasan bulanan dalam format PDF siap cetak/kirim | Should |
| F3-16 | Ekspor data mentah ke CSV | Data mentah transaksi, unit, event untuk analisis lanjutan di tools eksternal | Should |

#### Modul: Peningkatan UI/UX

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F3-17 | Dark mode support | Toggle dark/light mode; auto-detect preferensi sistem | Should |
| F3-18 | Responsive optimization | Memastikan semua halaman optimal di tablet dan desktop (selain mobile) | Must |
| F3-19 | Loading states & skeleton screens | Skeleton loader saat data dimuat; tidak ada flash of empty content | Should |
| F3-20 | Error handling UI | Halaman error yang informatif (404, 500, network error) dengan recovery action | Should |

### 5.3 Milestones

| Tanggal (Estimasi) | Milestone | Verifikasi |
|---|---|---|
| **Minggu 19, Hari 5** | Maintenance Tracking selesai | Alur maintenance unit berfungsi penuh; riwayat tercatat |
| **Minggu 22, Hari 5** | Dashboard Analytics selesai | Grafik menampilkan data akurat; filter berfungsi; dashboard eksekutif siap |
| **Minggu 24, Hari 5** | Notifikasi + Ekspor selesai | Notifikasi muncul sesuai trigger; ekspor Excel/PDF berfungsi |
| **Minggu 25, Hari 5** | Fase 3 complete | Semua fitur diuji; deployment ke production |

---

## 6. Fase 4: Scale & Production

### 6.1 Ikhtisar

**Tujuan:** Optimasi performa untuk skala penuh 250 cabang + 40.000 unit; hardening keamanan dan infrastruktur; persiapan ekspansi ke 500 cabang; dokumentasi dan knowledge transfer.

**Durasi Estimasi:** 6–8 minggu

### 6.2 Deliverables

#### Optimasi Performa & Skalabilitas

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F4-01 | Database query optimization | Analisis slow queries; tambahkan index; optimasi query N+1; gunakan query batching dimana perlu | Must |
| F4-02 | Redis caching layer | Caching untuk: data dashboard, daftar unit, konfigurasi tarif; cache invalidation strategy | Must |
| F4-03 | Pagination optimization | Semua list/table menggunakan cursor-based pagination (bukan offset-based) untuk data besar | Must |
| F4-04 | Load testing 250+ cabang | Simulasi 250 cabang simultan dengan k6 atau Artillery; identifikasi bottleneck dan perbaiki | Must |
| F4-05 | API rate limiting | Rate limiting per user/IP; proteksi dari abuse dan DDoS di level aplikasi | Must |
| F4-06 | Static asset optimization | Lazy loading images; code splitting; bundle analysis; tree shaking | Should |

#### Infrastruktur & Keamanan

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F4-07 | Automated backup & disaster recovery | Backup database harian + retensi 30 hari; backup ke Cloudflare R2 atau S3-compatible storage; prosedur restore teruji | Must |
| F4-08 | Security hardening | CSP headers; CORS policy; dependency audit; environment variables audit; penghapusan endpoint/package tidak terpakai | Must |
| F4-09 | Monitoring & alerting production | Setup UptimeRobot/Cloudflare health checks; alert via email/chat jika server down; dashboard monitoring resource (CPU, RAM, disk) | Must |
| F4-10 | CI/CD production pipeline | One-click atau auto-deployment ke production; rollback capability; deployment smoke tests | Must |
| F4-11 | Horizontal scaling readiness | Pastikan aplikasi stateless — session disimpan di Redis; file upload ke object storage; siap untuk multi-instance jika beban meningkat | Should |

#### Adopsi & Pelatihan Skala Nasional

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F4-12 | Onboarding 250 cabang | Rencana bertahap: batch 50 cabang per minggu; support hotline untuk masalah onboarding | Must |
| F4-13 | Video tutorial operator | Video singkat (3–5 menit) untuk setiap tugas utama: login, mulai sewa, selesai sewa, lihat laporan | Must |
| F4-14 | SOP digital terintegrasi | Checklist keamanan event, prosedur maintenance, prosedur eskalasi masalah — tersedia di dalam aplikasi | Should |
| F4-15 | Feedback loop | Fitur "Laporkan Masalah" / feedback button di aplikasi; form survei kepuasan untuk operator dan admin | Should |

#### Dokumentasi & Handover

| ID | Deliverable | Deskripsi | Prioritas |
|---|---|---|---|
| F4-16 | Technical documentation | Arsitktur sistem, API reference, database ERD, deployment guide, environment variables reference | Must |
| F4-17 | Operational runbook | Panduan operasional: cara backup/restore, cara handle incident, cara scale up/down, checklist maintenance rutin | Must |
| F4-18 | Knowledge transfer session | Sesi presentasi dan hands-on dengan tim teknis (jika ada penerus/tim maintenance) | Must |

### 6.3 Milestones

| Tanggal (Estimasi) | Milestone | Verifikasi |
|---|---|---|
| **Minggu 28, Hari 5** | Optimasi performa selesai | Load test 250 cabang lulus; response time p95 < 500ms |
| **Minggu 31, Hari 5** | Infrastruktur & keamanan selesai | Security audit lulus; backup-restore teruji; monitoring aktif |
| **Minggu 33, Hari 5** | Onboarding 250 cabang selesai | Semua cabang tercatat di sistem; 95% transaksi via sistem |
| **Minggu 34, Hari 5** | Fase 4 complete — Production stable | Sistem berjalan stabil ≥ 2 minggu dengan 250 cabang aktif; dokumentasi lengkap |

---

## 7. Timeline Ringkasan

### 7.1 Gantt Chart (Estimasi)

```
Bulan    │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │
─────────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
Fase 1   │████│    │    │    │    │    │    │    │    │    │    │    │
Foundation│███ │    │    │    │    │    │    │    │    │    │    │    │
         │    │    │    │    │    │    │    │    │    │    │    │    │
Fase 2   │    │████│████│████│██  │    │    │    │    │    │    │    │
Core     │    │████│████│████│██  │    │    │    │    │    │    │    │
Features │    │    │    │    │    │    │    │    │    │    │    │    │
         │    │    │    │    │    │    │    │    │    │    │    │    │
MVP Go-  │    │    │    │    │    │ ✈  │    │    │    │    │    │    │
Live     │    │    │    │    │    │    │    │    │    │    │    │    │
         │    │    │    │    │    │    │    │    │    │    │    │    │
Fase 3   │    │    │    │    │    │    │████│████│    │    │    │    │
Advanced │    │    │    │    │    │    │████│████│    │    │    │    │
Features │    │    │    │    │    │    │    │    │    │    │    │    │
         │    │    │    │    │    │    │    │    │    │    │    │    │
Fase 4   │    │    │    │    │    │    │    │    │████│████│    │    │
Scale &  │    │    │    │    │    │    │    │    │████│████│    │    │
Production│   │    │    │    │    │    │    │    │    │    │    │    │
         │    │    │    │    │    │    │    │    │    │    │    │    │
Stabil-  │    │    │    │    │    │    │    │    │    │    │████│████│
ization  │    │    │    │    │    │    │    │    │    │    │████│████│
```

### 7.2 Tonggak Penting (Key Dates)

| Tanggal | Event | Fase |
|---|---|---|
| **Akhir Bulan 1** | Development environment + CI/CD siap | Fase 1 |
| **Akhir Bulan 4** | Core features selesai — internal QA | Fase 2 |
| **Awal Bulan 5** | Pilot 10 cabang dimulai (2 minggu) | Fase 2 |
| **Akhir Bulan 5** | **MVP GO-LIVE** | Fase 2 |
| **Akhir Bulan 7** | Advanced features selesai | Fase 3 |
| **Akhir Bulan 9** | Optimasi 250 cabang selesai | Fase 4 |
| **Akhir Bulan 10** | Semua cabang onboarded | Fase 4 |
| **Akhir Bulan 12** | Production stable, handover lengkap | Fase 4 |

### 7.3 Alokasi Tim

| Peran | Fase 1 | Fase 2 | Fase 3 | Fase 4 |
|---|---|---|---|---|
| **Frontend Developer (Nuxt/Vue)** | 100% | 100% | 80% | 50% |
| **Backend/Fullstack Developer (Nuxt/Nitro)** | 100% | 100% | 80% | 60% |
| **UI/UX Designer** | 50% | 50% | 30% | 10% |
| **QA** | 20% | 50% | 50% | 30% |
| **DevOps** | 30% | 10% | 10% | 40% |
| **Business Analyst / PM** | 30% | 30% | 30% | 20% |

---

## 8. Post-Launch Support Plan

### 8.1 Periode Hipercare (0–4 Minggu Pasca Go-Live)

**Tujuan:** Memastikan stabilitas sistem dan respon cepat terhadap masalah.

| Aktivitas | Detail |
|---|---|
| **Support channel** | WhatsApp group khusus support untuk operator dan admin; 1 developer on-call setiap hari (07:00–21:00, peak jam operasional) |
| **Daily standup** | Meeting 15 menit setiap pagi: review issue kemarin, rencana hari ini |
| **Bug fix SLA** | Critical: < 4 jam; High: < 24 jam; Medium: < 72 jam; Low: sprint berikutnya |
| **Hotfix process** | Branch `hotfix/*` → code review → deploy langsung ke production (skip staging jika urgent) |
| **Monitoring intensif** | Dashboard real-time: error rate, response time, active users; alert ke on-call developer jika metrik abnormal |

### 8.2 Periode Stabilisasi (1–6 Bulan Pasca Go-Live)

| Aktivitas | Detail |
|---|---|
| **Sprint cadence** | Sprint 2-mingguan; campuran bug fix, improvement minor, dan persiapan Fase 3 |
| **User feedback review** | Setiap 2 minggu: review feedback dari operator dan admin; prioritasi backlog |
| **Performance review** | Bulanan: analisis performa sistem, identifikasi area optimasi |
| **Training lanjutan** | Sesi Q&A mingguan untuk operator baru atau yang kesulitan |
| **Feature adoption tracking** | Monitor metrik: % transaksi via sistem, % operator aktif harian; intervensi untuk cabang dengan adopsi rendah |

### 8.3 Periode BAU (Business as Usual — 6+ Bulan)

| Aktivitas | Detail |
|---|---|
| **Maintenance window** | Setiap Senin 03:00–05:00 WIB (jam sepi) untuk deployment dan maintenance rutin |
| **Sprint backlog** | Fitur baru, enhancement, dan bug fix diprioritasi berdasarkan feedback dan kebutuhan bisnis |
| **Security patches** | Update dependencies setiap bulan; audit keamanan setiap 6 bulan |
| **Quarterly business review** | Evaluasi KPI sistem vs target bisnis; rekomendasi untuk pengembangan selanjutnya |
| **Knowledge base** | Dokumentasi FAQ, troubleshooting guide, dan best practices — diakses mandiri oleh pengguna |

### 8.4 Eskalasi Masalah

```
Level 1: Operator
    │  Masalah operasional ringan (lupa password, cara pakai fitur)
    ▼
Level 2: Admin Cabang / Owner Cabang
    │  Masalah data cabang, unit tidak muncul, laporan tidak sesuai
    ▼
Level 3: Admin Pusat
    │  Koordinasi masalah yang melibatkan banyak cabang; keputusan bisnis
    ▼
Level 4: Tim Developer (on-call)
    │  Bug sistem; error; server down; data integrity issue
    ▼
Level 5: Manajemen / Business Owner
       Keputusan strategis; perubahan scope/major feature request
```

---

## 9. Lampiran

### 9.1 Tech Stack Detail

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Framework** | Nuxt | v4.x | Fullstack Vue framework dengan Nitro server |
| **UI Library** | Nuxt UI | v4.x | Component library untuk Nuxt |
| **Runtime** | Node.js | v22 LTS | JavaScript runtime |
| **Package Manager** | Bun | latest | Cepat, kompatibel dengan npm |
| **Language** | TypeScript | v5.x | Strict mode |
| **Database ORM** | Prisma | v6.x | Type-safe database client |
| **Database** | PostgreSQL | v16 | Primary database |
| **Cache** | Redis | v7.x | Session store + application cache |
| **Auth** | Lucia Auth v3 / sidebase nuxt-auth | latest | Session-based authentication |
| **Validation** | Zod | v3.x | Schema validation |
| **PWA** | @vite-pwa/nuxt | latest | PWA capabilities |
| **CI/CD** | GitHub Actions | — | Automated pipeline |
| **Hosting** | Cloudflare VPS | — | Single-instance production |
| **CDN** | Cloudflare CDN | Free tier | Static assets + proxy |
| **Monitoring** | Sentry | — | Error tracking |
| **Uptime** | UptimeRobot | Free tier | Uptime monitoring |

### 9.2 Direktori Project (Struktur Target)

```
rental-mobil-anak/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, typecheck, test
│       └── deploy.yml          # Deploy staging & production
├── assets/
│   ├── css/
│   │   └── main.css
│   └── images/
├── components/
│   ├── common/                 # Shared: Button, Modal, Table, etc.
│   ├── unit/                   # Komponen spesifik manajemen unit
│   ├── branch/                 # Komponen spesifik cabang
│   ├── event/                  # Komponen spesifik event
│   ├── rental/                 # Komponen spesifik sistem sewa
│   ├── dashboard/              # Komponen dashboard
│   └── layout/                 # Layout: Sidebar, Header, etc.
├── composables/                # Reusable Vue composables
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useUnit.ts
│   └── useRental.ts
├── layouts/
│   ├── default.vue
│   ├── auth.vue
│   └── operator.vue            # Layout khusus operator (minimal)
├── middleware/
│   ├── auth.ts                 # Global auth guard
│   └── role.ts                 # Role-based redirect
├── pages/
│   ├── index.vue               # Redirect ke dashboard
│   ├── login.vue
│   ├── dashboard.vue
│   ├── units/
│   │   ├── index.vue           # Daftar unit
│   │   ├── [id].vue            # Detail unit
│   │   └── import.vue          # Bulk import
│   ├── branches/
│   │   ├── index.vue
│   │   └── [id].vue
│   ├── events/
│   │   ├── index.vue
│   │   ├── [id].vue
│   │   └── new.vue
│   ├── rentals/
│   │   ├── index.vue           # Daftar sewa hari ini (operator)
│   │   └── history.vue          # Riwayat transaksi
│   ├── reports/
│   │   └── index.vue
│   ├── users/
│   │   └── index.vue           # Admin only
│   └── settings/
│       └── index.vue
├── plugins/
│   └── pwa.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── favicon.ico
│   ├── manifest.webmanifest
│   └── icons/
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── register.post.ts
│   │   ├── units/
│   │   │   ├── index.get.ts     # List
│   │   │   ├── index.post.ts    # Create
│   │   │   ├── [id].get.ts      # Detail
│   │   │   ├── [id].put.ts      # Update
│   │   │   ├── [id].delete.ts   # Delete
│   │   │   └── import.post.ts   # Bulk import
│   │   ├── branches/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── events/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── rentals/
│   │   │   ├── index.get.ts
│   │   │   ├── start.post.ts    # Mulai sewa
│   │   │   └── [id]/stop.post.ts# Selesai sewa
│   │   ├── reports/
│   │   │   ├── daily.get.ts
│   │   │   └── summary.get.ts
│   │   ├── dashboard/
│   │   │   └── stats.get.ts
│   │   └── users/
│   │       ├── index.get.ts
│   │       └── [id].put.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── rbac.ts
│   └── utils/
│       ├── db.ts               # Prisma client singleton
│       ├── redis.ts            # Redis client
│       └── validation.ts        # Zod schemas
├── stores/                      # Pinia stores
│   ├── auth.ts
│   ├── units.ts
│   └── rental.ts
├── types/
│   └── index.ts                 # TypeScript interfaces
├── utils/
│   ├── format.ts                # Currency, date formatting
│   └── constants.ts
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── app.config.ts
├── docker-compose.yml
├── nuxt.config.ts
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

### 9.3 Database Schema — Entitas Utama

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(operator)
  branchId  String?
  branch    Branch?  @relation(fields: [branchId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  super_admin
  admin_pusat
  owner_cabang
  operator
}

model Branch {
  id        String   @id @default(cuid())
  name      String
  address   String
  city      String
  province  String
  phone     String?
  email     String?
  ownerId   String?
  owner     User?    @relation(fields: [ownerId], references: [id])
  isActive  Boolean  @default(true)
  units     Unit[]
  events    Event[]
  users     User[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Unit {
  id            String        @id @default(cuid())
  code          String        @unique
  type          String
  model         String?
  color         String?
  yearPurchased Int?
  status        UnitStatus    @default(available)
  branchId      String?
  branch        Branch?       @relation(fields: [branchId], references: [id])
  currentEventId String?
  currentEvent  Event?        @relation(fields: [currentEventId], references: [id])
  rentals       Rental[]
  maintenances  Maintenance[]
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum UnitStatus {
  available
  rented
  maintenance
  damaged
}

model Event {
  id         String        @id @default(cuid())
  name       String
  date       DateTime
  endDate    DateTime?
  location   String
  branchId   String
  branch     Branch        @relation(fields: [branchId], references: [id])
  status     EventStatus   @default(scheduled)
  permitNo   String?
  notes      String?
  operators  User[]        // Many-to-many sebaiknya explicit join table
  units      Unit[]
  rentals    Rental[]
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
}

enum EventStatus {
  scheduled
  ongoing
  completed
  cancelled
}

model Rental {
  id         String       @id @default(cuid())
  unitId     String
  unit       Unit         @relation(fields: [unitId], references: [id])
  eventId    String?
  event      Event?       @relation(fields: [eventId], references: [id])
  operatorId String
  operator   User         @relation(fields: [operatorId], references: [id])
  startTime  DateTime
  endTime    DateTime?
  duration   Int?         // dalam menit
  ratePerMinute Int       @default(1700)
  totalPrice Int?
  isPaid     Boolean      @default(false)
  notes      String?
  createdAt  DateTime     @default(now())
}

model Maintenance {
  id           String       @id @default(cuid())
  unitId       String
  unit         Unit         @relation(fields: [unitId], references: [id])
  type         String
  description  String?
  cost         Int?
  startedAt    DateTime     @default(now())
  completedAt  DateTime?
  technician   String?
  status       MaintenanceStatus @default(in_progress)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

enum MaintenanceStatus {
  in_progress
  completed
  cancelled
}
```

### 9.4 Risiko Timeline

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Fase 2 molor karena kompleksitas sistem sewa | MVP tertunda 1–2 bulan | Sederhanakan alur sewa; tunda fitur "should have" ke Fase 3 |
| Pilot menemukan masalah fundamental UI/UX | Perlu redesign signifikan | Testing UI/UX dengan operator sungguhan sejak awal Fase 2; jangan tunggu pilot |
| Koneksi internet operator lebih buruk dari antisipasi | Transaksi tidak bisa dicatat real-time | Prioritaskan offline capability di PWA; atau skenario: operator catat manual → admin input nanti |
| Cloudflare VPS tidak cukup untuk beban 250 cabang | Perlu upgrade atau arsitektur ulang | Load testing di awal Fase 4; rencana cadangan: multi-instance dengan load balancer |
| Tim developer keluar di tengah proyek | Kehilangan momentum, pengetahuan hilang | Dokumentasi teknis sejak Fase 1; code review rutin; tidak ada "single point of knowledge" |

### 9.5 Strategi Rollback jika Go-Live Gagal

Jika setelah go-live ditemukan masalah kritis yang tidak bisa diperbaiki dalam waktu singkat:

1. **Rollback aplikasi:** Kembali ke proses manual untuk cabang yang terdampak
2. **Data aman:** Semua data yang sudah tercatat di sistem tetap tersimpan; dapat direkonsiliasi nanti
3. **Perbaiki:** Tim fokus pada perbaikan masalah kritis; tidak ada fitur baru
4. **Re-deploy:** Setelah perbaikan terverifikasi, deploy ulang dan lanjutkan
5. **Komunikasi:** Semua stakeholder diinfokan tentang status dan rencana recovery

### 9.6 Riwayat Perubahan

| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 7 Juni 2026 | Dokumen awal roadmap | Business Analyst |

---

*Dokumen ini adalah rencana hidup (living document) dan akan diperbarui seiring perkembangan proyek. Setiap perubahan signifikan pada timeline, scope, atau deliverables harus direview dan disetujui oleh manajemen.*
