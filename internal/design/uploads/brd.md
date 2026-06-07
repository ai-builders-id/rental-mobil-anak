# Business Requirements Document (BRD)
## Software Tracking Mobil-Mobilan Rental Anak

| Atribut | Nilai |
|---|---|
| **Judul Proyek** | Sistem Tracking & Manajemen Rental Mobil Mainan Listrik Anak |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 7 Juni 2026 |
| **Penulis** | Business Analyst |
| **Status** | Draft — Menunggu Persetujuan |
| **Klasifikasi** | Internal — Confidential |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Business Objectives](#2-business-objectives)
3. [Market Analysis](#3-market-analysis)
4. [Stakeholder Analysis](#4-stakeholder-analysis)
5. [Scope & Constraints](#5-scope--constraints)
6. [Success Metrics (KPI)](#6-success-metrics-kpi)
7. [Risk Assessment](#7-risk-assessment)
8. [Cost-Benefit Analysis](#8-cost-benefit-analysis)
9. [Regulatory Compliance](#9-regulatory-compliance)
10. [Lampiran](#10-lampiran)

---

## 1. Executive Summary

### 1.1 Latar Belakang

Bisnis rental mobil-mobilan listrik untuk anak telah beroperasi secara nasional dengan skala besar: **250 cabang** tersebar di seluruh Indonesia dan total **40.000 unit** mobil mainan listrik yang dikelola. Model bisnis mengandalkan format **pop-up store** — operasional diadakan pada event-event temporer seperti mal, car free day, festival, bazar, dan kegiatan komunitas.

Saat ini, proses operasional masih bergantung pada pencatatan manual dan koordinasi berbasis komunikasi informal (WhatsApp, telepon, spreadsheet). Dengan skala yang telah mencapai 250 titik dan 40.000 unit aset bergerak, pendekatan manual tersebut menimbulkan sejumlah permasalahan kritis:

- **Kehilangan visibilitas unit:** Tidak diketahui secara real-time di mana setiap unit berada, berapa utilisasinya, dan kapan terakhir dirawat.
- **Inkonsistensi data sewa:** Pencatatan durasi dan pendapatan per sesi tidak terstandardisasi antar cabang.
- **Kesulitan koordinasi operator pop-up:** Admin pusat tidak memiliki gambaran langsung tentang event mana yang sedang berjalan, berapa unit yang dikerahkan, dan berapa pendapatan yang dihasilkan per event.
- **Tidak ada data agregat untuk pengambilan keputusan:** Pemilik bisnis tidak dapat melihat tren, profitabilitas per cabang, atau performa per jenis unit secara cepat.

### 1.2 Solusi yang Diusulkan

Membangun sebuah **aplikasi software tracking dan manajemen** berbasis web yang menyatukan seluruh proses bisnis ke dalam satu platform terintegrasi. Aplikasi ini akan menyediakan:

1. **Pelacakan unit real-time** — Setiap unit mobil mainan tercatat dengan identitas unik, lokasi terakhir, status (tersedia/disewa/maintenance), dan riwayat pergerakan antar cabang/event.
2. **Manajemen cabang dan event** — Admin pusat dapat menjadwalkan dan memonitor pop-up store, mengalokasikan unit, serta menugaskan operator.
3. **Sistem sewa terdigitalisasi** — Operator mencatat transaksi sewa (mulai/selesai) melalui antarmuka sederhana; sistem menghitung otomatis durasi, biaya, dan mencatat pendapatan.
4. **Dashboard analytics** — Laporan pendapatan, utilisasi, performa cabang, dan tren dalam bentuk visual yang dapat diakses pemilik dan manajemen pusat kapan saja.

### 1.3 Ringkasan Teknis

| Komponen | Pilihan |
|---|---|
| **Platform** | Web Application (Progressive Web App — dapat diakses via mobile browser) |
| **Frontend Framework** | Nuxt 4 + Nuxt UI 4 (Vue 3 ecosystem) |
| **Backend** | Nuxt Server (Nitro) — API routes, server middleware |
| **Database** | PostgreSQL (primary) + Redis (caching/session) |
| **Infrastruktur** | Cloudflare VPS — single-instance deployment, CDN via Cloudflare |
| **Target Pengguna** | Admin pusat (dashboard), operator pop-up (mobile web), owner cabang (reporting view) |

---

## 2. Business Objectives

### 2.1 Tujuan Strategis

Seluruh objective disusun dalam kerangka **SMART** (Specific, Measurable, Achievable, Relevant, Time-bound).

#### OBJ-01: Digitalisasi Operasional Rental

| Dimensi | Deskripsi |
|---|---|
| **Specific** | Menggantikan seluruh pencatatan manual sewa, alokasi unit, dan pelaporan dengan sistem digital terintegrasi yang mencakup 250 cabang dan 40.000 unit |
| **Measurable** | 100% transaksi sewa tercatat secara digital; 0 spreadsheet/nota manual yang digunakan untuk pelaporan harian |
| **Achievable** | Aplikasi web PWA dengan antarmuka sederhana; operator hanya perlu smartphone dengan browser |
| **Relevant** | Menghilangkan human error, mempercepat rekonsiliasi, dan menyediakan data real-time untuk manajemen |
| **Time-bound** | Go-live MVP dalam 6 bulan; adopsi penuh 250 cabang dalam 12 bulan |

#### OBJ-02: Peningkatan Utilisasi Unit

| Dimensi | Deskripsi |
|---|---|
| **Specific** | Memaksimalkan waktu operasional setiap unit dengan visibilitas penuh atas lokasi dan status unit, serta fitur alokasi otomatis ke event-event yang membutuhkan |
| **Measurable** | Meningkatkan rata-rata utilisasi unit dari baseline saat ini menjadi minimal 65% (hari operasional/total hari tersedia) |
| **Achievable** | Dengan data real-time, unit idle dapat segera dialokasikan ulang; fitur prediksi permintaan membantu perencanaan event |
| **Relevant** | Setiap unit idle adalah pendapatan yang hilang; utilisasi langsung berkorelasi dengan revenue |
| **Time-bound** | Baseline utilisasi diukur dalam 3 bulan pertama setelah go-live; target 65% tercapai dalam 18 bulan |

#### OBJ-03: Peningkatan Akurasi Pelaporan Keuangan

| Dimensi | Deskripsi |
|---|---|
| **Specific** | Menyediakan laporan pendapatan harian/mingguan/bulanan otomatis per cabang, per event, dan per unit dengan akurasi 99%+ terhadap data transaksi aktual |
| **Measurable** | Selisih antara laporan sistem dan setoran tunai < 1%; waktu rekonsiliasi bulanan turun dari 5 hari menjadi < 1 hari |
| **Achievable** | Sistem mencatat setiap transaksi start/stop sewa secara otomatis dengan timestamp server |
| **Relevant** | Kepercayaan pemilik cabang dan admin pusat terhadap data keuangan adalah fondasi skalabilitas bisnis |
| **Time-bound** | Akurasi diverifikasi dalam pilot 10 cabang sebelum peluncuran penuh; rekonsiliasi otomatis penuh dalam 9 bulan |

#### OBJ-04: Efisiensi Operasional Admin Pusat

| Dimensi | Deskripsi |
|---|---|
| **Specific** | Mengurangi waktu yang dihabiskan admin pusat untuk koordinasi event, alokasi unit, dan kompilasi laporan dari 250 cabang |
| **Measurable** | Waktu admin pusat untuk tugas-tugas tersebut berkurang 60%; dari ~40 jam/minggu menjadi ~16 jam/minggu |
| **Achievable** | Otomatisasi penjadwalan event, alokasi unit berbasis aturan, dan agregasi laporan real-time |
| **Relevant** | Admin pusat dapat fokus pada ekspansi dan optimasi bisnis alih-alih pekerjaan administratif |
| **Time-bound** | 30% reduksi dalam 3 bulan pasca-go-live; 60% dalam 12 bulan |

#### OBJ-05: Kesiapan Skala Nasional

| Dimensi | Deskripsi |
|---|---|
| **Specific** | Arsitektur sistem harus mampu menangani operasional hingga 500 cabang dan 80.000 unit tanpa penurunan performa signifikan |
| **Measurable** | Response time API < 500ms pada 95th percentile di beban 500 cabang simultan; sistem tetap responsif pada peak hour Sabtu-Minggu |
| **Achievable** | Desain arsitektur dengan caching Redis, query optimization, dan infrastruktur Cloudflare yang scalable |
| **Relevant** | Bisnis memiliki rencana ekspansi; sistem harus mendukung, bukan menghambat pertumbuhan |
| **Time-bound** | Arsitektur dirancang untuk skala ini sejak Fase 1; load testing dilakukan sebelum go-live |

---

## 3. Market Analysis

### 3.1 Tinjauan Pasar Rental Mainan Anak di Indonesia

#### 3.1.1 Ukuran dan Potensi Pasar

Indonesia memiliki populasi anak usia 0–14 tahun sekitar **70 juta jiwa** (BPS, 2025), atau sekitar 25% dari total populasi. Dengan pertumbuhan kelas menengah yang berkelanjutan dan urbanisasi yang meningkat, pengeluaran rumah tangga untuk rekreasi anak terus bertumbuh.

**Segmen rental mainan listrik anak** adalah ceruk (niche) dalam industri rekreasi keluarga yang lebih besar. Beberapa indikator pasar:

- **Event dan festival anak:** Ratusan event diselenggarakan setiap minggu di seluruh Indonesia — mulai dari car free day di 30+ kota, bazar akhir pekan di mal-mal besar, hingga festival komunitas dan sekolah.
- **Tren "experience over goods":** Orang tua milenial dan Gen Z lebih memilih membelanjakan uang untuk pengalaman anak (sewa mainan, playground, edutainment) dibanding membeli mainan mahal yang cepat bosan.
- **Pertumbuhan mal di Indonesia:** Terdapat lebih dari 300 mal di Indonesia (APPBI); sebagian besar menyediakan area untuk pop-up store dan aktivitas anak.
- **Potensi pendapatan kasar:** Dengan 40.000 unit, asumsi harga sewa rata-rata Rp25.000/15 menit, dan utilisasi 50% (3 jam operasional per unit per hari event), potensi pendapatan harian mencapai **Rp 7,5 miliar** pada hari event penuh.

#### 3.1.2 Tren Industri

| Tren | Implikasi untuk Bisnis |
|---|---|
| **Digitalisasi UMKM** | Pemerintah mendorong digitalisasi melalui program seperti Bangga Buatan Indonesia dan Gerakan Nasional Bangga Digital; adopsi aplikasi manajemen mendukung positioning bisnis sebagai UMKM modern |
| **Cashless Society** | QRIS dan dompet digital semakin dominan; sistem harus mendukung integrasi pembayaran digital di masa depan |
| **Social Media & Word-of-Mouth** | Pop-up store yang menarik menjadi konten viral; integrasi dengan media sosial (foto anak dengan mobil) dapat menjadi saluran pemasaran organik |
| **Safety & Hygiene Awareness** | Pasca-pandemi, orang tua sangat peduli kebersihan mainan; fitur pencatatan jadwal pembersihan dan maintenance dapat menjadi nilai jual |
| **Pop-up Economy** | Bisnis pop-up semakin marak; fleksibilitas model ini adalah keunggulan tetapi juga membutuhkan tools manajemen yang mobile-first |

#### 3.1.3 Kompetitor

| Jenis Kompetitor | Contoh | Kekuatan | Kelemahan |
|---|---|---|---|
| **Kompetitor Langsung (rental mobil anak)** | Penyedia lokal independen, franchise kecil | Harga lebih murah, hubungan personal dengan komunitas lokal | Skala kecil, tidak terstandarisasi, tidak ada sistem digital |
| **Kompetitor Tidak Langsung (rekreasi anak)** | Playground dalam ruang (Kidzania, Amazone, Timezone) | Brand recognition kuat, lokasi permanen, fasilitas lengkap | Harga jauh lebih mahal (Rp50.000–Rp200.000/visit), lokasi terbatas |
| **Kompetitor Subtitusi (mainan rumahan)** | Mainan listrik pribadi, video game, tablet | Sekali beli, bisa dipakai kapan saja | Anak cepat bosan, tidak ada aspek sosial |
| **Kompetitor Alat (platform rental)** | Belum ada platform digital signifikan di segmen ini | — | — |

**Kesimpulan Kompetitif:** Pasar rental mobil-mobilan listrik anak di Indonesia belum memiliki pemain dominan dengan sistem digital terintegrasi. Bisnis ini memiliki **first-mover advantage** dalam standardisasi dan digitalisasi segmen ini. Barrier to entry cukup rendah untuk pemain lokal kecil, tetapi tinggi untuk mencapai skala nasional dengan sistem terintegrasi — dan itulah moat (keunggulan defensif) bisnis ini.

### 3.2 Regulasi Terkait

Lihat [Bagian 9 — Regulatory Compliance](#9-regulatory-compliance) untuk analisis lengkap.

---

## 4. Stakeholder Analysis

### 4.1 Matriks Stakeholder

| Stakeholder | Peran | Kebutuhan Utama | Pain Points Saat Ini | Tingkat Pengaruh | Tingkat Kepentingan |
|---|---|---|---|---|---|
| **Owner Cabang** | Memiliki hak operasional pada satu atau beberapa cabang/area; menyediakan unit dan modal kerja | Laporan pendapatan akurat, visibilitas utilisasi unit, kemudahan koordinasi dengan admin pusat | Tidak tahu unitnya di mana, berapa pendapatan real-time, sulit rekonsiliasi | Tinggi | Tinggi |
| **Operator Pop-Up** | Staf lapangan yang menjalankan event: setup booth, mencatat sewa, menangani pelanggan | Aplikasi pencatatan cepat dan sederhana, panduan operasional, pelaporan ringan | Pencatatan manual rentan error, tidak ada sistem standar, koordinasi event lambat | Sedang | Tinggi |
| **Admin Pusat** | Mengelola jadwal event, alokasi unit, kompilasi laporan, koordinasi 250 cabang | Dashboard terpusat, tools alokasi unit, laporan otomatis, komunikasi masal ke cabang | Laporan terlambat dan tidak seragam, koordinasi via WhatsApp tidak efisien, tidak ada overview real-time | Tinggi | Tinggi |
| **Orang Tua (Pelanggan)** | Konsumen akhir yang membayar sewa untuk anak mereka | Harga jelas, proses cepat, unit bersih dan aman, bukti pembayaran | Tidak terlibat langsung dengan sistem; hanya berinteraksi dengan operator | Rendah | Tinggi |
| **Anak-anak (Pengguna Akhir)** | Anak usia 2–10 tahun yang menaiki mobil mainan listrik | Mobil berfungsi baik, bervariasi, aman, menyenangkan | Tidak relevan sebagai user sistem | Rendah | Sedang |
| **Manajemen Pusat / Founder** | Pemilik bisnis secara keseluruhan | Gambaran bisnis 360°, data strategis untuk ekspansi, profitabilitas per wilayah | Tidak ada data agregat real-time; keputusan berbasis intuisi | Sangat Tinggi | Sangat Tinggi |
| **Teknisi Maintenance** | Memperbaiki dan merawat unit | Daftar unit bermasalah, jadwal maintenance rutin, riwayat perbaikan | Tidak ada sistem pelacakan maintenance; unit rusak tidak diketahui sampai event berikutnya | Rendah | Sedang |

### 4.2 User Personas Kunci

#### Persona 1: Ahmad — Operator Pop-Up

- **Usia:** 24 tahun, lulusan SMA/SMK
- **Lokasi:** Berpindah-pindah mengikuti event di kotanya
- **Tech-savviness:** Pengguna smartphone aktif (WhatsApp, TikTok, Instagram), terbiasa dengan aplikasi sederhana
- **Kebutuhan:** Aplikasi yang sangat simpel — buka, pilih unit, klik "Mulai Sewa" / "Selesai Sewa". Tidak mau ribet dengan menu kompleks.
- **Frustrasi:** Kalau aplikasi lambat atau error saat event ramai, dia akan kembali ke catatan kertas.

#### Persona 2: Bu Rina — Admin Pusat

- **Usia:** 32 tahun, lulusan D3/S1
- **Lokasi:** Kantor pusat (Jakarta)
- **Tech-savviness:** Mahir Excel, terbiasa dengan dashboard, mengelola banyak grup WhatsApp
- **Kebutuhan:** Dashboard yang menunjukkan semua event hari ini, status unit, alert jika ada masalah, laporan yang bisa di-export ke Excel.
- **Frustrasi:** Setiap malam harus menghubungi 50+ operator satu per satu untuk minta laporan; data sering beda-beda.

#### Persona 3: Pak Budi — Owner Cabang

- **Usia:** 40 tahun, pengusaha lokal
- **Lokasi:** Memiliki 5–10 cabang di satu provinsi
- **Tech-savviness:** Terbiasa dengan mobile banking dan aplikasi bisnis ringan
- **Kebutuhan:** Laporan pendapatan harian cabangnya, perbandingan performa antar cabang, notifikasi unit yang perlu perbaikan.
- **Frustrasi:** Harus menunggu seminggu untuk tahu performa cabangnya; uang setoran kadang tidak cocok dengan laporan.

---

## 5. Scope & Constraints

### 5.1 In-Scope (Ruang Lingkup)

#### Fase MVP (Minimum Viable Product — Bulan 1–6)

| Modul | Deskripsi |
|---|---|
| **Manajemen Unit** | Registrasi unit (ID unik, jenis, tahun, status), pencatatan lokasi terakhir, riwayat perpindahan antar cabang |
| **Manajemen Cabang & Event** | Data cabang (lokasi, kontak, owner), penjadwalan event pop-up, penugasan operator |
| **Sistem Sewa** | Operator mencatat transaksi: pilih unit → mulai sewa → selesai sewa → hitung otomatis biaya berdasarkan durasi dan tarif |
| **Autentikasi & Otorisasi** | Login (email/password), role-based access: Super Admin, Admin Pusat, Owner Cabang, Operator |
| **Laporan Dasar** | Laporan pendapatan harian/mingguan/bulanan per cabang, per event, dan per unit |
| **Dashboard Minimal** | Ringkasan: total unit, unit aktif, total pendapatan hari ini, event berjalan |

#### Fase Lanjutan (Bulan 7–12)

| Modul | Deskripsi |
|---|---|
| **Tracking & Maintenance** | Status maintenance unit, jadwal perbaikan, pencatatan riwayat servis, alert unit idle terlalu lama |
| **Dashboard Analytics** | Grafik tren pendapatan, heatmap utilisasi per wilayah, perbandingan performa cabang, leaderboard unit terproduktif |
| **Manajemen Pengguna** | CRUD pengguna dengan role management, audit log aktivitas pengguna |
| **Notifikasi** | Alert pendapatan rendah, unit rusak, event mendekati jadwal, via in-app dan WhatsApp (opsional) |
| **Ekspor Data** | Ekspor laporan ke PDF dan Excel; ekspor data mentah ke CSV |

#### Future (Beyond 12 Bulan)

| Modul | Deskripsi |
|---|---|
| **Integrasi Pembayaran Digital** | QRIS, GoPay, OVO — pencatatan pembayaran non-tunai |
| **Pelanggan & Loyalty** | Pencatatan pelanggan, riwayat sewa, program loyalitas sederhana |
| **Mobile App Native** | Aplikasi Android/iOS untuk operator (jika PWA tidak mencukupi) |
| **Prediksi & AI** | Rekomendasi alokasi unit berdasarkan data historis event, prediksi permintaan musiman |
| **Multi-language** | Bahasa Indonesia + Inggris (untuk event di area turis) |

### 5.2 Out-of-Scope (Di Luar Ruang Lingkup)

- Pembayaran digital real-time (payment gateway) — ditunda ke Fase Future; saat ini fokus pada pencatatan transaksi tunai
- Aplikasi mobile native terpisah — MVP menggunakan PWA yang dapat diakses via browser smartphone
- Sistem IoT / GPS tracking fisik pada unit — pelacakan dilakukan secara administratif (operator mencatat lokasi unit)
- Integrasi dengan ERP atau sistem akuntansi eksternal (misal: SAP, Accurate) — ditunda ke Fase Future
- Aplikasi customer-facing untuk orang tua (booking online, dll) — di luar scope proyek ini
- Sistem inventori untuk suku cadang dan spare parts

### 5.3 Constraints (Batasan)

| Jenis Batasan | Deskripsi | Mitigasi |
|---|---|---|
| **Anggaran** | Tidak disebutkan secara spesifik; asumsi: budget terbatas untuk tim kecil (1–3 developer) | Arsitektur sederhana; leverage Nuxt fullstack untuk meminimalkan jumlah layanan terpisah; Cloudflare VPS single-instance |
| **Waktu** | Target MVP 6 bulan | Fokus pada fitur paling esensial; rilis bertahap; tidak ada gold-plating |
| **Teknologi** | Nuxt 4 + Nuxt UI 4; hosting Cloudflare VPS | Tim harus menguasai Nuxt 4 ecosystem; dokumentasi Nuxt 4 masih berkembang (perhatikan breaking changes dari Nuxt 3) |
| **Konektivitas Operator** | Operator di lapangan mungkin memiliki koneksi internet tidak stabil | PWA dengan offline capability dasar (cache laporan, sinkronisasi saat online kembali) — jika memungkinkan dalam timeline MVP |
| **Adopsi Pengguna** | Operator dengan literasi digital rendah mungkin resisten terhadap sistem baru | UI sesederhana mungkin; pelatihan singkat; masa transisi (sistem digital dan manual berjalan paralel 1–2 bulan) |
| **Data Migration** | Data historis mungkin tersebar di spreadsheet dan catatan tidak terstruktur | Tidak melakukan migrasi data historis — sistem mulai dari data baru; data lama diarsipkan sebagai referensi |

---

## 6. Success Metrics (KPI)

### 6.1 KPI Bisnis

| KPI | Baseline (Estimasi) | Target (12 Bulan) | Metode Pengukuran |
|---|---|---|---|
| **Total Pendapatan Bulanan** | Data tidak tersedia (dicatat manual) | Tercatat 100% dalam sistem; peningkatan 15% YoY | Agregasi laporan pendapatan sistem |
| **Utilisasi Unit Rata-Rata** | Estimasi 40% (berdasarkan laporan informal) | 65% unit aktif per hari operasional | Sistem: jumlah unit disewa / total unit tersedia per hari |
| **Jumlah Event/Bulan** | Data tidak tersedia | Tercatat 100% dalam sistem | Jumlah event dengan transaksi > 0 |
| **Waktu Rekonsiliasi Bulanan** | ~5 hari kerja | < 1 hari kerja | Self-reported oleh admin pusat |
| **Selisih Setoran vs Laporan** | Estimasi 5–10% | < 1% | Perbandingan laporan sistem vs setoran tunai |

### 6.2 KPI Teknis

| KPI | Target | Metode Pengukuran |
|---|---|---|
| **System Uptime** | 99,5% (di luar maintenance window) | Monitoring Cloudflare / UptimeRobot |
| **API Response Time (p95)** | < 500ms | Nuxt server timing + eksternal monitoring |
| **Page Load Time (p95)** | < 3 detik pada koneksi 4G | Lighthouse / Web Vitals |
| **Error Rate** | < 0,5% dari total request | Logging dan monitoring |
| **Zero Data Loss** | Tidak ada transaksi sewa yang hilang dari sistem | Audit log dan rekonsiliasi harian |

### 6.3 KPI Adopsi

| KPI | Target (3 Bulan) | Target (12 Bulan) |
|---|---|---|
| **Cabang Aktif di Sistem** | 50 cabang (20%) | 250 cabang (100%) |
| **Transaksi Bulanan via Sistem** | 10.000 transaksi | 50.000+ transaksi |
| **Operator Login Harian** | 70% dari operator yang bertugas | 95% |
| **Tiket Support/Bulan** | < 50 (sebagai indikator masalah) | < 20 |

---

## 7. Risk Assessment

### 7.1 Matriks Risiko

Skala: **1 (Rendah) — 5 (Sangat Tinggi)**

| ID | Risiko | Probabilitas | Dampak | Skor Risiko (P×D) | Kategori | Strategi Mitigasi |
|---|---|---|---|---|---|---|
| R01 | Operator menolak menggunakan sistem baru, kembali ke pencatatan manual | 4 | 4 | 16 | Adopsi | Masa transisi dengan sistem paralel; pelatihan rutin; insentif bagi operator yang konsisten menggunakan sistem; UI sangat sederhana |
| R02 | Koneksi internet operator tidak stabil, transaksi gagal tercatat | 4 | 4 | 16 | Teknis | PWA offline-capable; local storage sebagai backup; sinkronisasi otomatis saat online; konfirmasi double-check sebelum finalisasi transaksi |
| R03 | Server down saat peak event (Sabtu-Minggu) | 2 | 5 | 10 | Infrastruktur | Auto-scaling di Cloudflare (jika memungkinkan); monitoring 24/7; backup server; load testing sebelum go-live |
| R04 | Data tidak akurat karena kesalahan input operator | 3 | 3 | 9 | Data | Validasi input; field wajib; konfirmasi sebelum submit; audit trail; training |
| R05 | Keamanan data — akses tidak sah ke data keuangan cabang | 2 | 5 | 10 | Keamanan | Role-based access control; HTTPS; input sanitization; rate limiting; security audit sebelum go-live |
| R06 | Scope creep — fitur terus ditambah sehingga MVP tertunda | 3 | 4 | 12 | Proyek | Prioritasi ketat; MoSCoW framework; Product Owner tunggal sebagai gatekeeper scope |
| R07 | Ketergantungan pada tim developer kunci (bus factor) | 3 | 4 | 12 | SDM | Dokumentasi teknis lengkap; code review; knowledge sharing; minimal 2 developer |
| R08 | Perubahan regulasi mendadak terkait mainan anak atau event publik | 2 | 4 | 8 | Regulasi | Monitoring regulasi berkala; konsultasi hukum; desain sistem yang fleksibel untuk menambah field compliance |
| R09 | Data loss akibat kegagalan hardware/server | 1 | 5 | 5 | Infrastruktur | Backup harian otomatis; backup ke lokasi berbeda (Cloudflare R2/Object Storage); disaster recovery plan |
| R10 | Performa lambat saat 250 cabang aktif bersamaan | 2 | 4 | 8 | Teknis | Query optimization; Redis caching; database indexing; pagination; load testing bertahap |
| R11 | Biaya operasional Cloudflare VPS membengkak | 3 | 2 | 6 | Finansial | Monitoring penggunaan resource; pilih paket yang sesuai; optimasi query dan caching untuk mengurangi beban server |
| R12 | Persaingan — pemain baru dengan produk digital serupa | 3 | 3 | 9 | Bisnis | First-mover advantage; continuous improvement; fitur yang sulit ditiru (data analytics, network effect) |

### 7.2 Peta Risiko (Risk Map)

```
Dampak ↑
  5  |  R09          |  R03, R05     |
     |               |               |
  4  |  R06, R07     |  R01, R02     |
     |               |               |
  3  |  R12          |  R04          |
     |               |               |
  2  |               |  R11          |
     |               |               |
  1  |               |               |
     +---------------+------------------→ Probabilitas
        1–2              3–4–5
```

- **Kuadran Kritis (P≥3, D≥4):** R01, R02, R03, R05 — Harus dimitigasi sebelum go-live
- **Kuadran Waspada (P≥3, D≤3 atau P≤2, D≥4):** R04, R06, R07, R08, R12 — Mitigasi bertahap
- **Kuadran Monitor:** R09, R10, R11 — Monitoring berkala

---

## 8. Cost-Benefit Analysis

### 8.1 Estimasi Biaya (12 Bulan Pertama)

#### Biaya Pengembangan

| Komponen | Estimasi Biaya (IDR) |
|---|---|
| Tim Developer (2 orang × 12 bulan) | Rp 240.000.000 |
| UI/UX Designer (freelance, 2 bulan) | Rp 30.000.000 |
| Business Analyst / Project Manager (part-time) | Rp 60.000.000 |
| QA & Testing | Rp 24.000.000 |
| **Subtotal Pengembangan** | **Rp 354.000.000** |

#### Biaya Infrastruktur (Tahunan)

| Komponen | Estimasi Biaya (IDR) |
|---|---|
| Cloudflare VPS (4 vCPU, 8GB RAM) | Rp 14.400.000 |
| Cloudflare CDN & DNS | Rp 0 (Free tier cukup) |
| Database hosting (managed PostgreSQL) | Rp 9.600.000 |
| Redis (managed) | Rp 4.800.000 |
| Domain + SSL | Rp 1.200.000 |
| Monitoring tools (Sentry, UptimeRobot) | Rp 3.600.000 |
| **Subtotal Infrastruktur** | **Rp 33.600.000** |

#### Biaya Operasional

| Komponen | Estimasi Biaya (IDR) |
|---|---|
| Pelatihan operator (roadshow 5 kota besar) | Rp 25.000.000 |
| Support & maintenance (6 bulan setelah go-live) | Rp 60.000.000 |
| Dokumentasi & materi pelatihan | Rp 10.000.000 |
| **Subtotal Operasional** | **Rp 95.000.000** |

#### Total Estimasi Biaya 12 Bulan: **Rp 482.600.000**

### 8.2 Estimasi Manfaat (Kuantitatif)

| Manfaat | Estimasi Dampak (Tahunan) |
|---|---|
| **Peningkatan pendapatan** dari utilisasi lebih tinggi (25% peningkatan dari baseline 40% → 65%) pada 40.000 unit, asumsi Rp100.000/hari/unit pada utilisasi 40%, meningkat ke Rp162.500/hari/unit pada utilisasi 65%. Tambahan: 40.000 × Rp62.500 × 100 hari event/tahun | Rp 250.000.000.000 |
| **Pengurangan kebocoran pendapatan** (selisih setoran dari 7,5% → <1%) pada pendapatan estimasi Rp 1 triliun/tahun | Rp 65.000.000.000 |
| **Efisiensi admin pusat** (60% waktu kembali ke tugas strategis) | Rp 120.000.000 |
| **Pengurangan biaya koordinasi** (pulsa, transportasi koordinasi) | Rp 36.000.000 |
| **Pengurangan unit hilang/tidak terlacak** (estimasi 0,5% × 40.000 unit × Rp 1.500.000/unit) | Rp 300.000.000 |

> **Catatan:** Angka pendapatan di atas adalah estimasi untuk keseluruhan bisnis, bukan hanya dampak sistem. Dampak langsung sistem adalah persentase peningkatan dari baseline, bukan nilai absolutnya.

### 8.3 Estimasi Manfaat (Kualitatif)

- **Pengambilan keputusan berbasis data** — Manajemen dapat melihat tren dan mengambil keputusan strategis dengan data real-time, bukan intuisi
- **Standardisasi proses** — Seluruh cabang menggunakan SOP digital yang sama; kualitas layanan konsisten di seluruh Indonesia
- **Keunggulan kompetitif** — Sebagai pemain pertama dengan sistem digital terintegrasi di segmen ini
- **Kepercayaan owner cabang** — Transparansi data meningkatkan kepercayaan dan loyalitas mitra cabang
- **Skalabilitas** — Sistem yang solid memungkinkan ekspansi ke 500+ cabang tanpa penambahan proporsional tim admin pusat
- **Reputasi brand** — Citra modern dan profesional di mata pelanggan dan mitra event (mal, penyelenggara CFD)

### 8.4 ROI dan Payback Period

- **Total investasi 12 bulan:** Rp 482.600.000
- **Estimasi dampak kuantitatif minimum (konservatif, 5% dari total potensi):** Rp 750.000.000/tahun
- **ROI:** ~55% di tahun pertama
- **Payback period:** < 12 bulan (berdasarkan dampak langsung efisiensi dan pengurangan kebocoran)

---

## 9. Regulatory Compliance

### 9.1 Regulasi Terkait di Indonesia

#### 9.1.1 Perizinan Usaha

| Regulasi | Deskripsi | Relevansi | Status Kepatuhan |
|---|---|---|---|
| **NIB (Nomor Induk Berusaha)** | Izin usaha wajib melalui OSS (Online Single Submission) | Seluruh cabang dan entitas bisnis wajib memiliki NIB | Harus diverifikasi untuk setiap entitas operasional |
| **SIUP (Surat Izin Usaha Perdagangan)** — kini terintegrasi dalam NIB | Izin untuk kegiatan usaha perdagangan | Rental mainan termasuk dalam kategori perdagangan jasa | Tercakup dalam NIB |
| **TDP (Tanda Daftar Perusahaan)** — kini terintegrasi dalam NIB | Pendaftaran perusahaan | Wajib untuk semua perusahaan | Tercakup dalam NIB |

#### 9.1.2 Keamanan Produk Mainan Anak

| Regulasi | Deskripsi | Relevansi | Kewajiban |
|---|---|---|---|
| **SNI (Standar Nasional Indonesia) untuk Mainan** | SNI ISO 8124 — standar keamanan mainan anak (tidak boleh ada ujung tajam, cat beracun, komponen mudah lepas yang bisa tertelan) | Semua unit mobil mainan listrik harus memenuhi SNI | Sertifikasi SNI untuk setiap jenis/model unit |
| **Permendag No. 24/2021** | Peraturan Menteri Perdagangan tentang pengawasan barang beredar dan jasa — termasuk mainan anak | Mewajibkan importir dan distributor mainan untuk memastikan keamanan produk | Sertifikasi produk, label peringatan dalam Bahasa Indonesia |
| **UU No. 8/1999 tentang Perlindungan Konsumen** | Hak konsumen atas keamanan dan keselamatan; kewajiban pelaku usaha memberikan informasi benar | Setiap unit rental harus aman digunakan; informasi kondisi unit harus jelas ke orang tua | Pencatatan kondisi unit sebelum disewakan; maintenance rutin terdokumentasi |
| **UU No. 35/2014 tentang Perlindungan Anak** | Perlindungan anak dari eksploitasi ekonomi dan memastikan kesejahteraan anak | Usia minimal pengguna, pengawasan orang tua, keamanan area bermain | SOP operasional: batas usia, wajib pendampingan orang tua, area bermain berpagar |

#### 9.1.3 Operasional Event Pop-Up

| Regulasi | Deskripsi | Relevansi | Kewajiban |
|---|---|---|---|
| **Izin Keramaian / Izin Event** | Setiap event pop-up di ruang publik memerlukan izin dari pemerintah daerah setempat (Satpol PP, Dinas Pariwisata, atau pengelola lokasi) | Setiap event adalah operasional temporer di ruang publik/komersial | Admin pusat/pemilik cabang harus mengurus izin per event; sistem dapat mencatat status perizinan |
| **Perda setempat** | Peraturan daerah tentang penggunaan ruang publik, jam operasional, kebisingan | Bervariasi per kota/kabupaten | Sistem harus mampu mencatat persyaratan spesifik per lokasi |
| **SOP Keamanan Event** | Kewajiban menyediakan area bermain yang aman, pagar pembatas, pengawas, P3K | Keselamatan anak adalah prioritas utama; insiden dapat berakibat hukum serius | Fitur checklist keamanan event (dapat menjadi bagian dari aplikasi) |

#### 9.1.4 Ketenagakerjaan

| Regulasi | Deskripsi | Relevansi |
|---|---|---|
| **UU No. 13/2003 tentang Ketenagakerjaan** | Hak dan kewajiban pekerja | Status operator pop-up (freelance/harian/tetap) harus jelas dan sesuai regulasi |
| **BPJS Ketenagakerjaan & BPJS Kesehatan** | Jaminan sosial wajib | Meskipun pekerja lepas, kepesertaan BPJS perlu ditinjau sesuai regulasi terbaru |

#### 9.1.5 Perlindungan Data Pribadi

| Regulasi | Deskripsi | Relevansi | Kewajiban |
|---|---|---|---|
| **UU No. 27/2022 tentang Perlindungan Data Pribadi (PDP)** | Mengatur pengumpulan, penyimpanan, dan pemrosesan data pribadi | Data pelanggan (jika di masa depan sistem mencatat data orang tua), data operator, data owner cabang | Enkripsi data; akses terbatas; persetujuan (consent); hak akses dan penghapusan data |
| **POJK / Regulasi OJK** (jika menangani pembayaran digital di masa depan) | Regulasi untuk sistem pembayaran | Hanya relevan jika payment gateway terintegrasi | Tidak berlaku untuk fase MVP (transaksi tunai) |

### 9.2 Implikasi untuk Aplikasi

Fitur-fitur dalam aplikasi yang mendukung kepatuhan regulasi:

| Fitur Aplikasi | Regulasi Terkait |
|---|---|
| Pencatatan status dan kondisi unit sebelum disewakan | UU Perlindungan Konsumen, SNI Mainan |
| Checklist keamanan event (pagar, P3K, pengawas) | SOP Keamanan, UU Perlindungan Anak |
| Jadwal maintenance rutin terdokumentasi | SNI Mainan, UU Perlindungan Konsumen |
| Pencatatan izin event (nomor izin, tanggal berlaku) | Izin Keramaian, Perda |
| Role-based access control — akses data dibatasi per role | UU PDP |
| Enkripsi data dan HTTPS | UU PDP |
| Audit log — mencatat siapa mengakses/mengubah data apa | UU PDP |
| Field batas usia pengguna dan konfirmasi pendampingan orang tua | UU Perlindungan Anak |

### 9.3 Rekomendasi

1. **Konsultasi hukum** dengan praktisi yang memahami regulasi mainan anak dan event di Indonesia sebelum go-live
2. **Sertifikasi SNI** untuk semua model unit yang beroperasi — jika belum dilakukan, prioritaskan
3. **Template SOP** untuk operator yang mencakup aspek keamanan, kebersihan, dan kepatuhan — aplikasi dapat mendigitalisasi checklist ini
4. **Asuransi** — pertimbangkan asuransi tanggung gugat (liability insurance) untuk setiap event sebagai mitigasi risiko insiden
5. **Privacy by Design** — sejak Fase 1, desain sistem dengan prinsip minimalisasi data pribadi dan keamanan data

---

## 10. Lampiran

### 10.1 Daftar Singkatan

| Singkatan | Kepanjangan |
|---|---|
| BRD | Business Requirements Document |
| KPI | Key Performance Indicator |
| MVP | Minimum Viable Product |
| PWA | Progressive Web Application |
| RBAC | Role-Based Access Control |
| SNI | Standar Nasional Indonesia |
| OSS | Online Single Submission |
| NIB | Nomor Induk Berusaha |
| PDP | Perlindungan Data Pribadi |
| CFD | Car Free Day |
| QRIS | Quick Response Code Indonesian Standard |
| YoY | Year-over-Year |
| SOP | Standard Operating Procedure |
| VPS | Virtual Private Server |
| CI/CD | Continuous Integration / Continuous Deployment |

### 10.2 Dokumen Terkait

| Dokumen | Lokasi | Keterangan |
|---|---|---|
| Development Roadmap | `internal/docs/roadmap.md` | Rencana pengembangan multi-fase |
| Dokumen Desain Sistem | TBD | Akan dibuat pada Fase 1 (Foundation) |
| Dokumen API Specification | TBD | Akan dibuat pada Fase 2 (Core Features) |
| Dokumen Pengujian (Test Plan) | TBD | Akan dibuat sebelum go-live |

### 10.3 Riwayat Perubahan

| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 7 Juni 2026 | Dokumen awal BRD | Business Analyst |

---

*Dokumen ini bersifat konfidensial dan hanya untuk penggunaan internal. Setiap distribusi ke pihak eksternal memerlukan persetujuan manajemen.*
