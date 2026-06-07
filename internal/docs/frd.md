# Functional Requirements Document (FRD)
## Sistem Tracking & Manajemen Rental Mobil Anak

---

**Dokumen:** FRD-001  
**Versi:** 1.0  
**Tanggal:** 7 Juni 2026  
**Penulis:** Product & Engineering Team  
**Status:** Draft Final  
**Referensi PRD:** PRD-001

---

## Daftar Isi

1. [Modul Autentikasi & RBAC](#1-modul-autentikasi--rbac)
2. [Modul Manajemen Unit](#2-modul-manajemen-unit)
3. [Modul Manajemen Cabang](#3-modul-manajemen-cabang)
4. [Modul Sewa & Pembayaran](#4-modul-sewa--pembayaran)
5. [Modul Tracking (GPS/RFID)](#5-modul-tracking-gpsrfid)
6. [Modul Pop-Up Store](#6-modul-pop-up-store)
7. [Modul Laporan & Analytics](#7-modul-laporan--analytics)
8. [Modul Notifikasi](#8-modul-notifikasi)
9. [Data Flow Diagrams](#9-data-flow-diagrams)
10. [API Specifications](#10-api-specifications)
11. [State Management (Pinia Stores)](#11-state-management-pinia-stores)
12. [Error Handling](#12-error-handling)
13. [Integration Points](#13-integration-points)

---

## 1. Modul Autentikasi & RBAC

### 1.1 Role-Based Access Control (RBAC)

Sistem menggunakan empat level role dengan hak akses bertingkat:

| Role | Deskripsi | Hak Akses Utama |
|------|-----------|-----------------|
| **super_admin** | Administrator pusat di kantor pusat | Akses penuh: semua cabang, semua unit, semua laporan, manajemen user, konfigurasi sistem |
| **branch_admin** | Manajer yang bertanggung jawab atas 1 cabang | CRUD unit di cabangnya, transaksi cabangnya, laporan cabangnya, manajemen operator di cabangnya |
| **operator** | Staf lapangan (cabang tetap & pop-up) | Membuka/menutup sewa, memproses pembayaran, melihat unit di cabangnya, check-in pop-up store |
| **customer** | Orang tua penyewa | Melihat riwayat sewa pribadi, profil, notifikasi; tidak bisa mengubah data sistem |

### 1.2 Functional Specifications

| ID | Fungsi | Deskripsi | Role |
|----|--------|-----------|------|
| AUTH-01 | Register User | Super admin membuat akun untuk branch_admin dan operator; customer self-register via form | super_admin, public |
| AUTH-02 | Login | Login dengan email + password; return JWT access token (15 menit) + refresh token (7 hari) | Semua |
| AUTH-03 | Logout | Invalidasi refresh token; hapus session di client | Semua |
| AUTH-04 | Forgot Password | Kirim link reset password ke email terdaftar; link valid 30 menit | Semua |
| AUTH-05 | Change Password | User bisa ganti password sendiri (wajib masukkan password lama) | Semua |
| AUTH-06 | Refresh Token | Silent refresh access token menggunakan refresh token yang masih valid | Semua (auto) |
| AUTH-07 | View Profile | Melihat data profil sendiri (nama, email, role, cabang terafiliasi) | Semua |
| AUTH-08 | Edit Profile | Update nama, foto profil, nomor telepon | Semua |
| AUTH-09 | Manage Users | Super admin CRUD user; branch_admin CRUD operator di cabangnya | super_admin, branch_admin |
| AUTH-10 | Assign Branch | Super admin menetapkan branch_admin dan operator ke cabang tertentu | super_admin |
| AUTH-11 | Session Timeout | Auto-logout setelah 30 menit inaktivitas; tampilkan countdown 60 detik sebelum logout | Semua |

### 1.3 Middleware & Guard Logic

```
[Client Request] → Nuxt Middleware Auth → Validate JWT → Check Role Permission → [Controller]
                                                    ↓ (invalid)
                                               Redirect /login
```

- Setiap route memiliki meta `{ requiresAuth: true, roles: ['super_admin', 'branch_admin'] }`
- Middleware memeriksa token validity; jika expired, trigger silent refresh
- Setelah validasi token, middleware membandingkan role user dengan `roles` di route meta
- Jika role tidak diizinkan: redirect ke `/unauthorized` dengan pesan "Anda tidak memiliki akses ke halaman ini"
- API endpoint melakukan double-check role di backend (tidak hanya mengandalkan frontend guard)

### 1.4 Data Model

```
users
├── id: UUID (PK)
├── email: VARCHAR(255) UNIQUE NOT NULL
├── password_hash: VARCHAR(255) NOT NULL
├── name: VARCHAR(255) NOT NULL
├── role: ENUM('super_admin','branch_admin','operator','customer') NOT NULL
├── branch_id: UUID (FK → branches) NULLABLE
├── phone: VARCHAR(20)
├── avatar_url: VARCHAR(500)
├── is_active: BOOLEAN DEFAULT TRUE
├── last_login_at: TIMESTAMP
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

refresh_tokens
├── id: UUID (PK)
├── user_id: UUID (FK → users)
├── token: VARCHAR(500) UNIQUE NOT NULL
├── expires_at: TIMESTAMP NOT NULL
├── revoked: BOOLEAN DEFAULT FALSE
└── created_at: TIMESTAMP
```

---

## 2. Modul Manajemen Unit

### 2.1 Functional Specifications

| ID | Fungsi | Deskripsi | Role |
|----|--------|-----------|------|
| UNIT-01 | List Units | Menampilkan daftar unit dengan filter: cabang, status, tipe, keyword; pagination 50 item/halaman | super_admin, branch_admin |
| UNIT-02 | View Unit Detail | Halaman detail unit: info dasar, status terkini, lokasi di peta, riwayat sewa, riwayat maintenance, riwayat perpindahan | super_admin, branch_admin |
| UNIT-03 | Create Unit | Form registrasi unit baru: serial number, tipe, warna, tahun, ID GPS, ID RFID, foto | super_admin |
| UNIT-04 | Update Unit | Edit informasi unit, ganti status, reassign ke cabang lain | super_admin, branch_admin (cabang sendiri) |
| UNIT-05 | Delete Unit | Soft delete (arsip) — unit tetap di database tapi tidak muncul di operasional | super_admin |
| UNIT-06 | Bulk Import | Upload CSV dengan kolom: serial_number, type, color, year, gps_id, rfid_id, branch_code; validasi + error report | super_admin |
| UNIT-07 | Generate QR Code | Otomatis generate QR code per unit (berisi URL: /u/{serial_number}) untuk ditempel di fisik mobil | super_admin, otomatis |
| UNIT-08 | Assign to Branch | Memindahkan unit antar cabang; tercatat di log perpindahan | super_admin, branch_admin |
| UNIT-09 | Update Unit Status | Ubah status unit: available, rented, maintenance, broken, retired | super_admin, branch_admin |
| UNIT-10 | Scan QR/RFID | Operator scan untuk identifikasi unit cepat sebelum transaksi | operator |

### 2.2 Status Unit (State Machine)

```
                  ┌─────────────┐
                  │  AVAILABLE  │ ←──────────────────────┐
                  └──────┬──────┘                        │
                         │ start rental                  │
                         ▼                               │
                  ┌─────────────┐                        │
                  │   RENTED    │                        │
                  └──────┬──────┘                        │
                         │ end rental / return            │
                         ▼                               │
                  ┌─────────────┐                        │
                  │  AVAILABLE  │ ───────────────────────┘
                  └──────┬──────┘
                         │ report damage
                         ▼
                  ┌─────────────┐      repaired
                  │ MAINTENANCE │ ───────────────────┐
                  └──────┬──────┘                    │
                         │ severe damage             │
                         ▼                           │
                  ┌─────────────┐                    │
                  │   BROKEN    │                    │
                  └─────────────┘                    │
                         │ retired                   │
                         ▼                           │
                  ┌─────────────┐                    │
                  │   RETIRED   │                    │
                  └─────────────┘                    │
                                                     │
   ┌───────────┐    no GPS signal > 1 hour           │
   │  OFFLINE  │ ←───────────────────────────────────┘
   └───────────┘    signal restored → KEMBALI KE STATUS SEBELUMNYA
```

### 2.3 Data Model

```
units
├── id: UUID (PK)
├── serial_number: VARCHAR(50) UNIQUE NOT NULL
├── type: ENUM('sport','suv','classic','jeep','motor','truck') NOT NULL
├── color: VARCHAR(30)
├── year: SMALLINT
├── gps_device_id: VARCHAR(100) UNIQUE
├── rfid_tag_id: VARCHAR(100) UNIQUE
├── qr_code_url: VARCHAR(500)
├── photo_url: VARCHAR(500)
├── status: ENUM('available','rented','maintenance','broken','retired','offline') DEFAULT 'available'
├── current_branch_id: UUID (FK → branches)
├── battery_level: SMALLINT (0-100) NULLABLE
├── total_rental_hours: INTEGER DEFAULT 0
├── total_rental_count: INTEGER DEFAULT 0
├── last_maintenance_at: TIMESTAMP
├── next_maintenance_due: TIMESTAMP
├── notes: TEXT
├── is_deleted: BOOLEAN DEFAULT FALSE
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

unit_location_logs
├── id: UUID (PK)
├── unit_id: UUID (FK → units)
├── latitude: DECIMAL(10,7)
├── longitude: DECIMAL(10,7)
├── speed: DECIMAL(5,2)
├── battery: SMALLINT
├── recorded_at: TIMESTAMP
└── INDEX (unit_id, recorded_at)

unit_transfer_logs
├── id: UUID (PK)
├── unit_id: UUID (FK → units)
├── from_branch_id: UUID (FK → branches)
├── to_branch_id: UUID (FK → branches)
├── transferred_by: UUID (FK → users)
├── reason: VARCHAR(255)
└── created_at: TIMESTAMP
```

---

## 3. Modul Manajemen Cabang

### 3.1 Functional Specifications

| ID | Fungsi | Deskripsi | Role |
|----|--------|-----------|------|
| BRN-01 | List Branches | Daftar 250 cabang dengan filter: provinsi, kota, status; tampilan tabel dan peta | super_admin |
| BRN-02 | View Branch Detail | Profil cabang, unit yang tersedia, transaksi hari ini, performa mingguan, daftar operator | super_admin, branch_admin (cabang sendiri) |
| BRN-03 | Create Branch | Tambah cabang baru: nama, alamat, koordinat, jam buka/tutup, kapasitas unit, kontak | super_admin |
| BRN-04 | Update Branch | Edit informasi cabang, jam operasional, status aktif/nonaktif | super_admin, branch_admin |
| BRN-05 | Deactivate Branch | Nonaktifkan cabang sementara (renovasi/libur); unit di cabang otomatis dipindahkan ke "pool pusat" | super_admin |
| BRN-06 | Branch Dashboard | Halaman ringkasan Operator/Manajer: unit tersedia, transaksi aktif, pendapatan hari ini, timer sewa berjalan | branch_admin, operator |
| BRN-07 | Open/Close Branch | Manajer/operator menandai cabang buka dan tutup harian; tercatat jam operasional aktual | branch_admin, operator |
| BRN-08 | Set Operating Hours | Konfigurasi jam operasional reguler (Senin-Minggu) dan jam khusus (tanggal merah, libur) | super_admin, branch_admin |

### 3.2 Data Model

```
branches
├── id: UUID (PK)
├── code: VARCHAR(10) UNIQUE NOT NULL (cth: "BDO-001")
├── name: VARCHAR(255) NOT NULL
├── address: TEXT NOT NULL
├── province: VARCHAR(100)
├── city: VARCHAR(100)
├── latitude: DECIMAL(10,7)
├── longitude: DECIMAL(10,7)
├── phone: VARCHAR(20)
├── capacity: INTEGER (maks unit yang bisa ditampung)
├── is_active: BOOLEAN DEFAULT TRUE
├── open_time: TIME
├── close_time: TIME
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

branch_operating_logs
├── id: UUID (PK)
├── branch_id: UUID (FK → branches)
├── opened_by: UUID (FK → users)
├── opened_at: TIMESTAMP
├── closed_by: UUID (FK → users) NULLABLE
├── closed_at: TIMESTAMP NULLABLE
└── notes: VARCHAR(255)

branch_special_hours
├── id: UUID (PK)
├── branch_id: UUID (FK → branches)
├── date: DATE
├── open_time: TIME NULLABLE (NULL = tutup)
├── close_time: TIME NULLABLE
├── reason: VARCHAR(255)
└── INDEX (branch_id, date)
```

---

## 4. Modul Sewa & Pembayaran

### 4.1 Functional Specifications

| ID | Fungsi | Deskripsi | Role |
|----|--------|-----------|------|
| RENT-01 | Start Rental | Operator scan QR unit → pilih durasi (15/30/45 menit) → sistem hitung biaya → tampilkan ke operator | operator |
| RENT-02 | Process Payment | Pilih metode: tunai, QRIS, GoPay; konfirmasi pembayaran; generate struk digital | operator |
| RENT-03 | View Active Rentals | Daftar sewa yang sedang berjalan di cabang; timer countdown real-time per sewa | operator, branch_admin |
| RENT-04 | Extend Rental | Tambah durasi sewa (15/30/45 menit) untuk sewa yang sedang berjalan; biaya tambahan otomatis | operator |
| RENT-05 | End Rental | Konfirmasi pengembalian unit; jika terlambat, hitung denda; status unit kembali available | operator |
| RENT-06 | View Rental History | Riwayat transaksi dengan filter: tanggal, cabang, status; detail per transaksi | super_admin (semua), branch_admin (cabang), customer (pribadi) |
| RENT-07 | Calculate Fee | Kalkulasi otomatis: biaya sewa + denda keterlambatan - diskon; sistem harus deterministik dan teraudit | Sistem (otomatis) |
| RENT-08 | Generate Digital Receipt | Struk transaksi dikirim via WhatsApp customer (jika nomor tersedia) atau ditampilkan di layar | Sistem (otomatis) |
| RENT-09 | Cancel Rental | Batalkan sewa yang belum dimulai (belum dibayar); unit kembali ke available | operator |
| RENT-10 | Daily Cash Report | Ringkasan kas harian: total tunai + QRIS + GoPay, jumlah transaksi, total unit disewakan | operator, branch_admin |

### 4.2 Timer & Denda Logic

```
BIYA SEWA (berdasarkan durasi):
├── 15 menit: Rp20.000
├── 30 menit: Rp30.000
└── 45 menit: Rp40.000

DENDA KETERLAMBATAN:
└── Rp2.000 per menit keterlambatan
└── Maksimum denda: 2× biaya sewa awal
    (Contoh: sewa 15 menit = Rp20.000 → denda maks Rp40.000)

PERPANJANGAN:
├── 15 menit tambahan: Rp15.000 (diskon dari harga normal)
├── 30 menit tambahan: Rp25.000
└── 45 menit tambahan: Rp35.000

TIMER FLOW:
Sewa Dimulai → Countdown aktif di dashboard operator
             → Notifikasi WhatsApp ke customer di T-5 menit
             → T+0: Status "Terlambat", denda mulai berjalan
             → Denda bertambah Rp2.000/menit
             → Operator konfirmasi pengembalian → Finalisasi biaya
```

### 4.3 Data Model

```
rentals
├── id: UUID (PK)
├── rental_code: VARCHAR(20) UNIQUE NOT NULL (cth: "R-20260607-BDO-0001")
├── unit_id: UUID (FK → units)
├── customer_name: VARCHAR(255)
├── customer_phone: VARCHAR(20) (opsional, untuk notifikasi)
├── operator_id: UUID (FK → users)
├── branch_id: UUID (FK → branches)
├── duration_minutes: SMALLINT NOT NULL (15/30/45)
├── base_price: DECIMAL(10,2) NOT NULL
├── extension_minutes: SMALLINT DEFAULT 0
├── extension_price: DECIMAL(10,2) DEFAULT 0
├── late_minutes: SMALLINT DEFAULT 0
├── late_fee: DECIMAL(10,2) DEFAULT 0
├── total_price: DECIMAL(10,2) NOT NULL
├── payment_method: ENUM('cash','qris','gopay')
├── payment_status: ENUM('pending','paid','refunded')
├── status: ENUM('active','completed','canceled')
├── started_at: TIMESTAMP NOT NULL
├── expected_end_at: TIMESTAMP NOT NULL
├── actual_end_at: TIMESTAMP
├── notes: TEXT
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

INDEX: (unit_id, status)
INDEX: (branch_id, started_at)
INDEX: (operator_id, created_at)

transactions
├── id: UUID (PK)
├── rental_id: UUID (FK → rentals) UNIQUE
├── payment_method: ENUM('cash','qris','gopay')
├── payment_gateway_ref: VARCHAR(255) (reference dari Midtrans/Xendit, NULL untuk cash)
├── amount: DECIMAL(10,2)
├── status: ENUM('pending','success','failed','refunded')
├── paid_at: TIMESTAMP
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

---

## 5. Modul Tracking (GPS/RFID)

### 5.1 Functional Specifications

| ID | Fungsi | Deskripsi | Role |
|----|--------|-----------|------|
| TRK-01 | Real-Time Map | Peta interaktif (Mapbox/Google Maps) menampilkan posisi seluruh unit real-time | super_admin, branch_admin |
| TRK-02 | Unit Location Detail | Klik unit di peta → info: unit ID, status, cabang, baterai, kecepatan, terakhir update | super_admin, branch_admin |
| TRK-03 | Location History | Riwayat pergerakan unit per jam/per hari; bisa playback rute | super_admin, branch_admin |
| TRK-04 | Geofence Configuration | Set zona geofence per cabang (default: radius 100m dari koordinat cabang) | super_admin |
| TRK-05 | Geofence Alert | Alert real-time di dashboard + notifikasi jika unit keluar zona geofence | super_admin, branch_admin |
| TRK-06 | Offline Detection | Unit yang tidak kirim sinyal > 1 jam → status jadi OFFLINE → alert | Sistem (otomatis) |
| TRK-07 | Battery Monitoring | Pantau level baterai modul GPS per unit; alert jika < 10% | Sistem (otomatis) |
| TRK-08 | Heatmap Utilization | Visualisasi heatmap area dengan aktivitas unit tertinggi untuk analisis lokasi strategis | super_admin |
| TRK-09 | GPS Data Ingestion | API endpoint menerima data dari modul GPS unit (MQTT/HTTP) → proses → simpan ke database | Sistem (backend) |
| TRK-10 | WebSocket Stream | Push update posisi unit ke frontend via WebSocket untuk real-time rendering | Sistem (backend → frontend) |

### 5.2 GPS Data Ingestion Flow

```
[GPS Module on Unit]
    │  HTTP POST / MQTT publish
    │  Payload: { unit_id, lat, lng, speed, battery, timestamp }
    ▼
[API Gateway / MQTT Broker]
    │  Validasi + rate limiting
    ▼
[GPS Ingestion Service]
    │  Parsing & enrichment (tambah cabang, geofence check)
    │  Update unit.battery_level, unit_location_logs
    ▼
[Database] ─── [WebSocket Server] ─── [Frontend Map]
    │                                       │
    └─── Check geofence ──── Alert jika outside zone
```

### 5.3 Data Model

```
unit_location_logs (didefinisikan di Modul 2 — lihat 2.3)
geofences
├── id: UUID (PK)
├── branch_id: UUID (FK → branches) UNIQUE
├── center_lat: DECIMAL(10,7)
├── center_lng: DECIMAL(10,7)
├── radius_meters: INTEGER DEFAULT 100
├── is_active: BOOLEAN DEFAULT TRUE
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

geofence_alerts
├── id: UUID (PK)
├── unit_id: UUID (FK → units)
├── geofence_id: UUID (FK → geofences)
├── latitude: DECIMAL(10,7)
├── longitude: DECIMAL(10,7)
├── alert_type: ENUM('exit','enter','offline','low_battery')
├── acknowledged_by: UUID (FK → users) NULLABLE
├── acknowledged_at: TIMESTAMP NULLABLE
└── created_at: TIMESTAMP
```

---

## 6. Modul Pop-Up Store

### 6.1 Functional Specifications

| ID | Fungsi | Deskripsi | Role |
|----|--------|-----------|------|
| POP-01 | Create Event | Daftarkan event pop-up: nama event, lokasi, tanggal, jam operasional, expected visitors | super_admin |
| POP-02 | Allocate Units | Pilih unit dari pool pusat untuk dialokasikan ke event; catat jumlah dan serial number | super_admin |
| POP-03 | Event Check-In | Operator check-in di lokasi event (GPS validation); unit ditandai "di event" | operator |
| POP-04 | Event Operations | Transaksi sewa normal menggunakan modul sewa yang sama; sistem menandai transaksi sbg "pop-up" | operator |
| POP-05 | Event Check-Out | Akhiri event; kembalikan unit ke pool pusat atau cabang terdekat; generate laporan event | operator |
| POP-06 | Event Dashboard | Ringkasan event yang sedang berlangsung: unit di event, pendapatan, estimasi selesai | super_admin |
| POP-07 | Event History | Riwayat seluruh event dengan metrik: pendapatan, unit disewa, ROI, durasi | super_admin |
| POP-08 | Event Calendar | Kalender yang menampilkan event terjadwal; cegah konflik alokasi unit | super_admin |

### 6.2 Data Model

```
events
├── id: UUID (PK)
├── name: VARCHAR(255) NOT NULL
├── event_type: ENUM('mall','festival','car_free_day','exhibition','other')
├── address: TEXT NOT NULL
├── latitude: DECIMAL(10,7)
├── longitude: DECIMAL(10,7)
├── start_date: DATE NOT NULL
├── end_date: DATE NOT NULL
├── open_time: TIME
├── close_time: TIME
├── expected_visitors: INTEGER
├── status: ENUM('planned','active','completed','canceled')
├── created_by: UUID (FK → users)
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

event_units
├── id: UUID (PK)
├── event_id: UUID (FK → events)
├── unit_id: UUID (FK → units)
├── checked_in: BOOLEAN DEFAULT FALSE
├── checked_in_at: TIMESTAMP
├── checked_out_at: TIMESTAMP
└── INDEX (event_id)

event_operators
├── id: UUID (PK)
├── event_id: UUID (FK → events)
├── user_id: UUID (FK → users)
└── INDEX (event_id)
```

---

## 7. Modul Laporan & Analytics

### 7.1 Functional Specifications

| ID | Fungsi | Deskripsi | Role |
|----|--------|-----------|------|
| RPT-01 | Daily Revenue Report | Total pendapatan hari ini per cabang; otomatis terkirim 23:59 | super_admin, branch_admin |
| RPT-02 | Monthly Report | Agregat bulanan: pendapatan, transaksi, utilisasi, unit terpopuler, cabang terbaik | super_admin, branch_admin |
| RPT-03 | Unit Utilization Report | Persentase waktu unit disewa vs idle per hari/minggu/bulan | super_admin |
| RPT-04 | Branch Performance Comparison | Tabel perbandingan semua cabang: pendapatan, utilisasi, rating, transaksi | super_admin |
| RPT-05 | Revenue Trend Chart | Line chart pendapatan harian/mingguan/bulanan dengan perbandingan periode sebelumnya | super_admin |
| RPT-06 | Peak Hours Analysis | Heatmap jam sibuk per cabang; identifikasi jam dengan transaksi terbanyak | super_admin |
| RPT-07 | Export Report | Download laporan dalam format Excel (.xlsx) atau PDF | super_admin, branch_admin |
| RPT-08 | Custom Date Range | Filter laporan dengan rentang tanggal kustom | super_admin, branch_admin |
| RPT-09 | Event ROI Report | Analisis profitabilitas setiap event pop-up: pendapatan vs biaya operasional | super_admin |
| RPT-10 | Dashboard KPI Cards | 4-6 kartu ringkasan: Pendapatan Hari Ini, Unit Disewa, Unit Tersedia, Cabang Aktif | Semua (sesuai scope data) |

### 7.2 Report Structure (Daily)

```
LAPORAN HARIAN - [TANGGAL]
═══════════════════════════════════════

RINGKASAN NASIONAL:
├── Total Pendapatan: Rp [nominal]
├── Total Transaksi: [jumlah]
├── Total Unit Disewa: [jumlah]
├── Rata-rata Utilisasi: [persentase]%
└── Total Cabang Aktif: [jumlah]

PER CABANG:
├── [Nama Cabang]
│   ├── Pendapatan: Rp [nominal]
│   ├── Transaksi: [jumlah]
│   ├── Unit Disewa: [jumlah]
│   ├── Rata-rata Durasi Sewa: [menit]
│   └── Pendapatan Rata-rata/Unit: Rp [nominal]

UNIT TERPOPULER:
├── 1. [Tipe Unit] - [jumlah sewa]
├── 2. [Tipe Unit] - [jumlah sewa]
└── 3. [Tipe Unit] - [jumlah sewa]
```

---

## 8. Modul Notifikasi

### 8.1 Functional Specifications

| ID | Fungsi | Deskripsi | Channel | Trigger |
|----|--------|-----------|---------|---------|
| NOTIF-01 | Sewa Hampir Habis | Notifikasi ke customer 5 menit sebelum waktu sewa berakhir | WhatsApp | Timer T-5 menit |
| NOTIF-02 | Sewa Terlambat | Notifikasi ke customer saat sewa melebihi durasi | WhatsApp | Timer T+0 |
| NOTIF-03 | Struk Digital | Kirim struk transaksi setelah pembayaran sukses | WhatsApp | Payment success |
| NOTIF-04 | Unit Tersedia Rendah | Notifikasi ke Manajer Cabang jika unit tersedia < 5 di cabangnya | WhatsApp / In-App | Unit count check setiap transaksi |
| NOTIF-05 | Unit Offline | Notifikasi ke Admin Pusat jika unit tidak kirim sinyal > 1 jam | In-App + Email | GPS ingestion gap > 1 jam |
| NOTIF-06 | Unit Keluar Geofence | Alert ke Admin Pusat jika unit keluar zona | In-App + WhatsApp | Geofence violation |
| NOTIF-07 | Maintenance Due | Pengingat servis berkala (setiap 500 jam operasi) | In-App + Email | Unit total_rental_hours >= 500 × N |
| NOTIF-08 | Laporan Harian | Kirim ringkasan laporan harian ke Admin Pusat | Email | Setiap hari 06:00 WIB |
| NOTIF-09 | Pop-Up Event Reminder | Pengingat ke operator yang dijadwalkan untuk event besok | WhatsApp | H-1 event |
| NOTIF-10 | Baterai GPS Rendah | Alert jika baterai modul GPS unit < 10% | In-App | Battery level check |

### 8.2 WhatsApp Integration Flow

```
[Trigger Event]
    │
    ▼
[Notification Service]
    │  Format pesan sesuai template
    │  Pilih channel (WhatsApp/Email/In-App)
    ▼
[WhatsApp Business API] (via provider: WATI / Twilio / Qiscus)
    │  POST /v1/messages
    │  { to: "628xxxxxxxx", template_name: "rental_reminder", params: {...} }
    ▼
[Customer menerima pesan WhatsApp]
```

### 8.3 Data Model

```
notifications
├── id: UUID (PK)
├── user_id: UUID (FK → users) NULLABLE
├── type: VARCHAR(50) NOT NULL
├── title: VARCHAR(255) NOT NULL
├── message: TEXT NOT NULL
├── channel: ENUM('in_app','whatsapp','email')
├── status: ENUM('pending','sent','delivered','read','failed')
├── reference_type: VARCHAR(50) (rental/unit/branch/event)
├── reference_id: UUID
├── sent_at: TIMESTAMP
├── read_at: TIMESTAMP
└── created_at: TIMESTAMP
```

---

## 9. Data Flow Diagrams

### 9.1 High-Level System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE VPS                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                NUXT 4 APPLICATION                     │   │
│  │  ┌─────────┐  ┌──────────┐  ┌───────────────────┐   │   │
│  │  │  Pages   │  │  Server  │  │  Pinia Stores     │   │   │
│  │  │  (SSR)   │  │  API     │  │  (State Mgmt)     │   │   │
│  │  └─────────┘  └────┬─────┘  └───────────────────┘   │   │
│  │                     │                                 │   │
│  │         ┌───────────┴───────────┐                    │   │
│  │         ▼                       ▼                    │   │
│  │  ┌─────────────┐        ┌─────────────┐             │   │
│  │  │  PostgreSQL │        │    Redis     │             │   │
│  │  │ (Primary DB)│        │  (Cache/WS)  │             │   │
│  │  └─────────────┘        └─────────────┘             │   │
│  │                                                       │   │
│  │  ┌─────────────┐        ┌─────────────┐             │   │
│  │  │  WebSocket  │        │   BullMQ    │             │   │
│  │  │   Server    │        │ (Job Queue) │             │   │
│  │  └─────────────┘        └─────────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
         ▲              ▲              │              │
         │              │              ▼              ▼
    ┌────┴────┐   ┌────┴────┐   ┌─────────┐   ┌──────────┐
    │  User   │   │ Operator │   │  GPS    │   │ External │
    │ Browser │   │  Mobile  │   │ Modules │   │   APIs   │
    └─────────┘   └─────────┘   │(40K unit)│   │(Payments,│
                                └─────────┘   │ WhatsApp,│
                                              │  Email)  │
                                              └──────────┘
```

### 9.2 Sewa Transaction Flow

```
CUSTOMER          OPERATOR              SYSTEM                EXTERNAL
   │                  │                    │                     │
   │  "Mau sewa"      │                    │                     │
   │ ───────────────> │                    │                     │
   │                  │                    │                     │
   │                  │  Scan QR / pilih   │                     │
   │                  │ ──────────────────>│                     │
   │                  │                    │ Validasi unit       │
   │                  │                    │ (status must be     │
   │                  │                    │  "available")       │
   │                  │                    │                     │
   │                  │  Unit info + harga │                     │
   │                  │ <──────────────────│                     │
   │                  │                    │                     │
   │  "30 menit ya"   │                    │                     │
   │ ───────────────> │                    │                     │
   │                  │                    │                     │
   │                  │  Konfirmasi sewa   │                     │
   │                  │ ──────────────────>│                     │
   │                  │                    │ Create rental       │
   │                  │                    │ status: active      │
   │                  │                    │ unit status: rented │
   │                  │                    │ start timer         │
   │                  │                    │                     │
   │  Mau bayar QRIS  │                    │                     │
   │ ───────────────> │                    │                     │
   │                  │                    │                     │
   │                  │  Proses pembayaran │                     │
   │                  │ ──────────────────>│                     │
   │                  │                    │ Create transaction  │
   │                  │                    │ ───────────────────>│ Payment Gateway
   │  Scan QR         │                    │                     │ (Midtrans/Xendit)
   │ <─────────────── │ <──────────────────│ <───────────────────│
   │                  │                    │                     │
   │  Bayar           │                    │                     │
   │ ───────────────────────────────────────────────────────────>│
   │                  │                    │                     │
   │                  │                    │ Payment confirmed   │
   │                  │                    │ <───────────────────│
   │                  │                    │                     │
   │                  │  Pembayaran sukses │                     │
   │                  │ <──────────────────│                     │
   │                  │                    │ Send receipt        │
   │                  │                    │ ───────────────────>│ WhatsApp
   │  Terima struk WA │                    │                     │
   │ <──────────────────────────────────────────────────────────│
   │                  │                    │                     │
   │  ... 25 menit ...│                    │                     │
   │                  │                    │ T-5: send reminder  │
   │                  │                    │ ───────────────────>│ WhatsApp
   │  "Waktu habis"   │                    │                     │
   │ <──────────────────────────────────────────────────────────│
   │                  │                    │                     │
   │  Kembalikan unit │                    │                     │
   │ ───────────────> │                    │                     │
   │                  │                    │                     │
   │                  │  Konfirmasi return │                     │
   │                  │ ──────────────────>│                     │
   │                  │                    │ End rental          │
   │                  │                    │ status: completed   │
   │                  │                    │ unit: available     │
   │                  │                    │ hitung denda (if)   │
   │                  │                    │                     │
   │                  │  Transaksi selesai │                     │
   │                  │ <──────────────────│                     │
```

### 9.3 Real-Time Tracking Flow

```
GPS MODULE (per unit)         BACKEND                    FRONTEND
      │                          │                          │
      │  POST /api/v1/gps/data   │                          │
      │  {unit_id, lat, lng,     │                          │
      │   speed, battery, ts}    │                          │
      │ ────────────────────────>│                          │
      │                          │                          │
      │                          │ 1. Validate payload      │
      │                          │ 2. Save location_log     │
      │                          │ 3. Update unit.latest_*  │
      │                          │ 4. Check geofence        │
      │                          │                          │
      │                          │ 5. If geofence violation │
      │                          │    → Create alert        │
      │                          │    → Send notification   │
      │                          │                          │
      │                          │ 6. Publish to WebSocket  │
      │                          │    channel: units:{id}   │
      │                          │ ─────────────────────────>│
      │                          │                          │
      │                          │                          │ Real-time
      │                          │                          │ map update
      │                          │                          │ (move marker,
      │                          │                          │  update info)
      │                          │                          │
      │  (setiap 10-30 detik)    │                          │
      │ ────────────────────────>│ ─────────────────────────>│
      │         ...              │          ...             │
```

### 9.4 Geofence Check Logic

```
SETIAP KALI DATA GPS DITERIMA:

1. Ambil unit.current_branch_id
2. Query geofences WHERE branch_id = unit.current_branch_id AND is_active = true
3. Hitung jarak: distance(lat_unit, lng_unit, center_lat, center_lng)
   Formula: Haversine
4. Jika distance > radius_meters:
   a. Jika sebelumnya di dalam zona → trigger "exit" alert
   b. Buat record di geofence_alerts
   c. Kirim notifikasi ke Admin Pusat
5. Jika distance <= radius_meters:
   a. Jika sebelumnya di luar zona → trigger "enter" alert (clear)
6. Update unit.last_geofence_status

JARAK HAVERSINE:
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
d = R × c  (R = 6.371 km)
```

---

## 10. API Specifications

### 10.1 API Architecture

- **Base URL:** `https://api.rentalmobilanak.id/api/v1`
- **Format:** JSON (request & response)
- **Autentikasi:** Bearer JWT token di header `Authorization: Bearer <token>`
- **Versioning:** URI-based (`/api/v1/`)
- **Rate Limiting:** `X-RateLimit-Limit`, `X-RateLimit-Remaining` headers

### 10.2 API Endpoints

#### Auth

```
POST   /api/v1/auth/register          # Register customer
POST   /api/v1/auth/login             # Login semua role
POST   /api/v1/auth/logout            # Logout & invalidate refresh token
POST   /api/v1/auth/refresh           # Refresh access token
POST   /api/v1/auth/forgot-password   # Request reset password link
POST   /api/v1/auth/reset-password    # Reset password dengan token
GET    /api/v1/auth/me                # Get current user profile
PUT    /api/v1/auth/me                # Update current user profile
PUT    /api/v1/auth/change-password   # Change password
```

#### Users (super_admin, branch_admin)

```
GET    /api/v1/users                  # List users (filter: role, branch_id)
POST   /api/v1/users                  # Create user (super_admin only)
GET    /api/v1/users/:id              # Get user detail
PUT    /api/v1/users/:id              # Update user
DELETE /api/v1/users/:id              # Deactivate user (soft delete)
POST   /api/v1/users/:id/assign-branch # Assign user ke cabang
```

#### Branches

```
GET    /api/v1/branches               # List branches (filter: province, city, status)
POST   /api/v1/branches               # Create branch (super_admin)
GET    /api/v1/branches/:id           # Get branch detail
PUT    /api/v1/branches/:id           # Update branch
DELETE /api/v1/branches/:id           # Deactivate branch (super_admin)
POST   /api/v1/branches/:id/open      # Open branch (check-in)
POST   /api/v1/branches/:id/close     # Close branch (check-out)
GET    /api/v1/branches/:id/dashboard # Branch dashboard data
GET    /api/v1/branches/:id/units     # Units at branch
```

#### Units

```
GET    /api/v1/units                  # List units (filter: status, branch_id, type)
POST   /api/v1/units                  # Create unit (super_admin)
POST   /api/v1/units/bulk-import      # Bulk import CSV (super_admin)
GET    /api/v1/units/:id              # Get unit detail
PUT    /api/v1/units/:id              # Update unit
DELETE /api/v1/units/:id              # Soft delete unit (super_admin)
POST   /api/v1/units/:id/assign       # Assign unit ke branch
PATCH  /api/v1/units/:id/status       # Update unit status
GET    /api/v1/units/:id/history      # Rental history
GET    /api/v1/units/:id/location     # Current location + recent path
GET    /api/v1/units/:id/qr           # Get QR code image
POST   /api/v1/units/:id/maintenance  # Log maintenance
GET    /api/v1/units/:id/maintenance  # Maintenance history
```

#### Rentals

```
GET    /api/v1/rentals                # List rentals (filter: branch_id, status, date)
POST   /api/v1/rentals                # Start new rental
GET    /api/v1/rentals/:id            # Get rental detail
POST   /api/v1/rentals/:id/extend     # Extend rental duration
POST   /api/v1/rentals/:id/end        # End rental (return unit)
POST   /api/v1/rentals/:id/cancel     # Cancel rental
POST   /api/v1/rentals/:id/pay        # Process payment
GET    /api/v1/rentals/active         # Active rentals (dashboard)
GET    /api/v1/rentals/:id/receipt    # Generate receipt
```

#### Tracking

```
GET    /api/v1/tracking/units         # All unit positions (real-time snapshot)
GET    /api/v1/tracking/units/:id     # Single unit current position
GET    /api/v1/tracking/units/:id/history  # Location history (query: from, to)
POST   /api/v1/tracking/data          # GPS data ingestion (from devices)
GET    /api/v1/tracking/alerts        # Geofence alerts (filter: status, branch)
PUT    /api/v1/tracking/alerts/:id/acknowledge  # Acknowledge alert
WS     /api/v1/tracking/ws            # WebSocket for real-time updates
```

#### Events (Pop-Up Store)

```
GET    /api/v1/events                 # List events (filter: status, date)
POST   /api/v1/events                 # Create event (super_admin)
GET    /api/v1/events/:id             # Get event detail
PUT    /api/v1/events/:id             # Update event
DELETE /api/v1/events/:id/cancel      # Cancel event
POST   /api/v1/events/:id/allocate    # Allocate units to event
POST   /api/v1/events/:id/check-in    # Operator check-in at event
POST   /api/v1/events/:id/check-out   # End event operations
GET    /api/v1/events/:id/report      # Event report
GET    /api/v1/events/calendar        # Event calendar data
```

#### Reports

```
GET    /api/v1/reports/daily           # Daily report (query: date, branch_id)
GET    /api/v1/reports/monthly         # Monthly report (query: month, year, branch_id)
GET    /api/v1/reports/utilization     # Unit utilization report
GET    /api/v1/reports/comparison      # Branch comparison
GET    /api/v1/reports/trend           # Revenue trend data
GET    /api/v1/reports/peak-hours      # Peak hours analysis
GET    /api/v1/reports/export          # Export to Excel/PDF
GET    /api/v1/reports/kpi             # KPI cards data
```

#### Notifications

```
GET    /api/v1/notifications           # User notifications
PUT    /api/v1/notifications/:id/read  # Mark as read
POST   /api/v1/notifications/send      # Send notification (internal service)
GET    /api/v1/notifications/settings  # Notification preferences
PUT    /api/v1/notifications/settings  # Update preferences
```

### 10.3 Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 50,
    "total": 40000,
    "total_pages": 800
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "UNIT_NOT_FOUND",
    "message": "Unit dengan ID tersebut tidak ditemukan",
    "details": { ... }  // opsional
  }
}
```

**Error Codes:**
| HTTP Status | Code | Deskripsi |
|-------------|------|-----------|
| 400 | `VALIDATION_ERROR` | Input tidak valid |
| 401 | `UNAUTHORIZED` | Token tidak ada atau expired |
| 403 | `FORBIDDEN` | Role tidak memiliki akses |
| 404 | `NOT_FOUND` | Resource tidak ditemukan |
| 409 | `CONFLICT` | Konflik data (serial number duplikat, dll) |
| 422 | `BUSINESS_RULE_VIOLATION` | Melanggar aturan bisnis (sewa unit maintenance, dll) |
| 429 | `RATE_LIMITED` | Terlalu banyak request |
| 500 | `INTERNAL_ERROR` | Server error |

### 10.4 Query Parameters Convention

```
?search=keyword          # Pencarian teks
&status=active,rented    # Filter array (comma-separated)
&branch_id=uuid          # Filter by branch
&date_from=2026-06-01    # Rentang tanggal
&date_to=2026-06-07
&page=1                  # Pagination
&per_page=50
&sort_by=created_at      # Sorting
&sort_order=desc
```

---

## 11. State Management (Pinia Stores)

### 11.1 Store Architecture

```
stores/
├── auth.ts              # Autentikasi & user session
├── branches.ts          # Data cabang
├── units.ts             # Data unit
├── rentals.ts           # Transaksi sewa
├── tracking.ts          # Data tracking & WebSocket
├── events.ts            # Pop-up store events
├── reports.ts           # Data laporan
├── notifications.ts     # Notifikasi
├── dashboard.ts         # Dashboard aggregator
└── ui.ts                # UI state (loading, sidebar, modal)
```

### 11.2 Store Definitions

#### auth.ts

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Actions:
//   login(email, password)
//   logout()
//   refreshToken()
//   fetchProfile()
//   updateProfile(data)

// Getters:
//   currentRole: 'super_admin' | 'branch_admin' | 'operator' | 'customer'
//   currentBranchId: string | null
//   hasPermission(resource, action): boolean
```

#### units.ts

```typescript
interface UnitsState {
  units: Unit[];
  currentUnit: Unit | null;
  filters: {
    search: string;
    status: string[];
    branchId: string | null;
    type: string | null;
  };
  pagination: { page: number; perPage: number; total: number };
  isLoading: boolean;
}

// Actions:
//   fetchUnits(filters?)
//   fetchUnit(id)
//   createUnit(data)
//   updateUnit(id, data)
//   deleteUnit(id)
//   assignToBranch(unitId, branchId)
//   updateStatus(unitId, status)
//   bulkImport(file)
```

#### rentals.ts

```typescript
interface RentalsState {
  rentals: Rental[];
  activeRentals: Rental[];
  currentRental: Rental | null;
  timers: Map<string, number>; // rentalId → remaining seconds
  filters: {
    branchId: string | null;
    status: string | null;
    dateFrom: string | null;
    dateTo: string | null;
  };
  isLoading: boolean;
}

// Actions:
//   fetchRentals(filters?)
//   fetchActiveRentals(branchId?)
//   startRental(unitId, duration, customerName, customerPhone?)
//   processPayment(rentalId, method, amount?)
//   extendRental(rentalId, additionalMinutes)
//   endRental(rentalId)
//   cancelRental(rentalId)

// Getters:
//   rentalTimers: computed Map<id, remainingTime>
//   activeCount: number
```

#### tracking.ts

```typescript
interface TrackingState {
  unitPositions: Map<string, UnitPosition>;
  selectedUnitId: string | null;
  locationHistory: LocationPoint[];
  geofences: Geofence[];
  alerts: GeofenceAlert[];
  wsConnected: boolean;
  isTracking: boolean;
}

// UnitPosition: { unitId, lat, lng, speed, battery, status, updatedAt }

// Actions:
//   connectWebSocket()
//   disconnectWebSocket()
//   fetchAllPositions()
//   fetchUnitPosition(unitId)
//   fetchLocationHistory(unitId, from, to)
//   fetchAlerts(filters?)
//   acknowledgeAlert(alertId)

// WebSocket message handlers:
//   handlePositionUpdate(data)
//   handleStatusChange(data)
//   handleAlert(data)
```

#### branches.ts

```typescript
interface BranchesState {
  branches: Branch[];
  currentBranch: Branch | null;
  branchDashboard: BranchDashboard | null;
  filters: { province: string; city: string; status: string };
  isLoading: boolean;
}

// BranchDashboard: { todayRevenue, totalTransactions, activeUnits, availableUnits, activeRentals }

// Actions:
//   fetchBranches(filters?)
//   fetchBranch(id)
//   fetchBranchDashboard(id)
//   createBranch(data)
//   updateBranch(id, data)
//   openBranch(id)
//   closeBranch(id)
```

#### dashboard.ts

```typescript
interface DashboardState {
  kpi: {
    totalRevenue: number;
    totalTransactions: number;
    activeUnits: number;
    rentedUnits: number;
    maintenanceUnits: number;
    offlineUnits: number;
    activeBranches: number;
  };
  revenueTrend: TrendDataPoint[];
  utilizationTrend: TrendDataPoint[];
  topBranches: BranchPerformance[];
  isLoading: boolean;
}

// TrendDataPoint: { date: string, value: number }
// BranchPerformance: { branchId, branchName, revenue, utilization, transactionCount }

// Actions:
//   fetchDashboardData()
//   fetchTrendData(period: 'week' | 'month' | 'year')
//   fetchTopBranches(limit?)
```

#### events.ts

```typescript
interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  calendarData: CalendarEvent[];
  filters: { status: string; dateFrom: string; dateTo: string };
  isLoading: boolean;
}

// CalendarEvent: { id, title, start, end, status, location }

// Actions:
//   fetchEvents(filters?)
//   fetchEvent(id)
//   createEvent(data)
//   updateEvent(id, data)
//   cancelEvent(id)
//   allocateUnits(eventId, unitIds)
//   checkIn(eventId)
//   checkOut(eventId)
```

#### reports.ts

```typescript
interface ReportsState {
  dailyReport: DailyReport | null;
  monthlyReport: MonthlyReport | null;
  comparisonData: BranchComparison[];
  trendData: TrendDataPoint[];
  peakHours: PeakHourData[];
  dateRange: { from: string; to: string };
  isLoading: boolean;
}

// Actions:
//   fetchDailyReport(date, branchId?)
//   fetchMonthlyReport(month, year, branchId?)
//   fetchUtilizationReport(period)
//   fetchComparisonData(period)
//   fetchTrendData(metric, period)
//   fetchPeakHours(date, branchId?)
//   exportReport(format: 'excel' | 'pdf', type, dateRange)
```

---

## 12. Error Handling

### 12.1 Client-Side Error Handling

#### Network Error

```
[API Request] → Network Error (timeout, no connection)
  ↓
Intercept di Nuxt API composable
  ↓
Tampilkan toast error: "Gagal terhubung ke server. Periksa koneksi internet Anda."
  ↓
Jika transaksi sewa sedang berlangsung:
  → Simpan data sementara di localStorage (queue)
  → Retry otomatis 3 kali dengan exponential backoff
  → Jika gagal semua: tampilkan dialog "Transaksi tertunda, akan dikirim saat koneksi pulih"
```

#### API Error

```
[API Response 4xx/5xx]
  ↓
Parse error response body → { code, message }
  ↓
  ├── 401 → Trigger token refresh → jika gagal → redirect /login
  ├── 403 → Redirect /unauthorized
  ├── 422 → Tampilkan pesan error di form field yang sesuai
  ├── 429 → Tunggu (Retry-After header) → retry
  ├── 409 → Tampilkan dialog konfirmasi: "Data sudah ada. Timpa?"
  └── 500 → Toast: "Terjadi kesalahan server. Silakan coba lagi."
```

#### Validation Error

```
[Form Submit]
  ↓
Client-side validation (Vee-Validate / Zod)
  ├── Field wajib kosong → Highlight field merah + pesan
  ├── Format tidak valid → Pesan spesifik ("Format email tidak valid")
  └── Lolos validasi client → Submit ke server
      ↓
      Server-side validation
      ├── Jika gagal → Return errors map { field: message }
      └── Tampilkan di form yang sama
```

### 12.2 Server-Side Error Handling

#### Standard Error Classes

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(details: Record<string, string[]>) {
    super(400, 'VALIDATION_ERROR', 'Data yang dikirim tidak valid', details);
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super(401, 'UNAUTHORIZED', 'Silakan login terlebih dahulu');
  }
}

class ForbiddenError extends AppError {
  constructor() {
    super(403, 'FORBIDDEN', 'Anda tidak memiliki akses ke resource ini');
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} tidak ditemukan`);
  }
}

class BusinessRuleError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(422, 'BUSINESS_RULE_VIOLATION', message, details);
  }
}
```

### 12.3 Critical Error Scenarios

| Skenario | Penanganan |
|----------|-----------|
| **GPS data tidak diterima** | Unit status → OFFLINE setelah 1 jam; notifikasi ke Admin Pusat; data terakhir tetap ditampilkan dengan indikator "data lama" |
| **Pembayaran gagal (timeout)** | Transaksi disimpan dengan status `pending`; operator bisa retry atau pilih metode lain; jika double payment → refund otomatis |
| **Konflik unit disewa bersamaan** | Optimistic locking: check `unit.updated_at` sebelum update; jika konflik, tolak sewa dengan pesan "Unit sedang digunakan operator lain" |
| **Database connection loss** | Connection pool retry 3 kali; jika gagal, return 503 Service Unavailable; health check endpoint untuk monitoring |
| **WebSocket disconnect** | Auto-reconnect dengan interval 1s, 2s, 5s, 10s (max 5 attempts); fallback ke polling setiap 30 detik |
| **Import CSV gagal di tengah** | Rollback seluruh batch; tampilkan error report baris mana yang gagal beserta alasannya |
| **Timer sewa tidak akurat** | Timer dihitung server-side berdasarkan `started_at + duration_minutes`; frontend hanya display; tidak bergantung pada client clock |

### 12.4 Audit Log

Setiap perubahan data kritis dicatat:

```
audit_logs
├── id: UUID (PK)
├── user_id: UUID (FK → users)
├── action: VARCHAR(50) (create/update/delete/status_change)
├── resource_type: VARCHAR(50) (unit/rental/branch/user/event)
├── resource_id: UUID
├── old_values: JSONB
├── new_values: JSONB
├── ip_address: VARCHAR(45)
├── user_agent: TEXT
└── created_at: TIMESTAMP
```

---

## 13. Integration Points

### 13.1 External Integrations

| # | Layanan | Provider | Tujuan | Metode |
|---|---------|----------|--------|--------|
| 1 | **GPS Device API** | Hardware vendor | Menerima data lokasi dari modul GPS di setiap unit | HTTP POST / MQTT |
| 2 | **Payment Gateway** | Midtrans / Xendit | Memproses pembayaran QRIS, GoPay, dan metode non-tunai lainnya | REST API + Webhook callback |
| 3 | **WhatsApp Business API** | WATI / Twilio / Qiscus | Mengirim notifikasi dan struk ke customer via WhatsApp | REST API |
| 4 | **Email Service** | Resend / SendGrid / AWS SES | Mengirim laporan harian dan notifikasi email | SMTP / REST API |
| 5 | **Maps** | Mapbox / Google Maps | Menampilkan peta interaktif, geocoding, dan geofencing | JavaScript SDK + REST API |
| 6 | **Object Storage** | Cloudflare R2 / AWS S3 | Menyimpan foto unit, QR code images, dan export laporan | S3-compatible API |
| 7 | **SMS Gateway** (fallback) | Twilio / Vonage | Fallback notifikasi jika WhatsApp gagal terkirim | REST API |

### 13.2 Internal Integration Points

| # | Integrasi | Deskripsi |
|---|-----------|-----------|
| 1 | **Modul Sewa → Modul Tracking** | Saat sewa dimulai, unit ditandai "rented"; tracking tetap berjalan untuk pantau posisi unit saat disewa |
| 2 | **Modul Tracking → Modul Notifikasi** | Saat unit keluar geofence atau offline, trigger notifikasi ke Admin Pusat |
| 3 | **Modul Sewa → Modul Notifikasi** | Saat timer T-5 menit atau transaksi selesai, trigger notifikasi ke customer |
| 4 | **Modul Sewa → Modul Laporan** | Setiap transaksi selesai, data langsung tersedia di laporan real-time (tanpa batch processing) |
| 5 | **Modul Unit → Modul Tracking** | Update status unit dan data lokasi saling terhubung; dashboard menampilkan keduanya |
| 6 | **Modul Pop-Up Store → Modul Sewa** | Transaksi di event menggunakan flow sewa yang sama; flag `event_id` untuk laporan terpisah |
| 7 | **Modul Notifikasi → WebSocket** | Notifikasi in-app dikirim via WebSocket yang sama dengan tracking channel |

### 13.3 Webhook Handlers

```
POST /api/v1/webhooks/payment
  Provider: Midtrans/Xendit
  Trigger: Status pembayaran berubah
  Action: Update transaction.status; update rental.payment_status
  Security: Verify signature hash

POST /api/v1/webhooks/whatsapp
  Provider: WhatsApp Business API
  Trigger: Status pesan berubah (sent/delivered/read/failed)
  Action: Update notifications.status
  Security: Verify webhook token

GET /api/v1/health
  Purpose: Health check untuk monitoring (UptimeRobot, status page)
  Response: { status: "ok", db: "connected", redis: "connected", uptime: 12345 }
```

### 13.4 Data Import Specifications

#### Import Cabang (CSV)

```
branch_code,name,address,province,city,latitude,longitude,phone,capacity,open_time,close_time
BDO-001,Cabang Bandung 1,Jl. Merdeka No. 10,Jawa Barat,Bandung,-6.9147,107.6098,08123456789,50,09:00,21:00
```

#### Import Unit (CSV)

```
serial_number,type,color,year,gps_device_id,rfid_tag_id,branch_code
M-2024-00001,sport,Merah,2024,GPS-00001,RFID-00001,BDO-001
M-2024-00002,suv,Biru,2024,GPS-00002,RFID-00002,BDO-001
```

- Branch code di-resolve ke branch_id saat import
- Duplicate serial_number → error, skip baris
- Maksimum 5.000 baris per import
- Progress bar real-time via WebSocket

---

## Data Model Summary (ERD)

```
users ─────────< rentals >───────── units ─────────< unit_location_logs
  │                  │                  │
  │                  │                  ├── unit_transfer_logs
  │                  │                  │
  │                  │                  └── geofence_alerts
  │                  │
  │                  ├── transactions
  │                  │
  ├── branches ──────┼── unit_location_logs (?)
  │      │           │
  │      ├── branch_operating_logs
  │      ├── branch_special_hours
  │      ├── geofences
  │      │
  │      └── units.current_branch_id
  │
  ├── events ─────── event_units
  │      │
  │      └── event_operators
  │
  ├── refresh_tokens
  ├── notifications
  └── audit_logs
```

---

**Dokumen ini telah diverifikasi konsisten dengan PRD-001 dan siap untuk tahap development.**

| Role | Nama | Tanggal | Tanda Tangan |
|------|------|---------|-------------|
| Product Manager | ___________ | ___________ | ___________ |
| Tech Lead | ___________ | ___________ | ___________ |
| Lead Developer | ___________ | ___________ | ___________ |
