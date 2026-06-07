# Product Requirements Document (PRD)
## Sistem Tracking & Manajemen Rental Mobil Anak

---

**Dokumen:** PRD-001  
**Versi:** 1.0  
**Tanggal:** 7 Juni 2026  
**Penulis:** Product Team  
**Status:** Draft Final

---

## Daftar Isi

1. [Product Vision & Strategy](#1-product-vision--strategy)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [User Personas](#4-user-personas)
5. [Core Features (MoSCoW)](#5-core-features-moscow)
6. [User Stories](#6-user-stories)
7. [Acceptance Criteria](#7-acceptance-criteria)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Success Metrics & KPIs](#9-success-metrics--kpis)
10. [Release Plan](#10-release-plan)
11. [Dependencies & Assumptions](#11-dependencies--assumptions)

---

## 1. Product Vision & Strategy

### Vision Statement

> Menjadi platform manajemen rental mobil mainan listrik nomor satu di Indonesia yang menghubungkan orang tua dan anak dengan pengalaman bermain yang aman, menyenangkan, dan tanpa hambatan — didukung oleh teknologi pelacakan dan operasional real-time di 250+ titik layanan.

### Product Strategy

| Pilar | Strategi |
|-------|----------|
| **Jangkauan** | Memperluas dari 250 cabang tetap ke 500+ titik layanan termasuk pop-up store dalam 2 tahun |
| **Operasional** | Digitalisasi penuh proses sewa, pelacakan unit, dan pelaporan untuk eliminasi pencatatan manual |
| **Pengalaman** | Transaksi sewa di bawah 10 detik melalui mobile-friendly interface dan pembayaran QRIS/GoPay |
| **Data-Driven** | Dashboard real-time dan analytics untuk keputusan bisnis berbasis data utilisasi dan profitabilitas |
| **Keamanan** | Pelacakan GPS/RFID untuk mencegah kehilangan unit dan pemantauan baterai/maintenance prediktif |

### Unique Value Proposition

- **Kecepatan Transaksi**: Sewa + pembayaran selesai dalam < 30 detik
- **Visibilitas Penuh**: 40.000 unit terlacak real-time di satu dashboard
- **Fleksibilitas Lokasi**: Sistem yang sama untuk cabang tetap dan pop-up store event
- **Notifikasi Proaktif**: Pengingat waktu sewa via WhatsApp sehingga orang tua tidak perlu mengawasi jam

---

## 2. Problem Statement

### Situasi Saat Ini

Rental mobil mainan listrik saat ini mengoperasikan 250 cabang dengan total 40.000 unit di seluruh Indonesia, namun menghadapi tantangan operasional signifikan:

1. **Ketidakmampuan Melacak Aset Secara Real-Time**
   - Tidak diketahui posisi pasti unit di setiap cabang
   - Unit hilang atau dipindahtangankan antar cabang tanpa pencatatan
   - Rata-rata 2-3% unit hilang per tahun (~1.200 unit)

2. **Proses Sewa Manual yang Lambat**
   - Pencatatan manual di kertas atau spreadsheet
   - Kalkulasi biaya dan kembalian memakan waktu 2-3 menit per transaksi
   - Antrean panjang di jam sibuk (weekend, libur sekolah)

3. **Manajemen Multi-Cabang Tidak Terpusat**
   - Kantor pusat tidak dapat melihat performa 250 cabang secara real-time
   - Laporan pendapatan dan utilisasi baru tersedia akhir bulan
   - Keputusan alokasi unit dilakukan tanpa data akurat

4. **Operasi Pop-Up Store Tanpa Sistem**
   - Registrasi event dan mobilisasi unit dilakukan manual via WhatsApp/telepon
   - Tidak ada pencatatan pendapatan pop-up yang terintegrasi dengan sistem utama
   - Kesulitan tracking unit setelah event selesai

5. **Customer Experience Kurang Optimal**
   - Orang tua tidak mendapat notifikasi saat waktu sewa hampir habis
   - Tidak ada riwayat sewa atau program loyalitas
   - Tidak ada kemudahan pembayaran digital

---

## 3. Target Users

| # | Pengguna | Deskripsi | Prioritas |
|---|----------|-----------|-----------|
| 1 | **Admin Pusat** | Tim manajemen di kantor pusat yang mengawasi seluruh operasi 250 cabang, 40.000 unit, dan performa bisnis secara keseluruhan | P0 |
| 2 | **Manajer Cabang** | Penanggung jawab operasional di setiap cabang yang mengelola unit, operator, dan transaksi harian | P0 |
| 3 | **Operator Cabang/Pop-up** | Staf lapangan yang menangani proses sewa, pembayaran, dan serah-terima unit kepada pelanggan | P0 |
| 4 | **Orang Tua (Customer)** | Pelanggan akhir yang menyewakan mobil mainan untuk anak mereka | P1 |
| 5 | **Teknisi Maintenance** | Tim yang bertanggung jawab atas perbaikan dan perawatan unit | P2 |

---

## 4. User Personas

### Persona 1: Bu Rina — Admin Pusat

| Atribut | Detail |
|---------|--------|
| **Usia** | 38 tahun |
| **Pekerjaan** | Head of Operations |
| **Lokasi** | Kantor Pusat, Jakarta |
| **Tech Savviness** | Menengah-Tinggi |

**JTBD (Jobs to Be Done):**
1. Ketika saya ingin memantau performa seluruh cabang, saya butuh dashboard real-time yang menampilkan pendapatan, utilisasi unit, dan status operasional, agar saya bisa mengambil keputusan cepat tanpa menunggu laporan akhir bulan.
2. Ketika ada cabang yang performanya menurun, saya butuh notifikasi dan drill-down analytics, agar saya bisa segera melakukan intervensi.
3. Ketika ada unit yang tidak bergerak atau hilang, saya butuh sistem pelacakan yang memberi alert otomatis, agar kerugian aset bisa diminimalkan.

**Pain Points:**
- Laporan bulanan selalu terlambat 2-3 minggu
- Tidak bisa melihat apakah cabang buka/tutup tepat waktu
- Sulit mengalokasikan unit baru tanpa data utilisasi akurat

---

### Persona 2: Pak Dodi — Manajer Cabang

| Atribut | Detail |
|---------|--------|
| **Usia** | 32 tahun |
| **Pekerjaan** | Manajer Cabang Bandung |
| **Lokasi** | Cabang Bandung |
| **Tech Savviness** | Menengah |

**JTBD (Jobs to Be Done):**
1. Ketika akhir hari tiba, saya butuh laporan otomatis transaksi dan uang masuk, agar saya tidak perlu rekonsiliasi manual yang rawan kesalahan.
2. Ketika ada unit rusak, saya butuh sistem pelaporan maintenance yang langsung terhubung ke teknisi pusat, agar unit cepat kembali beroperasi.
3. Ketika jam sibuk weekend, saya butuh sistem sewa yang cepat dan antrean pendek, agar customer tidak kabur karena menunggu.

**Pain Points:**
- Setiap hari menghabiskan 30-45 menit untuk hitung manual uang masuk
- Sering kehabisan unit di jam sibuk tanpa peringatan stok
- Tidak tahu unit mana yang perlu maintenance sampai rusak total

---

### Persona 3: Mbak Sari — Operator Lapangan

| Atribut | Detail |
|---------|--------|
| **Usia** | 23 tahun |
| **Pekerjaan** | Operator Cabang & Pop-up Store |
| **Lokasi** | Mobile (Cabang tetap & event) |
| **Tech Savviness** | Menengah (nyaman dengan smartphone) |

**JTBD (Jobs to Be Done):**
1. Ketika customer datang, saya butuh proses sewa yang cukup buka HP — scan QR unit, pilih durasi, terima pembayaran — agar transaksi selesai < 30 detik.
2. Ketika bertugas di pop-up store event, saya butuh aplikasi yang tetap berfungsi dengan koneksi internet tidak stabil, agar transaksi tidak terhenti.
3. Ketika waktu sewa customer habis, saya butuh notifikasi otomatis sehingga saya bisa mendekati customer, agar unit bisa segera disewakan lagi.

**Pain Points:**
- Harus bawa buku catatan dan kalkulator, rentan salah hitung
- Di pop-up store, koneksi jelek bikin tidak bisa transaksi
- Customer komplain karena tidak diingatkan waktu habis

---

### Persona 4: Bu Dewi — Orang Tua (Customer)

| Atribut | Detail |
|---------|--------|
| **Usia** | 31 tahun |
| **Pekerjaan** | Ibu Rumah Tangga / Profesional |
| **Lokasi** | Urban (Jakarta, Surabaya, Bandung, dll) |
| **Tech Savviness** | Menengah-Tinggi |

**JTBD (Jobs to Be Done):**
1. Ketika mengajak anak ke mal/car free day, saya butuh proses sewa mobil mainan yang cepat tanpa antre, agar anak tidak rewel menunggu terlalu lama.
2. Ketika waktu sewa hampir habis, saya butuh notifikasi di WhatsApp, agar saya bisa memutuskan memperpanjang atau mengembalikan tepat waktu tanpa biaya tambahan.
3. Ketika saya sering menyewa, saya butuh riwayat dan mungkin diskon loyalitas, agar saya merasa dihargai sebagai pelanggan tetap.

**Pain Points:**
- Antrean panjang membuat anak bosan dan mengamuk
- Lupa waktu sewa, kena denda keterlambatan
- Pembayaran hanya tunai, tidak praktis

---

## 5. Core Features (MoSCoW)

### M — Must Have (MVP)

| ID | Fitur | Deskripsi |
|----|-------|-----------|
| F01 | **Dashboard Real-Time Tracking** | Peta interaktif menampilkan seluruh 250 cabang dan status ringkasan 40.000 unit (aktif/sewa/maintenance/offline) |
| F02 | **Manajemen Cabang (CRUD)** | Kelola 250 cabang: profil, jam operasional, kapasitas unit, status buka/tutup |
| F03 | **Manajemen Unit (CRUD)** | Kelola 40.000 unit: registrasi, status, lokasi terkini, riwayat maintenance, penugasan ke cabang |
| F04 | **Sistem Sewa Cepat** | Transaksi sewa: pilih unit → atur durasi (15/30/45 menit) → hitung biaya → pembayaran. Target: < 30 detik per transaksi |
| F05 | **Sistem Pembayaran** | Integrasi QRIS, GoPay, dan tunai. Kalkulasi otomatis berdasarkan durasi + denda keterlambatan |
| F06 | **Pelacakan Unit (GPS/RFID)** | Tracking posisi real-time setiap unit, history pergerakan, alert jika unit keluar zona geofencing |
| F07 | **Laporan Harian & Bulanan** | Laporan pendapatan per cabang, utilisasi unit, transaksi harian, ringkasan untuk Admin Pusat |
| F08 | **Autentikasi & RBAC** | Login dengan role: Super Admin, Admin Cabang, Operator, Customer. Hak akses sesuai role |

### S — Should Have (v1)

| ID | Fitur | Deskripsi |
|----|-------|-----------|
| F09 | **Manajemen Pop-Up Store** | Registrasi event, alokasi unit ke event, tracking setup/teardown, laporan pendapatan event |
| F10 | **Notifikasi WhatsApp/Email** | Pengingat waktu sewa habis, notifikasi maintenance, alert unit di luar zona, laporan ringkas ke Admin Pusat |
| F11 | **Dashboard Analytics** | Visualisasi tren pendapatan, utilisasi mingguan/bulanan, heatmap jam sibuk, perbandingan performa cabang |
| F12 | **Mobile-Friendly Interface** | UI responsif optimal di smartphone untuk Operator dan Manajer di lapangan |
| F13 | **Manajemen Maintenance** | Jadwal maintenance prediktif, log perbaikan, status unit, notifikasi ke teknisi |
| F14 | **Riwayat Pelanggan** | Database pelanggan, riwayat sewa, preferensi unit, data untuk program loyalitas |

### C — Could Have (v2)

| ID | Fitur | Deskripsi |
|----|-------|-----------|
| F15 | **Program Loyalitas** | Poin, diskon, dan reward untuk pelanggan setia berdasarkan frekuensi sewa |
| F16 | **Self-Service Kiosk** | Customer bisa menyewa sendiri via tablet/kiosk di cabang tanpa bantuan operator |
| F17 | **Prediksi Demand** | ML-based forecasting untuk alokasi unit optimal per cabang berdasarkan data historis dan event |
| F18 | **Integrasi Marketplace** | Sewa unit bisa dipesan via aplikasi pihak ketiga (Traveloka, Tokopedia) |
| F19 | **Mode Offline** | Aplikasi tetap bisa transaksi saat koneksi internet putus; sinkronisasi data saat online kembali |

### W — Won't Have (Saat Ini)

| ID | Fitur | Alasan |
|----|-------|--------|
| W01 | Aplikasi mobile native iOS/Android | Cukup PWA + responsive web untuk efisiensi development; native apps dipertimbangkan setelah v2 |
| W02 | IoT battery monitoring real-time | Unit belum dilengkapi modul IoT; menunggu upgrade hardware unit |
| W03 | Integrasi CCTV per cabang | Di luar scope; bisa jadi proyek terpisah |

---

## 6. User Stories

### Dashboard & Tracking

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-01 | Sebagai **Admin Pusat**, saya ingin melihat dashboard dengan peta seluruh cabang dan jumlah unit aktif, agar saya bisa memonitor operasi nasional dalam satu layar. | P0 |
| US-02 | Sebagai **Admin Pusat**, saya ingin melihat status setiap unit (tersedia/ disewa/ maintenance/ offline), agar saya bisa mengidentifikasi masalah dengan cepat. | P0 |
| US-03 | Sebagai **Manajer Cabang**, saya ingin dashboard khusus cabang saya yang menampilkan pendapatan hari ini dan unit tersedia, agar saya bisa memantau performa cabang secara mandiri. | P0 |
| US-04 | Sebagai **Admin Pusat**, saya ingin filter dan search unit berdasarkan status, cabang, atau tipe unit, agar saya bisa menemukan informasi spesifik dengan cepat. | P1 |

### Manajemen Unit

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-05 | Sebagai **Admin Pusat**, saya ingin menambahkan unit baru ke sistem (nomor seri, tipe, warna), agar setiap unit tercatat dalam inventaris digital. | P0 |
| US-06 | Sebagai **Manajer Cabang**, saya ingin memindahkan unit dari cabang saya ke cabang lain, agar redistribusi unit tercatat dan terlacak. | P0 |
| US-07 | Sebagai **Teknisi**, saya ingin mencatat riwayat maintenance setiap unit, agar ada dokumentasi perbaikan dan jadwal servis berkala. | P1 |
| US-08 | Sebagai **Admin Pusat**, saya ingin menerima alert jika unit tidak bergerak > 7 hari atau hilang dari jaringan, agar saya bisa investigasi segera. | P1 |

### Manajemen Cabang

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-09 | Sebagai **Admin Pusat**, saya ingin mendaftarkan cabang baru dengan alamat, jam operasional, dan kapasitas unit, agar ekspansi bisnis tercatat sistematis. | P0 |
| US-10 | Sebagai **Manajer Cabang**, saya ingin update status buka/tutup cabang harian, agar Admin Pusat tahu cabang beroperasi. | P0 |
| US-11 | Sebagai **Admin Pusat**, saya ingin melihat performa setiap cabang (pendapatan, utilisasi, rating), agar saya bisa evaluasi dan beri insentif. | P1 |

### Sewa & Pembayaran

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-12 | Sebagai **Operator**, saya ingin memproses sewa dalam < 30 detik — pilih unit, pilih durasi, terima pembayaran — agar antrean pelanggan bergerak cepat. | P0 |
| US-13 | Sebagai **Operator**, saya ingin sistem otomatis menghitung biaya sewa dan denda keterlambatan, agar tidak ada kesalahan hitung manual. | P0 |
| US-14 | Sebagai **Operator**, saya ingin menerima pembayaran via QRIS, GoPay, dan tunai, agar pelanggan punya banyak opsi. | P0 |
| US-15 | Sebagai **Customer**, saya ingin struk digital dikirim ke WhatsApp setelah bayar, agar saya punya bukti pembayaran. | P1 |
| US-16 | Sebagai **Operator**, saya ingin memperpanjang sewa tanpa mencatat transaksi baru, agar customer yang ingin lanjut tidak perlu antre ulang. | P1 |

### Tracking GPS/RFID

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-17 | Sebagai **Admin Pusat**, saya ingin melihat lokasi real-time setiap unit di peta, agar saya bisa mengetahui posisi seluruh 40.000 unit kapan saja. | P0 |
| US-18 | Sebagai **Admin Pusat**, saya ingin membuat geofence per cabang dan mendapat alert jika unit keluar zona, agar potensi kehilangan bisa dicegah. | P0 |
| US-19 | Sebagai **Manajer Cabang**, saya ingin melihat history pergerakan unit dalam 7 hari terakhir, agar saya bisa audit jika ada kejanggalan. | P1 |
| US-20 | Sebagai **Admin Pusat**, saya ingin heatmap pergerakan unit untuk analisis utilisasi area, agar penempatan pop-up store lebih strategis. | P2 |

### Pop-Up Store

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-21 | Sebagai **Admin Pusat**, saya ingin mendaftarkan event pop-up (lokasi, tanggal, jam), dan mengalokasikan unit dari pool pusat, agar persiapan event terencana. | P1 |
| US-22 | Sebagai **Operator Pop-up**, saya ingin check-in di lokasi event dan mulai transaksi dengan sistem yang sama seperti cabang tetap, agar tidak perlu belajar sistem baru. | P1 |
| US-23 | Sebagai **Admin Pusat**, saya ingin laporan pendapatan terpisah per event pop-up, agar saya bisa evaluasi ROI setiap event. | P1 |

### Laporan & Analytics

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-24 | Sebagai **Admin Pusat**, saya ingin laporan pendapatan harian otomatis dari seluruh cabang, agar saya tidak menunggu laporan manual. | P0 |
| US-25 | Sebagai **Manajer Cabang**, saya ingin ringkasan transaksi hari ini dan rekap bulanan, agar saya bisa rekonsiliasi dengan cepat. | P0 |
| US-26 | Sebagai **Admin Pusat**, saya ingin grafik utilisasi unit untuk identifikasi unit "menganggur", agar alokasi unit lebih efisien. | P1 |
| US-27 | Sebagai **Admin Pusat**, saya ingin export laporan ke Excel/PDF, agar bisa dibagikan ke manajemen dan stakeholder. | P1 |

### Notifikasi

| ID | User Story | Prioritas |
|----|-----------|-----------|
| US-28 | Sebagai **Customer**, saya ingin notifikasi WhatsApp 5 menit sebelum waktu sewa habis, agar saya bisa mengembalikan tepat waktu. | P1 |
| US-29 | Sebagai **Manajer Cabang**, saya ingin notifikasi jika unit di cabang saya < 5 unit tersedia, agar saya bisa request tambahan. | P1 |
| US-30 | Sebagai **Admin Pusat**, saya ingin notifikasi jika unit keluar geofence atau tidak bergerak > 24 jam, agar cepat ditindaklanjuti. | P1 |

---

## 7. Acceptance Criteria

### AC-01: Dashboard Real-Time Tracking

| # | Kriteria |
|---|----------|
| 1 | Dashboard menampilkan peta Indonesia dengan marker 250 lokasi cabang |
| 2 | Ringkasan di atas peta: Total Unit, Unit Aktif, Unit Disewa, Unit Maintenance, Unit Offline |
| 3 | Klik marker cabang menampilkan: nama cabang, alamat, jumlah unit total, tersedia, disewa |
| 4 | Data unit tersegar diperbarui setiap 30 detik tanpa reload halaman |
| 5 | Filter: per cabang, per status unit, per tipe unit |
| 6 | Pencarian unit berdasarkan nomor seri atau nama unit |
| 7 | Dashboard bisa diakses dalam < 3 detik setelah login |
| 8 | Warna indikator: Hijau (aktif), Biru (disewa), Kuning (maintenance), Merah (offline/hilang) |

### AC-02: Manajemen Unit

| # | Kriteria |
|---|----------|
| 1 | Form tambah unit: nomor seri (wajib, unik), tipe mobil, warna, tahun produksi, ID RFID/GPS |
| 2 | Setiap unit bisa di-assign ke satu cabang atau status "pool pusat" |
| 3 | Riwayat lengkap unit: kapan didaftarkan, perpindahan antar cabang, log maintenance, log sewa |
| 4 | QR code otomatis tergenerate untuk setiap unit (tempel fisik di mobil) |
| 5 | Status unit otomatis berubah berdasarkan aktivitas (sewa → disewa, pengembalian → tersedia) |
| 6 | Soft delete untuk unit yang sudah dipensiunkan; data historis tetap tersimpan |
| 7 | Import massal unit via CSV untuk onboarding awal 40.000 unit |
| 8 | Validasi: nomor seri tidak boleh duplikat, RFID/GPS ID harus unik |

### AC-03: Sistem Sewa

| # | Kriteria |
|---|----------|
| 1 | Operator dapat memulai sewa dengan scan QR code unit atau pilih dari daftar |
| 2 | Pilihan durasi: 15 menit, 30 menit, 45 menit (dengan harga berbeda) |
| 3 | Harga otomatis terhitung dan ditampilkan sebelum konfirmasi pembayaran |
| 4 | Opsi pembayaran: Tunai, QRIS (QR code dinamis), GoPay (deeplink) |
| 5 | Timer countdown muncul setelah pembayaran dikonfirmasi |
| 6 | Setelah sewa selesai, status unit kembali ke "tersedia" |
| 7 | Jika melebihi waktu, denda otomatis terhitung Rp2.000/menit keterlambatan |
| 8 | Konfirmasi pengembalian oleh operator (scan QR atau manual) untuk mengakhiri sewa |
| 9 | Perpanjangan sewa bisa dilakukan tanpa transaksi baru, cukup tambah durasi |
| 10 | Transaksi gagal jika unit dalam status "maintenance" atau "offline" |
| 11 | Struk digital terkirim otomatis via WhatsApp jika customer memberikan nomor |

### AC-04: Pelacakan GPS/RFID

| # | Kriteria |
|---|----------|
| 1 | Posisi unit terupdate minimal setiap 10 detik (jika GPS aktif) |
| 2 | Geofence otomatis: radius 100 meter dari koordinat cabang terdaftar |
| 3 | Alert real-time via dashboard dan notifikasi jika unit keluar geofence |
| 4 | History pergerakan bisa ditelusuri per jam dan per hari |
| 5 | Playback rute pergerakan unit dalam 24 jam terakhir |
| 6 | Jika unit offline > 1 jam, status berubah jadi "offline" dan alert terkirim |
| 7 | Data lokasi disimpan minimal 90 hari untuk keperluan audit |

### AC-05: Manajemen Cabang

| # | Kriteria |
|---|----------|
| 1 | Form cabang: nama, alamat lengkap, koordinat GPS, jam operasional, kapasitas unit, nomor telepon |
| 2 | Daftar cabang dengan filter: provinsi, kota, status (aktif/nonaktif) |
| 3 | Manajer Cabang hanya bisa melihat dan mengelola cabangnya sendiri |
| 4 | Admin Pusat bisa menonaktifkan cabang (misal: renovasi) tanpa menghapus data |
| 5 | Halaman detail cabang menampilkan: profil, unit di cabang, transaksi hari ini, performa mingguan |

### AC-06: Laporan & Analytics

| # | Kriteria |
|---|----------|
| 1 | Laporan Harian: total transaksi, pendapatan, unit tersewa per cabang, otomatis terkirim 23:59 |
| 2 | Laporan Bulanan: ringkasan pendapatan, utilisasi rata-rata, tren mingguan, unit paling populer |
| 3 | Grafik interaktif: line chart pendapatan, bar chart utilisasi, pie chart status unit |
| 4 | Export ke Excel (.xlsx) dan PDF |
| 5 | Drill-down: dari nasional → provinsi → kota → cabang |
| 6 | Periode bisa dipilih (custom range, hari ini, minggu ini, bulan ini) |

### AC-07: Autentikasi & RBAC

| # | Kriteria |
|---|----------|
| 1 | Login dengan email/username + password |
| 2 | 4 role: Super Admin, Admin Cabang, Operator, Customer |
| 3 | Super Admin: akses penuh ke seluruh fitur dan data |
| 4 | Admin Cabang: akses ke data cabang sendiri + unit yang ditugaskan |
| 5 | Operator: akses ke modul sewa dan pembayaran + unit di cabangnya |
| 6 | Customer: akses ke riwayat sewa pribadi dan profil |
| 7 | Session timeout otomatis setelah 30 menit inaktivitas |
| 8 | Password minimal 8 karakter, wajib mengandung huruf dan angka |

### AC-08: Notifikasi

| # | Kriteria |
|---|----------|
| 1 | Notifikasi WhatsApp ke customer 5 menit sebelum sewa habis |
| 2 | Notifikasi ke Manajer Cabang jika stok unit tersedia < 5 |
| 3 | Notifikasi ke Admin Pusat jika unit offline > 1 jam atau keluar geofence |
| 4 | Notifikasi maintenance: pengingat servis berkala setiap 500 jam operasi |
| 5 | Email laporan ringkasan harian ke Admin Pusat setiap jam 06:00 |
| 6 | Semua notifikasi tercatat dalam log untuk audit |

---

## 8. Non-Functional Requirements

### Performa

| Parameter | Target |
|-----------|--------|
| **Load Time (Dashboard)** | < 3 detik untuk render peta dengan 250 marker |
| **Load Time (Halaman Sewa)** | < 1.5 detik (critical path transaksi) |
| **API Response Time** | < 500ms untuk 95% request; < 1s untuk 99% |
| **Real-Time Update Interval** | Posisi unit terupdate setiap 10-30 detik |
| **Concurrent Users** | Mendukung 500 operator aktif bersamaan (250 cabang × 2 operator) + 50 admin pusat |
| **Transaksi per Detik** | Mendukung 10 transaksi/detik di peak hour (weekend siang) |

### Skalabilitas

| Parameter | Target |
|-----------|--------|
| **Unit Terlacak** | 40.000 unit saat ini; arsitektur mendukung hingga 100.000 unit |
| **Cabang** | 250 saat ini; arsitektur mendukung hingga 1.000 cabang |
| **Data Historis** | Menyimpan data transaksi dan tracking minimal 2 tahun |
| **Horizontal Scaling** | Stateless API servers, bisa di-scale di Cloudflare VPS |

### Uptime & Availability

| Parameter | Target |
|-----------|--------|
| **System Uptime** | 99,5% (downtime maksimal 3,65 jam/bulan) |
| **Peak Hours** | Sabtu-Minggu 09:00-19:00 — harus fully operational |
| **Backup Strategy** | Database backup otomatis setiap 6 jam; backup harian disimpan 30 hari |
| **Disaster Recovery** | RTO < 4 jam; RPO < 1 jam |

### Keamanan

| Parameter | Target |
|-----------|--------|
| **Autentikasi** | JWT-based authentication dengan refresh token |
| **RBAC** | Role-based access control di setiap API endpoint |
| **Data Encryption** | HTTPS (TLS 1.3) untuk semua komunikasi; password di-hash (bcrypt) |
| **Rate Limiting** | 100 request/menit per user; 30 request/menit untuk endpoint pembayaran |
| **Audit Log** | Semua perubahan data kritis tercatat dengan timestamp dan user ID |
| **Input Validation** | Semua input divalidasi server-side; proteksi XSS, SQL injection, CSRF |

### Kompatibilitas

| Parameter | Target |
|-----------|--------|
| **Browser** | Chrome, Firefox, Safari, Edge — 3 versi terakhir |
| **Mobile Browser** | Chrome Mobile, Safari Mobile, Samsung Internet |
| **Responsive Breakpoint** | Mobile 360px+, Tablet 768px+, Desktop 1280px+ |
| **Koneksi Minimum** | Aplikasi berfungsi pada koneksi 3G; optimal di 4G/WiFi |

---

## 9. Success Metrics & KPIs

### Business KPIs

| Metrik | Baseline | Target (6 Bulan) | Target (12 Bulan) |
|--------|----------|------------------|-------------------|
| **Utilisasi Unit** | 35% (estimasi) | 50% | 65% |
| **Jumlah Transaksi/Bulan** | N/A | 500.000 | 750.000 |
| **Pendapatan/Bulan** | N/A | Rp12,5 M | Rp18,7 M |
| **Waktu Transaksi Rata-Rata** | 2-3 menit | 30 detik | 20 detik |
| **Unit Hilang per Tahun** | 2-3% (1.200 unit) | < 1% (400 unit) | < 0,5% (200 unit) |

### Product KPIs

| Metrik | Target |
|--------|--------|
| **Adopsi Sistem (Cabang)** | 100% cabang onboard dalam 3 bulan |
| **Adopsi Sistem (Operator)** | 90% operator aktif menggunakan sistem harian dalam 1 bulan |
| **Error Rate Transaksi** | < 0,5% transaksi error |
| **System Uptime** | 99,5% |
| **Page Load Time (P95)** | < 2 detik |
| **Customer Satisfaction** | CSAT > 4,0/5,0 (dari survey pelanggan) |

### Tracking KPIs

| Metrik | Target |
|--------|--------|
| **Unit dengan GPS Aktif** | > 95% unit mengirim data lokasi real-time |
| **Alert Response Time** | < 5 menit untuk alert unit keluar geofence |
| **Unit Hilang Setelah Sistem Aktif** | < 10 unit per bulan |

---

## 10. Release Plan

### Fase 0: Foundation (Bulan 1-2)

| Deliverable | Detail |
|-------------|--------|
| Setup infrastruktur | Cloudflare VPS, database, CI/CD pipeline |
| Arsitektur Nuxt 4 | Project setup, Nuxt UI 4, Pinia stores, folder structure |
| Autentikasi & RBAC | Login, register, 4 role user, JWT auth, session management |
| Database Schema | Migrasi tabel: users, branches, units, rentals, transactions, events, notifications |
| Data seeding | Import 250 cabang dan 40.000 unit dari data existing (CSV/migrasi) |

### Fase 1: MVP (Bulan 3-4) — **Must Have**

| Deliverable | Fitur |
|-------------|-------|
| Manajemen Unit | CRUD unit, status, lokasi, assignment ke cabang, QR code generation |
| Manajemen Cabang | CRUD cabang, profil, jam operasional, dashboard per cabang |
| Sistem Sewa | Flow sewa lengkap: scan QR → pilih durasi → bayar → timer → pengembalian |
| Pembayaran | Integrasi QRIS + GoPay + pencatatan tunai |
| Dashboard Tracking | Peta real-time dengan 250 cabang + 40.000 unit, filter, search |
| Laporan Dasar | Laporan harian/mingguan/bulanan, export Excel |

**Go/No-Go MVP:** Seluruh 250 cabang beroperasi dengan sistem; transaksi real-time tervalidasi.

### Fase 2: v1.0 (Bulan 5-6) — **Should Have**

| Deliverable | Fitur |
|-------------|-------|
| Pop-Up Store | Event registration, alokasi unit, laporan event |
| Notifikasi | WhatsApp gateway (pengingat sewa, alert, laporan) |
| Dashboard Analytics | Grafik tren, heatmap, perbandingan cabang |
| Mobile Optimization | UI responsif untuk operator di smartphone |
| Maintenance Module | Log perbaikan, jadwal servis, notifikasi teknisi |
| Customer History | Database pelanggan, riwayat sewa |

### Fase 3: v2.0 (Bulan 7-9) — **Could Have**

| Deliverable | Fitur |
|-------------|-------|
| Program Loyalitas | Poin, diskon, reward pelanggan |
| Self-Service Kiosk | Tablet/kiosk untuk sewa mandiri customer |
| Prediksi Demand | ML-based demand forecasting |
| Marketplace Integration | API untuk mitra eksternal |
| Mode Offline | Service worker caching untuk transaksi tanpa internet |

### Fase 4: v3.0+ (Bulan 10+) — Roadmap Lanjutan

| Inisiatif |
|-----------|
| Aplikasi mobile native (iOS/Android) |
| IoT battery monitoring real-time |
| AI-based dynamic pricing |
| Ekspansi ke 500+ cabang |
| Integrasi CCTV & computer vision untuk keamanan |

---

## 11. Dependencies & Assumptions

### Dependencies (Ketergantungan)

| # | Dependency | Tipe | Dampak Jika Tidak Terpenuhi |
|---|-----------|------|------------------------------|
| 1 | **Data eksisting 40.000 unit** harus tersedia dalam format digital (CSV/Excel) untuk import massal | Data | Onboarding unit harus input manual, memperlambat 3-4 bulan |
| 2 | **Modul GPS/RFID** harus terpasang di unit fisik sebelum sistem tracking bisa digunakan | Hardware | Fitur tracking real-time tidak berfungsi; fallback ke tracking manual |
| 3 | **Integrasi WhatsApp Business API** harus di-approve Meta untuk notifikasi customer | Eksternal | Notifikasi WhatsApp tidak bisa digunakan; fallback ke SMS atau in-app notification |
| 4 | **Integrasi Payment Gateway** (QRIS via Midtrans/Xendit) harus aktif untuk pembayaran non-tunai | Eksternal | Pembayaran hanya tunai; kecepatan transaksi menurun |
| 5 | **Koneksi internet stabil** di 250 cabang untuk real-time data sync | Infrastruktur | Perlu mode offline/sync — di luar scope MVP |
| 6 | **Tim teknis** (2-3 frontend developer, 1-2 backend developer, 1 DevOps) | SDM | Timeline molor jika tim kurang |
| 7 | **Google Maps API** atau **Mapbox** untuk peta interaktif dan geofencing | Eksternal | Fitur peta tidak tersedia; perlu alternatif open-source (Leaflet/OpenStreetMap) |

### Assumptions (Asumsi)

| # | Asumsi | Risiko Jika Salah |
|---|--------|-------------------|
| 1 | Seluruh 250 cabang memiliki minimal 1 smartphone Android untuk operator | Harus menyediakan device untuk cabang yang tidak punya; tambah biaya hardware |
| 2 | Manajer Cabang familiar dengan aplikasi web basic (seperti Google Sheets, email) | Butuh pelatihan lebih intensif; adopsi lebih lambat |
| 3 | Data unit dan cabang yang ada saat ini cukup akurat untuk jadi data awal | Perlu audit dan pembersihan data sebelum import |
| 4 | Modul GPS memiliki daya tahan baterai minimal 24 jam operasional | Jika baterai boros, data tracking tidak real-time dan sering offline |
| 5 | Koneksi internet di cabang minimal 5 Mbps (cukup untuk real-time tracking) | Jika < 2 Mbps, real-time update terhambat; perlu buffer/queue system |
| 6 | Satu operator menangani 1-2 transaksi per menit di jam sibuk | Sistem harus dioptimalkan untuk throughput yang lebih tinggi |
| 7 | Hardware GPS/RFID existing kompatibel dengan API integrasi | Jika tidak kompatibel, perlu middleware atau ganti hardware |
| 8 | Customer bersedia memberikan nomor WhatsApp untuk notifikasi | Tanpa nomor, notifikasi sewa tidak bisa dikirim; perlu fallback (panggilan/stiker) |

### Risiko Utama & Mitigasi

| Risiko | Level | Mitigasi |
|--------|-------|----------|
| Keterlambatan integrasi hardware GPS/RFID | High | Mulai integrasi hardware dari bulan pertama; buat mock API untuk development paralel |
| Data existing tidak bersih/tidak akurat | Medium | Lakukan audit data 2 minggu sebelum import; siapkan script validasi |
| Rendahnya adopsi operator lapangan | Medium | UI super sederhana; pelatihan singkat + video tutorial; insentif early adopter |
| Payment gateway delay approval | Low | Ajukan dari bulan pertama; siapkan fallback pembayaran tunai |
| Server overload di peak hours | Medium | Load testing sebelum launch; auto-scaling di Cloudflare; rate limiting |

---

**Dokumen ini telah direview dan disetujui untuk masuk ke fase selanjutnya.**

| Role | Nama | Tanggal | Tanda Tangan |
|------|------|---------|-------------|
| Product Manager | ___________ | ___________ | ___________ |
| Tech Lead | ___________ | ___________ | ___________ |
| CTO | ___________ | ___________ | ___________ |
| CEO | ___________ | ___________ | ___________ |
