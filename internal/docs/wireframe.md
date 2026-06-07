# Wireframe Specifications — Rental Mobil Anak

> **Versi:** 1.0.0
> **Framework:** Nuxt UI 4 + Tailwind CSS v4
> **Referensi Design System:** `design.md`
> **Format:** Deskripsi naratif + ASCII layout
> **Notasi States:** `[L]` Loading, `[E]` Empty, `[R]` Error, `[S]` Success

---

## 0. Global Layout Shell

### 0.1 Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────┐│
│ │ [=] Logo   │ 🔍 Search (Cmd+K)...    │ 🔔 [A] Nama User ││
│ │            │                        │     ▼            ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────┬───────────────────────────────────────────────┐│
│ │ Sidebar  │                                              ││
│ │          │          <NuxtPage />                        ││
│ │ 260px    │                                              ││
│ │          │         Main Content Area                    ││
│ │ 📊 Dash. │                                              ││
│ │ 🚗 Unit  │         Scrollable (overflow-y-auto)         ││
│ │ 📋 Sewa  │                                              ││
│ │ 🗺 Track │                                              ││
│ │ 🏪 Popup │                                              ││
│ │ 📈 Lapor │                                              ││
│ │ ⚙ Seting │                                              ││
│ │          │                                              ││
│ └──────────┴───────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Status bar: © 2026 Rental Mobil Anak  |  v1.0.0         ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Komponen:**
- `UContainer` sebagai wrapper utama
- Header: `header` element, fixed top, `shadow-sm`, z-50
- Sidebar: `aside` element, `w-[260px]`, sticky top-16, overflow-y-auto
- Main: `main` element, `flex-1`, `min-h-screen`
- Footer: `footer` element, border-t

**States:**
- **[L]:** Sidebar skeleton links (5–7 baris shimmer)
- **[R]:** Sidebar tetap render, main content tampilkan error boundary

### 0.2 Mobile Layout (≤639px)

```
┌──────────────────────────────────┐
│ [=] Logo          🔔 [A]       │  ← Fixed header
├──────────────────────────────────┤
│                                  │
│        <NuxtPage />             │  ← Scrollable
│                                  │
│                                  │
├──────────────────────────────────┤
│  🏠 Dash │ 🚗 Unit │ 🗺 Track  │  ← Bottom Nav (fixed)
│  📋 Sewa │ 📈 Lapor  │ Lainnya  │
└──────────────────────────────────┘
```

**Komponen:**
- Header: compact, `h-14`
- Bottom Nav: `fixed bottom-0`, `h-16`, `safe-area-inset-bottom`, 4–5 icon+label items
- "Lainnya" membuka `USlideover` dari kanan (sidebar items yang tidak muat)
- Tidak ada footer text

**States:**
- **[L]:** Bottom nav tetap render
- Active tab: warna primary fill, scale slightly larger

---

## 1. Login Page

### 1.1 Layout

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│               ┌──────────────────┐                   │
│               │   [Logo App]     │                   │
│               │  🚗 Rental       │                   │
│               │  Mobil Anak      │                   │
│               └──────────────────┘                   │
│                                                      │
│          ┌─────────────────────────┐                 │
│          │   Masuk ke Dashboard    │  ← UCard        │
│          │                         │                 │
│          │  Email / Username       │  ← UInput       │
│          │  ┌───────────────────┐  │                 │
│          │  │ ketik email...    │  │                 │
│          │  └───────────────────┘  │                 │
│          │                         │                 │
│          │  Kata Sandi             │  ← UInput       │
│          │  ┌───────────────────┐  │  type:password  │
│          │  │ ••••••••••  [👁]  │  │  + show/hide   │
│          │  └───────────────────┘  │    toggle       │
│          │                         │                 │
│          │  [✓] Ingat saya         │  ← UCheckbox    │
│          │                         │                 │
│          │  ┌───────────────────┐  │                 │
│          │  │    M A S U K      │  │  ← UButton      │
│          │  └───────────────────┘  │    solid primary│
│          │                         │    full-width   │
│          │  Lupa kata sandi?       │  ← link kecil   │
│          └─────────────────────────┘                 │
│                                                      │
│              © 2026 Rental Mobil Anak                │
└──────────────────────────────────────────────────────┘
```

**Komponen:** `UCard`, `UInput`, `UButton`, `UCheckbox`, `UIcon`
**Background:** `bg-neutral-50`, subtle dot/grid pattern CSS
**Card:** `max-w-md mx-auto`, centered vertically

**States:**
- **[L] (Submit):** Button jadi `loading` spinner + "Memproses...", semua input disabled
- **[R] (Invalid):** Input border merah, pesan error di bawah input ("Email belum terdaftar", "Kata sandi salah")
- **[R] (Network):** Toast error "Gagal terhubung ke server. Periksa koneksi internet."
- **[R] (Rate Limited):** "Terlalu banyak percobaan. Coba lagi dalam 5 menit."
- **[S] (Success):** Redirect ke dashboard role; toast "Selamat datang, [Nama]!"

### 1.2 Forgot Password Flow

- Modal / page: input email → "Link reset telah dikirim ke email Anda" [S]
- **[R]:** "Email tidak ditemukan" (tetap samar — jangan konfirmasi email exist/tidak)

---

## 2. Dashboard Admin Pusat

### 2.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard                        Cabang: [Semua ▼]  📅 Hari Ini │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐│
│ │ 🚗 1,247 │ │ 💰  Rp   │ │ 🏪 218   │ │ ⚡ Quick Actions     ││
│ │ Aktif    │ │ 45.2M    │ │ Online    │ │ [Mulai Sewa]        ││
│ │ ↑ 12%    │ │ Pendptn  │ │ dari 250  │ │ [Tambah Unit]       ││
│ │          │ │ ↑ 8%     │ │           │ │ [Laporan Hari Ini]  ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘│
│                                                                  │
│ ┌──────────────────────────┐  ┌────────────────────────────────┐│
│ │  Peta Indonesia          │  │  Pendapatan 7 Hari             ││
│ │                          │  │  ┌───────────────────────────┐ ││
│ │  [Map rendering]         │  │  │  ▁▃▅▇▆▄▂                    │ ││
│ │  • Jakarta: 1,200 unit   │  │  │  Sen Sel Rab Kam Jum Sab Min│ ││
│ │  • Surabaya: 850 unit    │  │  └───────────────────────────┘ ││
│ │  • 250 cabang tersebar   │  │                                ││
│ │                          │  │  Total: Rp 315.4M              ││
│ │  +Zoom +/-  Legenda ▼    │  │  Rata2/hari: Rp 45.1M          ││
│ └──────────────────────────┘  └────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────┐  ┌────────────────────────────────┐│
│ │  Utilisasi Unit (%)      │  │  Transaksi Terbaru              ││
│ │  ┌─────────────────────┐ │  │  ┌────┬─────────┬───────┬────┐ ││
│ │  │  ▁▃▅▇▆▄▂▅▇▆▃▁...    │ │  │  │Jam │ Cabang  │ Unit  │Rp  │ ││
│ │  │  08 10 12 14 16 18  │ │  │  ├────┼─────────┼───────┼────┤ ││
│ │  └─────────────────────┘ │  │  │14:32│Mall A   │TK-1234│50K │ ││
│ │  Rata2: 72%  Peak: 89%  │  │  │14:28│Mall B   │TK-5678│30K │ ││
│ │                          │  │  │14:15│Mall C   │TK-9012│75K │ ││
│ │                          │  │  │  ... 5 baris auto-scroll   ││
│ │                          │  │  └────┴─────────┴───────┴────┘ ││
│ └──────────────────────────┘  │  Lihat Semua →                 ││
│                                └────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Komponen

| Area | Komponen |
|------|----------|
| Header bar | `USelect` (filter cabang), `UBadge` (tanggal) |
| Stat Cards | 4× `UCard` dengan ikon, nilai, trend (seperti `StatCard` pattern di design.md) |
| Quick Actions | `UButton` group variant outline, icon+label |
| Peta Indonesia | Custom `div` render Leaflet/MapLibre, marker cluster untuk 250 cabang |
| Grafik Pendapatan | Chart library (Chart.js / ApexCharts via `vue-chartjs`), line chart 7 hari |
| Grafik Utilisasi | Area chart per jam operasional (08:00–20:00) |
| Transaksi Terbaru | `UTable` 5 baris, auto-refresh setiap 30 detik, link "Lihat Semua" |

### 2.3 Interaksi

- **Filter Cabang:** Saat ganti `USelect`, semua data di-refetch per cabang
- **Peta:** Klik marker → popup detail cabang (nama, unit aktif, pendapatan hari ini)
- **Zoom Peta:** Double-click / scroll wheel; tombol +/- di pojok kanan bawah
- **Quick Actions:** Buka halaman/modul terkait di tab baru
- **Grafik:** Hover tooltip detail; klik legenda untuk toggle dataset visibility
- **Auto-refresh:** Data di-refresh setiap 30 detik; badge "Live" berdenyut

### 2.4 States

| State | Perilaku |
|-------|----------|
| **[L] (Initial)** | 4 skeleton stat cards + 2 skeleton charts + table skeleton (5 baris shimmer) |
| **[L] (Refetch)** | Angka stat memudar, skeleton ringan overlay; grafik tidak reload penuh — update smooth transition |
| **[E] (Tidak ada data)** | Stat values = "0" / "Rp 0"; peta tetap render; grafik kosong dengan ilustrasi "Belum ada data hari ini"; tabel: empty-state "Belum ada transaksi" |
| **[R] (Gagal fetch)** | Toast error "Gagal memuat dashboard"; setiap section ada tombol "Coba Lagi"; peta fallback ke gambar statis Indonesia |
| **[R] (Parsial)** | Section yang gagal tampil error boundary; section lain tetap render |

---

## 3. Dashboard Cabang

### 3.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard Cabang — Mall Grand Indonesia              📅 Hari Ini│
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐│
│ │ 🚗 85    │ │ 💰  Rp   │ │ ⏱ 4     │ │ 📊 Utilisasi          ││
│ │ Unit     │ │ 3.2M     │ │ Sewa     │ │ ████████░░ 72%        ││
│ │ Aktif/120│ │ Pendptn  │ │ Aktif    │ │                      ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘│
│                                                                  │
│ ┌─────────────────────────────┐ ┌──────────────────────────────┐│
│ │ Unit Per Status             │ │ Pendapatan Hari Ini (per jam)││
│ │ ┌──────┬───┬──────────┐     │ │  ▁▃▅▇▆▄▂▁                     ││
│ │ │ Tersedia  │ 35  🟢  │     │ │  08 10 12 14 16 18 20        ││
│ │ │ Disewa    │ 14  🔵  │     │ │  Peak: 14:00= Rp 580K        ││
│ │ │ Perbaikan │  2  🟡  │     │ │  Total: Rp 3.2M              ││
│ │ │ Rusak     │  0  🔴  │     │ └──────────────────────────────┘│
│ │ └──────────┴─────┴──────┘     │                                │
│ └─────────────────────────────┘ └────────────────────────────────┘
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ Unit Sedang Disewa                     ⏱ Auto-refresh 10s    ││
│ │ ┌──────┬──────────┬──────┬─────────┬───────┐                 ││
│ │ │Unit  │ Customer │ Mulai│Sisa Wkt │ Biaya │                 ││
│ │ ├──────┼──────────┼──────┼─────────┼───────┤                 ││
│ │ │TK-01 │ Budi     │13:45 │ ⏱ 05:23│ Rp 15K│  ← timer real   ││
│ │ │TK-08 │ Ani      │14:00 │ ⏱ 20:12│ Rp 30K│                 ││
│ │ │TK-15 │ Siti     │14:10 │ ⏱ 30:05│ Rp 45K│                 ││
│ │ │TK-22 │ Dodi     │14:25 │ ⏱ 45:51│ Rp 60K│                 ││
│ │ └──────┴──────────┴──────┴─────────┴───────┘                 ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌─────────────────────┐  ┌─────────────────────────────────────┐│
│ │ ⚡ Quick Actions     │  │ 🔔 Notifikasi Cabang                ││
│ │ [Mulai Sewa]        │  │ ⚠ TK-08 melebihi durasi sewa        ││
│ │ [Cek Unit Ready]    │  │ ⚠ Stok unit tersisa < 10            ││
│ │ [Laporan Shift]     │  │ ✓ Shift diteruskan ke operator malam ││
│ │ [Popup Store Aktif] │  │ ℹ️ Maintenance TK-05 selesai         ││
│ └─────────────────────┘  └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Komponen

| Area | Komponen |
|------|----------|
| Header | `UBreadcrumb` + judul cabang |
| Stat cards | `UCard` stat-card pattern, 4 cards |
| Status breakdown | `UCard` + list horizontal bar (status per warna) |
| Grafik per jam | Line/area chart |
| Unit sedang disewa | `UTable` dengan timer countdown real-time; highlight baris jika waktu < 5 menit (warning) atau < 0 menit (error/overtime) |
| Quick Actions | `UButton` group |
| Notifikasi | `UAlert` list (warning, success, info) |

### 3.3 States

| State | Perilaku |
|-------|----------|
| **[L]** | Skeleton bervariasi per section (sama seperti admin pusat) |
| **[E] (Tidak ada sewa aktif)** | Tabel: "Belum ada unit yang sedang disewa" + ilustrasi mobil parkir |
| **[E] (Unit habis)** | Status "Tersedia: 0" dengan warna error; quick action "Cek Unit Ready" disabled |
| **[R] (Overtime)** | Timer teks merah, baris tabel background error-50, notifikasi alert muncul |

---

## 4. Manajemen Unit

### 4.1 Layout (Tabel View)

```
┌─────────────────────────────────────────────────────────────────┐
│ Manajemen Unit                    [+ Tambah Unit]  [Export ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Cari unit / merek / kode...    │Status: [Semua ▼]       │ │
│ │                                   │Cabang: [Semua ▼]       │ │
│ │                                   │Tipe:   [Semua ▼]       │ │
│ │                                   │ [Terapkan] [Reset]     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌──────┬──────────┬────────┬──────────┬──────────┬───────┬─────┐│
│ │Kode  │ Merek    │ Cabang │ Status   │ Terakhir │ Sewa  │ ⋯  ││
│ │      │          │        │          │ Service  │ Total │     ││
│ ├──────┼──────────┼────────┼──────────┼──────────┼───────┼─────┤│
│ │TK001 │Jeep Anak │ MALL A │🟢Tersedia│2026-05-10│ 1,234 │ ⋮  ││
│ │TK002 │Ferrari   │ MALL A │🔵Disewa  │2026-05-08│   567 │ ⋮  ││
│ │TK003 │Lambo     │ MALL B │🟡Service │2026-06-01│    89 │ ⋮  ││
│ │TK004 │Bus Sekol │ MALL A │🟢Tersedia│2026-04-15│ 2,101 │ ⋮  ││
│ │TK005 │Pickup    │ MALL C │🔴Rusak   │2026-03-20│   312 │ ⋮  ││
│ │ ...  │ ...      │ ...    │ ...      │ ...      │  ...  │ ... ││
│ └──────┴──────────┴────────┴──────────┴──────────┴───────┴─────┘│
│                                                                  │
│ Menampilkan 1–50 dari 40,000 unit      [< 1 2 3 ... 800 >]      │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Detail Unit (UModal / USlideover)

```
┌───────────────────────────────────────┐
│ Detail Unit — TK001            [✕]    │
├───────────────────────────────────────┤
│ ┌─────────────────────────────────┐   │
│ │      [Foto Unit — 400×300]      │   │
│ └─────────────────────────────────┘   │
│                                        │
│ Kode Unit:     TK001                  │
│ Merek:         Jeep Anak              │
│ Tipe:          Off-road Electric      │
│ Warna:         Merah                   │
│ Tahun:         2025                    │
│ Status:        🟢 Tersedia            │
│ Cabang:        Mall Grand Indonesia   │
│ Lokasi Rak:    A-12                    │
│ Baterai:       85% (3.2V)             │
│                                        │
│ ────── Riwayat Sewa ──────             │
│ ┌──────┬──────────┬──────┬──────┐     │
│ │ Tgl  │ Customer │Durasi│Biaya │     │
│ ├──────┼──────────┼──────┼──────┤     │
│ │05/06 │ Budi     │30mnt │Rp 15K│     │
│ │05/06 │ Ani      │15mnt │Rp 8K │     │
│ │04/06 │ Cici     │45mnt │Rp 22K│     │
│ └──────┴──────────┴──────┴──────┘     │
│                                        │
│ ────── Riwayat Service ──────          │
│ ┌──────┬──────────┬───────────┐       │
│ │ Tgl  │ Jenis    │ Teknisi   │       │
│ ├──────┼──────────┼───────────┤       │
│ │01/06 │ Rutin    │ Teknisi A │       │
│ │15/05 │ Baterai  │ Teknisi B │       │
│ └──────┴──────────┴───────────┘       │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ [Edit Unit]  [Tandai Service]    │  │
│ │ [Nonaktifkan]                    │  │
│ └──────────────────────────────────┘  │
└───────────────────────────────────────┘
```

### 4.3 Mobile View (Card List)

```
┌───────────────────────────┐
│ Manajemen Unit            │
│ ┌─────────────────────────┐
│ │ 🔍 Cari...     [Filter] │
│ └─────────────────────────┘
│                            │
│ ┌─────────────────────────┐│
│ │ TK001 — Jeep Anak       ││
│ │ 🟢 Tersedia             ││
│ │ Mall Grand Indonesia    ││
│ │ Last Service: 10 Mei    ││
│ │ Total Sewa: 1,234×      ││
│ │                    [>]  ││
│ └─────────────────────────┘│
│                            │
│ ┌─────────────────────────┐│
│ │ TK002 — Ferrari         ││
│ │ 🔵 Disewa               ││
│ │ Mall Grand Indonesia    ││
│ │ Last Service: 08 Mei    ││
│ │ Total Sewa: 567×        ││
│ │                    [>]  ││
│ └─────────────────────────┘│
│                            │
│ ┌─────────────────────────┐│
│ │ TK003 — Lambo           ││
│ │ 🟡 Service              ││
│ │ Mall Tunjungan Plaza    ││
│ │ Last Service: 01 Jun    ││
│ │ Total Sewa: 89×         ││
│ │                    [>]  ││
│ └─────────────────────────┘│
│      ... infinite scroll    │
│ [ Memuat lebih banyak... ] │
└───────────────────────────┘
```

**Mobile specifics:**
- Tabel diganti card list
- Infinite scroll (Intersection Observer), bukan paginasi angka
- Pull-to-refresh
- Tap card → `USlideover` dari kanan (detail unit)
- Filter di `USlideover` kiri, dibuka via tombol filter
- `FAB` (Floating Action Button) [+] di kanan bawah untuk tambah unit

### 4.4 Komponen

| Area | Komponen |
|------|----------|
| Filter bar | `UInput` (search), 3× `USelect` (status, cabang, tipe) |
| Tabel | `UTable` dengan kolom sortable, selectable |
| Paginasi | `UPagination` dengan page size selector |
| Detail Unit | `USlideover` (desktop) / full-screen sheet (mobile) |
| Foto Unit | Gambar dengan rasio 4:3, rounded-lg |
| Riwayat Sewa | `UTable` di dalam slideover |
| Riwayat Service | `UTable` di dalam slideover |
| Action Buttons | `UButton` group di footer slideover |
| Mobile FAB | `UButton` circular, primary, `rounded-full`, fixed bottom-right |

### 4.5 States

| State | Perilaku |
|-------|----------|
| **[L] (Initial)** | Filter bar skeleton + 10 baris tabel skeleton (shimmer) |
| **[L] (Search)** | Debounce 300ms, hasil lama tetap tampil, skeleton overlay pada tabel |
| **[L] (Infinite Scroll)** | Spinner di bawah card list "Memuat lebih banyak..." |
| **[E] (Tidak ada hasil)** | "Tidak ada unit yang cocok dengan filter" + ilustrasi + tombol "Reset Filter" |
| **[E] (Cabang kosong)** | "Cabang ini belum memiliki unit terdaftar" + tombol "Tambah Unit" |
| **[R] (Gagal fetch)** | "Gagal memuat data unit" + "Coba Lagi" + "Gunakan Data Offline?" (jika ada cache) |
| **[R] (Gagal simpan)** | Toast error spesifik + form tetap terbuka (tidak kehilangan input) |
| **[S] (Berhasil tambah/edit)** | Toast "Unit TK-XXX berhasil disimpan" + kembali ke daftar |

---

## 5. Halaman Sewa

### 5.1 Layout (Form Booking)

```
┌─────────────────────────────────────────────────────────────────┐
│ Sewa Baru                                           ⏱ Batas: 15:00│
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────┐  ┌───────────────────────────────────┐│
│ │ 1. Pilih Unit         │  │ Ringkasan Sewa                    ││
│ │                       │  │                                   ││
│ │ Cabang: [MALL A ▼]   │  │ Cabang: Mall Grand Indonesia     ││
│ │                       │  │ Unit: TK001 — Jeep Anak          ││
│ │ ┌───────────────────┐ │  │                                   ││
│ │ │ TK001 Jeep  🟢    │ │  │ ─── Detail Harga ───             ││
│ │ │ TK002 Ferrari 🔵  │ │  │ Tarif per 15 menit:  Rp 5,000   ││
│ │ │ TK003 Lambo  🟢   │ │  │ Durasi:             30 menit     ││
│ │ │ TK004 Bus    🟢   │ │  │ Subtotal:           Rp 10,000   ││
│ │ │ ... scroll        │ │  │ Diskon:            -Rp     0    ││
│ │ └───────────────────┘ │  │ ─────────────────────────        ││
│ │                       │  │ TOTAL:              Rp 10,000   ││
│ │                       │  │                                   ││
│ └───────────────────────┘  │ ┌───────────────────────────────┐ ││
│                            │ │ [ B A T A L ]  [L A N J U T]  │ ││
│ ┌───────────────────────┐  │ └───────────────────────────────┘ ││
│ │ 2. Data Customer      │  └───────────────────────────────────┘│
│ │                       │                                        │
│ │ Nama Orang Tua:       │                                        │
│ │ ┌───────────────────┐ │                                        │
│ │ │ Budi Setiawan...  │ │                                        │
│ │ └───────────────────┘ │                                        │
│ │                       │                                        │
│ │ Nomor HP:             │                                        │
│ │ ┌───────────────────┐ │                                        │
│ │ │ 0812-3456-7890   │ │                                        │
│ │ └───────────────────┘ │                                        │
│ │                       │                                        │
│ │ Nama Anak:            │                                        │
│ │ ┌───────────────────┐ │                                        │
│ │ │ Andi...           │ │                                        │
│ │ └───────────────────┘ │                                        │
│ │                       │                                        │
│ │ ┌───────────────────┐ │                                        │
│ │ │ 3. Durasi & Bayar │ │                                        │
│ │ │                   │ │                                        │
│ │ │ Durasi: [30mnt▾]  │ │                                        │
│ │ │ [15] [30] [45]    │ │                                        │
│ │ │ [60] menit        │ │                                        │
│ │ │                   │ │                                        │
│ │ │ Metode Bayar:     │ │                                        │
│ │ │ ○ Tunai   ● QRIS  │ │                                        │
│ │ │ ○ Transfer        │ │                                        │
│ │ └───────────────────┘ │                                        │
│ └───────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Timer Flow (15 Menit Booking Window)

```
┌───────────────────────────────────────────────────────┐
│  ⏱ Konfirmasi Sewa — Sisa Waktu: 12:34               │
│                                                       │
│  Unit TK001 — Jeep Anak siap digunakan.               │
│  Harap selesaikan pembayaran sebelum timer habis.     │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Status: Menunggu Pembayaran                    │  │
│  │                                                 │  │
│  │  Total: Rp 10,000                               │  │
│  │                                                 │  │
│  │  QR Code                                        │  │
│  │  ┌───────────┐                                  │  │
│  │  │ █▀▀▀▀▀▀█ │                                  │  │
│  │  │ █ ██ ██ █ │   ← QRIS barcode                │  │
│  │  │ █ ▀▀ ▀▀ █ │                                  │  │
│  │  │ ▀▀▀▀▀▀▀▀▀ │                                  │  │
│  │  └───────────┘                                  │  │
│  │                                                 │  │
│  │  [Bayar Tunai]   [Batal]                       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  ⚠ Jika timer habis, booking akan otomatis dibatalkan │
└───────────────────────────────────────────────────────┘
```

### 5.3 Post-Payment Flow

```
┌───────────────────────────────────────────────────────┐
│  ✅ Sewa Berhasil!                                    │
│                                                       │
│  Unit: TK001 — Jeep Anak                             │
│  Waktu Mulai: 14:30                                  │
│  Estimasi Selesai: 15:00                             │
│  Durasi: 30 menit                                    │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 🖨 Cetak Struk        [Tutup]                   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  ⏱ Timer sewa berjalan: 29:54 tersisa                │
│  ⚠ Notifikasi akan muncul 5 menit sebelum selesai    │
└───────────────────────────────────────────────────────┘
```

### 5.4 Komponen

| Area | Komponen |
|------|----------|
| Pilih Unit | List/`URadioGroup` card variant unit yang tersedia di cabang terpilih |
| Detail Harga | `UCard` summary panel dengan kalkulasi real-time |
| Data Customer | `UInput` nama, HP, nama anak |
| Durasi | `URadioGroup` preset; bisa custom via `UInput` number |
| Metode Bayar | `URadioGroup` |
| Timer | Custom `UTimer` component: `UCard` + countdown display + progress bar |
| QRIS | QR code image (generate dari API pembayaran) |
| Konfirmasi | Modal sukses dengan `UButton` print struk |

### 5.5 States

| State | Perilaku |
|-------|----------|
| **[L] (Memilih cabang)** | List unit loading skeleton (4–6 card skeleton) |
| **[L] (Submit booking)** | Button loading "Memproses..."; modal timer tidak tampil dulu |
| **[E] (Unit habis)** | "Tidak ada unit tersedia di cabang ini" — pilih cabang lain atau hubungi admin |
| **[E] (Customer tidak valid)** | Validasi form: error per field, scroll ke field pertama yang error |
| **[R] (Gagal booking)** | "Unit sudah dibooking orang lain" — refresh daftar unit, pilih ulang |
| **[R] (Payment timeout)** | Timer habis → unit dilepas otomatis; "Waktu booking habis. Silakan ulangi." + redirect ke form booking |
| **[S] (Payment confirmed)** | Auto-redirect ke halaman konfirmasi; cetak struk; timer tracking aktif |

---

## 6. Tracking Real-time

### 6.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Tracking Real-time               Cabang: [Mall Grand Indonesia▾]│
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────┐ ┌────────────────────────┐│
│ │ ┌───────────────────────────────┐ │ │ Status Unit            ││
│ │ │                               │ │ │                        ││
│ │ │  Peta Interaktif              │ │ │ 🟢 Tersedia: 35       ││
│ │ │  (Leaflet/MapLibre)           │ │ │ 🔵 Disewa: 14         ││
│ │ │                               │ │ │ 🟡 Service: 2         ││
│ │ │  📍📍📍                       │ │ │ 🔴 Rusak: 0           ││
│ │ │    📍 Marker unit             │ │ │                        ││
│ │ │  ──── Geofence boundary      │ │ │ ──────────────────     ││
│ │ │                               │ │ │ ⚡ Unit Bergerak: 12   ││
│ │ │                               │ │ │ ⏸ Unit Diam: 23       ││
│ │ │                               │ │ │ ⚠ Di Luar Geofence: 0 ││
│ │ └───────────────────────────────┘ │ │                        ││
│ │ [+][-]  ○ Track Semua           │ │ └────────────────────────┘│
│ └───────────────────────────────────┘ │                          │
│                                       │ ┌────────────────────────┐│
│ ┌───────────────────────────────────┐ │ │ 🔔 Alert Log           ││
│ │ Aktivitas Terbaru                 │ │ │                        ││
│ │ ┌──────┬──────┬──────┬──────────┐ │ │ │14:32 TK-08 memasuki   ││
│ │ │ Waktu│ Unit │ Event│ Lokasi   │ │ │ │ zona A (Mall Lt.1)    ││
│ │ ├──────┼──────┼──────┼──────────┤ │ │ │14:28 TK-15 berpindah  ││
│ │ │14:32 │TK-08 │Masuk │Mall Lt.1 │ │ │ │ dari zona B ke A       ││
│ │ │14:28 │TK-15 │Pindah│Zona A→B  │ │ │ │14:25 TK-01 mendekati  ││
│ │ │14:25 │TK-01 │Dekat │Batas Zona│ │ │ │ batas geofence         ││
│ │ │14:20 │TK-12 │Masuk │Mall Lt.2 │ │ │ │14:20 TK-12 memasuki   ││
│ │ │14:15 │TK-03 │Seles.│Zona Park │ ││ │ │ zona C (Mall Lt.2)    ││
│ │ └──────┴──────┴──────┴──────────┘ ││ │                        ││
│ └───────────────────────────────────┘ │ └────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Komponen

| Area | Komponen |
|------|----------|
| Peta | Custom Map component (Leaflet/MapLibre GL) dengan raster/satellite tiles |
| Marker Unit | Custom map marker: icon mobil sesuai warna unit; tooltip: kode unit + status |
| Geofence | Polygon overlay di peta: hijau (zona aman), kuning (zona peringatan), merah (zona terlarang) |
| Status Panel | `UCard` dengan stat ringkas |
| Aktivitas Terbaru | `UTable` 5 baris, update real-time via WebSocket/SSE |
| Alert Log | `UAlert` list, warna sesuai severity |
| Zoom Control | Custom overlay di peta atau pakai Leaflet control |
| Filter Cabang | `USelect` di header |

### 6.3 Interaksi

- **Klik marker** → tooltip/popup detail unit (kode, status, durasi sewa, customer)
- **Klik geofence** → info zona (nama, kapasitas, aturan)
- **Double-click peta** → zoom in
- **Tombol "Track Semua"** → auto-fit bounds ke semua marker
- **Filter cabang** → pindah view ke cabang terpilih
- **Real-time update** → marker bergerak halus (interpolasi posisi), WebSocket connection
- **Alert real-time** → push notifikasi + toast + animasi pulse pada marker yang melanggar

### 6.4 States

| State | Perilaku |
|-------|----------|
| **[L] (Initial)** | Peta skeleton persegi abu-abu + loading spinner; panel status skeleton |
| **[L] (Reconnecting WS)** | Badge "Menghubungkan..." kuning di atas peta |
| **[E] (Tidak ada unit)** | Peta default center ke cabang dengan ilustrasi "Tidak ada unit terdaftar di cabang ini" |
| **[E] (Semua unit diam)** | Peta tetap tampil; teks "Tidak ada pergerakan terdeteksi" di aktivitas terbaru |
| **[E] (Tidak ada alert)** | Alert log: "Tidak ada alert" — daftar kosong, abu-abu |
| **[R] (GPS tidak tersedia)** | Marker terakhir + badge "GPS tidak terdeteksi" + waktu terakhir terlihat |
| **[R] (WebSocket disconnect)** | Badge merah "Terputus — mencoba menghubungkan..." + tombol "Hubungkan Ulang"; marker freeze di posisi terakhir |
| **[R] (Geofence Violation)** | Marker berdenyut merah + toast "⚠ TK-08 keluar dari zona aman!" + alert log merah |

---

## 7. Manajemen Pop-up Store

### 7.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Pop-up Store                        [+ Buat Pop-up Store Baru]  │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐  ┌────────────────────────────────────┐│
│ │ Kalender Event       │  │ Detail Pop-up: "Car Free Day"      ││
│ │                      │  │                                    ││
│ │  Juni 2026           │  │ ┌────────────────────────────────┐ ││
│ │  Se Ra Ka Ju Sa Mi  │  │ │ Status: ⏳ Persiapan           │ ││
│ │               1  2   │  │ │                                    │
│ │   3  4 [5] 6  7  8   │  │ │ Lokasi: Jl. Sudirman, Jakarta   ││
│ │   9 10 11 12 13 14   │  │ │ Tanggal: 8 Juni 2026            ││
│ │  15 16 17 18 19 20   │  │ │ Jam: 06:00–12:00               ││
│ │  21 22 23 24 25 26   │  │ │ Unit: 15 unit (disiapkan)       ││
│ │  27 28 29 30         │  │ │                                    │
│ │                      │  │ │ ─── Workflow ───                 ││
│ │  5 Juni — 3 events   │  │ │ ☑ 1. Survei lokasi              ││
│ │  12 Juni — 1 event   │  │ │ ☑ 2. Izin lokasi                ││
│ │  20 Juni — 2 events  │  │ │ ☐ 3. Siapkan unit (target: 7 Jun)│
│ │                      │  │ │ ☐ 4. Transportasi unit           ││
│ │  Event types:        │  │ │ ☐ 5. Setup di lokasi             ││
│ │  🟠 Car Free Day     │  │ │ ☐ 6. Briefing operator           ││
│ │  🔵 Festival         │  │ │ ☐ 7. Buka operasional           ││
│ │  🟢 Pasar Malam      │  │ │ ☐ 8. Teardown                   ││
│ │  🟣 Bazar Sekolah    │  │ │ ☐ 9. Kembalikan unit            ││
│ └──────────────────────┘  │ └────────────────────────────────┘ ││
│                            │                                    ││
│                            │ ┌────────────────────────────────┐ ││
│                            │ │ Unit Dialokasikan:             │ ││
│                            │ │ TK001 ✓ TK002 ✓ TK003 ☐       │ ││
│                            │ │ TK004 ✓ TK005 ✓ ...            │ ││
│                            │ │                                │ ││
│                            │ │ Operator:                      │ ││
│                            │ │ 👤 Andi (PIC)                  │ ││
│                            │ │ 👤 Budi, 👤 Cici               │ ││
│                            │ │                                │ ││
│                            │ │ [Edit] [Mulai Setup] [Batal]  │ ││
│                            │ └────────────────────────────────┘ ││
│ └──────────────────────┘  └────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Setup/Teardown Workflow (Step-by-Step)

```
┌───────────────────────────────────────────────────────┐
│ Setup: "Car Free Day"                                 │
│ ─────────────────────────────────────────────────────  │
│                                                       │
│  ☑ 1. Survei Lokasi          ✓ Selesai (3 Jun)       │
│  ☑ 2. Perizinan              ✓ Selesai (4 Jun)       │
│  ● 3. Siapkan Unit           ⟳ Sedang Diproses       │
│     ┌─────────────────────┐                           │
│     │ Unit siap: 12/15    │                           │
│     │ ████████████░░░░ 80% │  ← UProgress            │
│     │ Masih perlu: TK003, │                           │
│     │ TK007, TK015        │                           │
│     └─────────────────────┘                           │
│  ○ 4. Transportasi           Belum Mulai              │
│  ○ 5. Setup di Lokasi        Belum Mulai              │
│  ○ 6. Briefing Operator      Belum Mulai              │
│  ○ 7. Buka Operasional       Belum Mulai              │
│                                                       │
│  [Tandai Selesai]  [Catatan]  [Skip Step]             │
└───────────────────────────────────────────────────────┘
```

### 7.3 Komponen

| Area | Komponen |
|------|----------|
| Kalender | Custom kalender view dengan indikator event per tanggal (dot berwarna sesuai tipe) |
| Detail Event | `UCard` dengan `UBadge` status, info, workflow checklist |
| Workflow Steps | `UCheckbox` list dengan status (checked/unchecked) + `UProgress` per step |
| Alokasi Unit | Checklist grid unit; `UButton` "Alokasikan Unit" membuka `UModal` pilih unit |
| Operator | `UAvatar` group; `UButton` "Tambah Operator" |
| Tombol Aksi | `UButton` group kontekstual sesuai status (Mulai Setup, Buka, Tutup, Teardown, Batal) |

### 7.4 States

| State | Perilaku |
|-------|----------|
| **[L]** | Kalender loading, detail skeleton |
| **[E] (Tidak ada event)** | Kalender kosong + ilustrasi "Belum ada pop-up store terjadwal" + CTA "Buat Pop-up Store Pertama" |
| **[R] (Gagal setup step)** | Toast error + step tidak berubah status |
| **[S] (Setup selesai)** | Status berubah "✅ Aktif"; timer operasional berjalan; toast "Pop-up store Car Free Day siap beroperasi!" |
| **[S] (Teardown selesai)** | Status "📦 Selesai"; event ditandai selesai di kalender; ringkasan pendapatan ditampilkan |

---

## 8. Laporan & Analytics

### 8.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Laporan & Analytics                          [Export ▾] [Print]  │
├─────────────────────────────────────────────────────────────────┤
│ Periode: [1 Jun 2026] — [7 Jun 2026]  Cabang: [Semua ▼]        │
│ Tipe Unit: [Semua ▼]                   [Terapkan]               │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────┐ ┌───────────────┐ │
│ │ Total Pendapatan     │ │ Total Sewa       │ │ Rata2 Durasi  │ │
│ │ Rp 315,450,000       │ │ 2,341 sewa       │ │ 28 menit      │ │
│ │ ↑ 12% vs minggu lalu │ │ ↑ 8%             │ │ ↑ 2 menit     │ │
│ └──────────────────────┘ └──────────────────┘ └───────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────┐ ┌──────────────────────────┐│
│ │ Pendapatan Per Cabang (Top 10)   │ │ Pendapatan Per Jam       ││
│ │ ┌──────────────────────────┐     │ │ ┌──────────────────────┐ ││
│ │ │ Mall A ██████████████ 85M│     │ │ │   ▁▃▅▇▆▄▂▁           │ ││
│ │ │ Mall B ████████████   72M│     │ │ │ 08 10 12 14 16 18 20 │ ││
│ │ │ Mall C ██████████     65M│     │ │ │ Peak: 14:00           │ ││
│ │ │ Mall D ████████       48M│     │ │ └──────────────────────┘ ││
│ │ │ Mall E ███████        42M│     │ │                          ││
│ │ └──────────────────────────┘     │ └──────────────────────────┘│
│ └──────────────────────────────────┘                             │
│                                                                  │
│ ┌──────────────────────────────────┐ ┌──────────────────────────┐│
│ │ Utilisasi Unit Per Hari         │ │ Status Unit (Pie)         ││
│ │ ┌──────────────────────────┐    │ │ ┌──────────────────────┐  ││
│ │ │ ▁▃▅▇▆▄▂▅▇▆▃▁...          │    │ │ │  ◉ Tersedia 65%     │  ││
│ │ │ Sen Sel Rab Kam Jum Sab Min│  │ │ │  ◉ Disewa   25%     │  ││
│ │ │ Rata2: 72%                │    │ │ │  ◉ Service   7%     │  ││
│ │ └──────────────────────────┘    │ │ │  ◉ Rusak     3%     │  ││
│ └──────────────────────────────────┘ │ └──────────────────────┘  ││
│                                       └──────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ Tabel Detail Transaksi                        [Export CSV]   ││
│ │ ┌──────┬──────┬──────┬────────┬──────┬──────┬──────┬────────┐││
│ │ │Tgl   │Cabang│Unit  │Customer│Durasi│Biaya │Metode│Kasir   │││
│ │ ├──────┼──────┼──────┼────────┼──────┼──────┼──────┼────────┤││
│ │ │07/06 │Mall A│TK001 │Budi    │30mnt │15,000│QRIS  │Operator│││
│ │ │07/06 │Mall A│TK008 │Ani     │15mnt │ 7,500│Tunai │Operator│││
│ │ │07/06 │Mall B│TK015 │Siti    │45mnt │22,500│QRIS  │Kasir1  │││
│ │ │ ...  │ ...  │ ...  │ ...    │ ...  │  ... │ ...  │ ...    │││
│ │ └──────┴──────┴──────┴────────┴──────┴──────┴──────┴────────┘││
│ │ Menampilkan 1–50 dari 2,341 transaksi   [< 1 2 ... 47 >]     ││
│ └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Komponen

| Area | Komponen |
|------|----------|
| Filter Periode | Date range picker (custom atau `UInput` type `date` ×2) |
| Filter Cabang/Tipe | `USelect` |
| Stat Cards | 4× `UCard` stat-card pattern |
| Grafik | Chart.js horizontal bar (cabang), line (per jam), bar (per hari), doughnut (status) |
| Tabel Detail | `UTable` sortable + `UPagination` |
| Export | `UDropdown` opsi: Export PDF, Export CSV, Export Excel |

### 8.3 States

| State | Perilaku |
|-------|----------|
| **[L]** | Skeleton semua chart + tabel skeleton |
| **[L] (Export)** | Button loading + "Menyiapkan file..."; download dimulai otomatis setelah selesai |
| **[E] (Tidak ada data)** | Semua stat = 0; grafik: "Tidak ada data untuk periode ini" + ilustrasi; tabel: empty-state "Tidak ada transaksi" |
| **[E] (Tanggal tidak valid)** | Toast "Periode maksimal 90 hari" |
| **[R] (Gagal fetch)** | Error boundary per chart; tabel: "Gagal memuat data" + tombol "Coba Lagi" |
| **[R] (Export timeout)** | Toast "Export gagal — data terlalu besar. Coba rentang tanggal lebih kecil." |

---

## 9. Mobile View — Operator Lapangan

### 9.1 General Rules

- **Target device:** ≥400px width, 60Hz, touch-first
- **Orientasi:** portrait default, landscape untuk peta tracking
- **Gesture:** swipe back (iOS/Android native), pull-to-refresh, tap-and-hold untuk context menu
- **Keyboard:** input type sesuai (tel untuk nomor, number untuk durasi, email untuk login)
- **Offline-first:** cache data terakhir; indikator online/offline di header

### 9.2 Mobile-Specific Component Adaptations

| Desktop Component | Mobile Adaptation |
|-------------------|-------------------|
| Sidebar | Bottom navigation bar (5 icon+label utama) |
| UTable | Card list dengan infinite scroll |
| UModal | Full-screen bottom sheet (`USlideover` arah bawah) |
| Date range picker | Native date input (dua field terpisah) |
| Peta (full width) | Peta portrait setengah layar; landscape full screen |
| Multi-column form | Single column, vertical stack |
| Dropdown menu | Bottom sheet action list |
| Hover tooltip | Tap-and-hold untuk tooltip |
| Quick actions bar | Horizontal scrollable chip list |

### 9.3 Operator Daily Flow (Mobile)

```
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ 08:00 — Mulai Shift   │   │ 10:00 — Sewa Aktif     │   │ 20:00 — Tutup Shift    │
│                       │   │                       │   │                       │
│ ✅ Cek unit siap      │   │ 📋 Form booking       │   │ 📊 Rekap shift:       │
│ 📊 Dashboard cabang   │   │ ⏱ Timer berjalan      │   │   25 sewa             │
│ 🔔 Notifikasi         │   │ 🗺 Tracking unit      │   │   Rp 375,000          │
│                       │   │ 🔔 Alert geofence     │   │ 🖨 Print rekap         │
│ ┌─────────────────┐   │   │                       │   │ ✅ Serah terima shift  │
│ │ [Mulai Sewa]    │   │   │ [Timer: 05:23]        │   │ 🔒 Logout             │
│ └─────────────────┘   │   │                       │   │                       │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

### 9.4 Bottom Navigation Bar Detail

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│   🏠     │   🚗     │   📋     │   🗺      │   ⋯      │
│ Beranda  │  Unit    │  Sewa    │ Tracking │ Lainnya  │
│          │          │  (CTA)   │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

- **Beranda:** Dashboard cabang
- **Unit:** Manajemen unit, card list
- **Sewa:** Halaman booking baru (CTA — ikon warna primary, bouncing badge jumlah sewa aktif)
- **Tracking:** Peta real-time
- **Lainnya:** `USlideover` dari kanan berisi: Laporan, Pop-up Store, Pengaturan, Profil, Logout

### 9.5 Mobile States

| State | Perilaku |
|-------|----------|
| **[L] (App Start)** | Splash screen logo 1–2 detik, lalu dashboard skeleton |
| **[Offline]** | Badge kuning "Offline" di header; data dari cache; submit di-queue (disimpan lokal, dikirim saat online) |
| **[Low Battery]** | Bukan UI state, tapi pertimbangan: dark mode default mungkin lebih hemat baterai OLED |
| **[R] (Jaringan lambat)** | Semua loading state ditambah teks "Koneksi lambat..." di header |
| **[R] (Crash)** | Error boundary: "Terjadi kesalahan. [Muat Ulang]" – tidak keluar ke login |

---

## 10. Empty States (Global)

Setiap empty state terdiri dari:

1. **Ilustrasi** (CSS/SVG sederhana, sesuai konteks)
2. **Judul** (contoh: "Belum ada unit terdaftar")
3. **Deskripsi singkat** (1 kalimat penjelasan)
4. **CTA** (tombol aksi utama yang relevan)

| Halaman | Judul Empty | CTA |
|---------|-------------|-----|
| Dashboard | "Selamat datang! Mulai operasional hari ini." | "Mulai Sewa Pertama" |
| Manajemen Unit | "Belum ada unit terdaftar di cabang ini." | "Tambah Unit" |
| Sewa | "Semua unit sedang tersedia." | "Mulai Sewa" |
| Tracking | "Tidak ada unit yang sedang disewa." | "Lihat Daftar Unit" |
| Pop-up Store | "Belum ada pop-up store terjadwal." | "Buat Pop-up Store" |
| Laporan | "Pilih periode untuk melihat laporan." | "Pilih Tanggal" |
| Notifikasi | "Tidak ada notifikasi baru." | — (cukup teks) |
| Search (global) | "Tidak ditemukan." | "Coba kata kunci lain / Reset Filter" |

---

## 11. Error States (Global)

| Jenis Error | Tampilan | Aksi |
|-------------|----------|------|
| 401 Unauthorized | Modal "Sesi berakhir. Silakan login kembali." | Redirect ke login |
| 403 Forbidden | Halaman "Anda tidak memiliki akses ke halaman ini." | Kembali ke dashboard role |
| 404 Not Found | Halaman 404 standar | Kembali ke dashboard |
| 500 Server Error | "Terjadi kesalahan server. Tim teknis sedang menanganinya." | "Coba Lagi" |
| Network Error | "Tidak dapat terhubung ke server. Periksa koneksi internet Anda." | "Coba Lagi" / "Gunakan Offline" |
| Timeout (30s) | "Permintaan memakan waktu terlalu lama." | "Coba Lagi" / "Batalkan" |
| Validation Error | Inline error per field | Perbaiki input, submit ulang |
| Rate Limit | Toast "Terlalu banyak permintaan. Coba lagi dalam [X] detik." | Auto-dismiss |

---

## 12. Loading State Patterns (Global)

| Pola | Deskripsi | Durasi Ekspektasi |
|------|-----------|-------------------|
| **Skeleton Card** | Placeholder card dengan animasi shimmer | Initial page load (< 2s) |
| **Skeleton Table** | Baris placeholder dengan shimmer | Initial data fetch (< 3s) |
| **Button Loading** | Spinner + disabled + teks "Memproses..." | Submit action (< 5s) |
| **Inline Spinner** | Spinner kecil di dalam komponen | Search/filter refetch (< 1s) |
| **Overlay Loading** | Overlay transparan dengan spinner di tengah | Aksi kritis (booking) |
| **Progress Bar** | `UProgress` determinate | Upload file, export laporan |
| **Skeleton Chart** | Rectangular placeholder shimmer | Chart data fetch (< 2s) |
| **Skeleton Map** | Grey rectangle + loading text | Map tiles load (< 3s) |

---

## 13. Navigation Map

```
Login ────────────────────────────────────────────────────┐
  │                                                       │
  ├── Role: Super Admin ─── Dashboard Admin Pusat ────────┤
  │                           │                           │
  │                           ├── Manajemen Unit           │
  │                           ├── Tracking (semua cabang)  │
  │                           ├── Pop-up Store             │
  │                           ├── Laporan & Analytics      │
  │                           ├── Manajemen Cabang         │
  │                           └── Manajemen Pengguna       │
  │                                                       │
  ├── Role: Admin Cabang ─── Dashboard Cabang ────────────┤
  │                           │                           │
  │                           ├── Manajemen Unit (cabang)  │
  │                           ├── Halaman Sewa             │
  │                           ├── Tracking (cabang)        │
  │                           ├── Pop-up Store             │
  │                           └── Laporan (cabang)         │
  │                                                       │
  └── Role: Operator ─────── Dashboard Sederhana ─────────┤
                               │                           │
                               ├── Halaman Sewa (utama)    │
                               ├── Tracking (cabang)       │
                               └── Unit (view only)        │
```
