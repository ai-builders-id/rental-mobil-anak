# Design System — Rental Mobil Anak

> **Versi:** 1.0.0
> **Framework:** Nuxt UI 4 + Tailwind CSS v4
> **Target:** Aplikasi tracking & manajemen rental mobil-mobilan anak
> **Audience:** Operator lapangan, admin cabang, admin pusat
> **Standar Aksesibilitas:** WCAG 2.1 Level AA

---

## 1. Design Philosophy

### 1.1 Prinsip Inti

| Prinsip | Deskripsi |
|---------|-----------|
| **Fun & Playful** | Nuansa mainan anak-anak: warna cerah, border radius membulat, animasi ringan — mencerminkan produk: mobil-mobilan rental anak |
| **Profesional & Efisien** | Operator butuh kecepatan: layout padat-informasi, quick actions, minim klik, mobile-first |
| **Jelas & Terbaca** | Kontras tinggi, tipografi besar, ikon jelas — operator sering di lapangan dengan pencahayaan bervariasi |
| **Konsisten** | Satu bahasa visual di seluruh platform; komponen Nuxt UI dipakai seragam |
| **Aksesibel** | WCAG 2.1 AA: color contrast ≥4.5:1 (teks normal), ≥3:1 (teks besar), keyboard navigable, screen-reader friendly |

### 1.2 Tone of Voice

- **UI Copy:** Ringkas, imperatif, Bahasa Indonesia baku santai (contoh: "Mulai Sewa" bukan "Silakan klik tombol ini untuk memulai proses penyewaan")
- **Error Message:** Jelaskan masalah + solusi, jangan menyalahkan user
- **Success Message:** Konfirmasi singkat + next step

---

## 2. Color System

### 2.1 Primary — Playful Orange-Red

Mewakili warna khas mobil-mobilan anak, energik, mencuri perhatian.

| Shade | Hex | CSS Variable |
|-------|-----|-------------|
| 50 | `#FFF5F0` | `--color-primary-50` |
| 100 | `#FFE8D6` | `--color-primary-100` |
| 200 | `#FFCCAA` | `--color-primary-200` |
| 300 | `#FFA875` | `--color-primary-300` |
| 400 | `#FF8545` | `--color-primary-400` |
| **500** | **`#FF6B1A`** | **`--color-primary-500`** (default) |
| 600 | `#E55500` | `--color-primary-600` |
| 700 | `#B84500` | `--color-primary-700` |
| 800 | `#8A3400` | `--color-primary-800` |
| 900 | `#5C2200` | `--color-primary-900` |
| 950 | `#331100` | `--color-primary-950` |

### 2.2 Secondary — Bright Blue

Keseimbangan terhadap primary; dipakai untuk link, info panel, elemen sekunder.

| Shade | Hex | CSS Variable |
|-------|-----|-------------|
| 50 | `#EBF5FF` | `--color-secondary-50` |
| 100 | `#D6EAFF` | `--color-secondary-100` |
| 200 | `#ADD5FF` | `--color-secondary-200` |
| 300 | `#75B8FF` | `--color-secondary-300` |
| 400 | `#459BFF` | `--color-secondary-400` |
| **500** | **`#1A7FFF`** | **`--color-secondary-500`** (default) |
| 600 | `#0061D6` | `--color-secondary-600` |
| 700 | `#004AA3` | `--color-secondary-700` |
| 800 | `#003575` | `--color-secondary-800` |
| 900 | `#001F47` | `--color-secondary-900` |
| 950 | `#001229` | `--color-secondary-950` |

### 2.3 Semantic Colors

#### Success — Green

| Shade | Hex |
|-------|-----|
| 50 | `#F0FFF4` |
| 100 | `#D6FFE5` |
| 200 | `#A3F0BD` |
| 300 | `#66D98A` |
| 400 | `#33C25C` |
| **500** | **`#00A63E`** |
| 600 | `#008A34` |
| 700 | `#006B28` |
| 800 | `#004D1D` |
| 900 | `#002E11` |
| 950 | `#001A09` |

#### Warning — Yellow/Amber

| Shade | Hex |
|-------|-----|
| 50 | `#FFFDF0` |
| 100 | `#FFF8CC` |
| 200 | `#FFEE99` |
| 300 | `#FFE066` |
| 400 | `#FFD133` |
| **500** | **`#FFC400`** |
| 600 | `#D9A600` |
| 700 | `#A67F00` |
| 800 | `#755A00` |
| 900 | `#473600` |
| 950 | `#241B00` |

#### Error — Red

| Shade | Hex |
|-------|-----|
| 50 | `#FFF0F0` |
| 100 | `#FFD6D6` |
| 200 | `#FFADAD` |
| 300 | `#FF7575` |
| 400 | `#FF4545` |
| **500** | **`#E50000`** |
| 600 | `#BF0000` |
| 700 | `#990000` |
| 800 | `#730000` |
| 900 | `#4D0000` |
| 950 | `#290000` |

#### Info — Blue

| Shade | Hex |
|-------|-----|
| 50 | `#EBF5FF` |
| 100 | `#D6EAFF` |
| 200 | `#ADD5FF` |
| 300 | `#75B8FF` |
| 400 | `#459BFF` |
| **500** | **`#1A7FFF`** |
| 600 | `#0061D6` |
| 700 | `#004AA3` |
| 800 | `#003575` |
| 900 | `#001F47` |
| 950 | `#001229` |

### 2.4 Neutral — Warm Grays

Hangat agar tidak terlalu klinis; cocok untuk latar dan teks.

| Shade | Hex |
|-------|-----|
| 50 | `#FAFAF8` |
| 100 | `#F2F1ED` |
| 200 | `#E6E4DE` |
| 300 | `#D4D1C9` |
| 400 | `#B0ACA3` |
| **500** | **`#8C877D`** |
| 600 | `#706B62` |
| 700 | `#57534A` |
| 800 | `#3D3A33` |
| 900 | `#26241F` |
| 950 | `#141310` |

### 2.5 Dark Mode Palette

| Token | Light | Dark |
|-------|-------|------|
| Background | `neutral-50` | `neutral-950` |
| Surface | `white` | `neutral-900` |
| Surface Elevated | `white` + shadow | `neutral-800` |
| Text Primary | `neutral-900` | `neutral-50` |
| Text Secondary | `neutral-600` | `neutral-300` |
| Text Muted | `neutral-400` | `neutral-500` |
| Border | `neutral-200` | `neutral-700` |
| Divider | `neutral-100` | `neutral-800` |

---

## 3. Typography

### 3.1 Font Families

| Peran | Font | Fallback | Kegunaan |
|-------|------|----------|----------|
| Sans (Display & UI) | `Plus Jakarta Sans` | `Nunito, system-ui, sans-serif` | Heading, body text, UI labels, button |
| Mono | `JetBrains Mono` | `ui-monospace, monospace` | Kode unit, timestamp, data tabular, angka finansial |

### 3.2 Type Scale (Tailwind v4 CSS – fluid)

| Level | Class | Size / Clamp | Line Height | Weight | Use |
|-------|-------|-------------|-------------|--------|-----|
| Display | `text-display` | `clamp(2.5rem, 5vw, 4rem)` | `1.1` | 800 | Hero dashboard, login title |
| H1 | `text-h1` | `clamp(2rem, 4vw, 3rem)` | `1.2` | 700 | Page heading |
| H2 | `text-h2` | `clamp(1.5rem, 3vw, 2rem)` | `1.25` | 700 | Section heading |
| H3 | `text-h3` | `1.25rem` | `1.3` | 600 | Card title |
| H4 | `text-h4` | `1.125rem` | `1.35` | 600 | Subsection |
| Body Lg | `text-body-lg` | `1.125rem` | `1.6` | 400 | Lead paragraph |
| Body | `text-body` | `1rem` | `1.5` | 400 | Body text |
| Body Sm | `text-body-sm` | `0.875rem` | `1.5` | 400 | Secondary info |
| Caption | `text-caption` | `0.75rem` | `1.4` | 500 | Label, helper text |
| Mono | `font-mono text-sm` | `0.875rem` | `1.4` | 400 | Kode unit, data |

### 3.3 Nuxt UI Typography Overrides

```ts
// app.config.ts — typography
ui: {
  typography: {
    fontFamily: {
      sans: '"Plus Jakarta Sans", Nunito, system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    }
  }
}
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (Tailwind default + custom)

| Token | Value | Use |
|-------|-------|-----|
| `0` | `0` | No gap |
| `0.5` | `0.125rem` (2px) | Tight icon-text gap |
| `1` | `0.25rem` (4px) | Icon padding |
| `1.5` | `0.375rem` (6px) | Compact |
| `2` | `0.5rem` (8px) | Standard tight |
| `3` | `0.75rem` (12px) | Standard |
| `4` | `1rem` (16px) | Card padding, form gap |
| `5` | `1.25rem` (20px) | Comfortable |
| `6` | `1.5rem` (24px) | Section gap |
| `8` | `2rem` (32px) | Large section |
| `10` | `2.5rem` (40px) | Page-level |
| `12` | `3rem` (48px) | Hero |
| `16` | `4rem` (64px) | Massive |

### 4.2 Container Widths

```css
--container-sm: 640px;   /* Form sempit, modal kecil */
--container-md: 768px;   /* Form lebar */
--container-lg: 1024px;  /* Dashboard standar */
--container-xl: 1280px;  /* Dashboard pusat, tabel besar */
--container-2xl: 1536px; /* Peta Indonesia full-width */
```

### 4.3 Grid System

- **12-column grid** via CSS Grid / Tailwind `grid-cols-12`
- **Gutter:** `gap-4` (16px) default; `gap-6` (24px) pada dashboard
- **Dashboard layout:** sidebar 260px + main content fluid
- **Card grid:** auto-fill `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

### 4.4 Layout Templates

```
┌──────────────────────────────────────────────────┐
│ [Logo]         Top Navigation Bar         [User] │
├────────┬─────────────────────────────────────────┤
│        │                                         │
│ Side   │         Main Content Area               │
│ bar    │                                         │
│ 260px  │                                         │
│        │                                         │
├────────┴───────────────────────��─────────────────┤
│              Status Bar / Footer                  │
└──────────────────────────────────────────────────┘
```

---

## 5. Border Radius

| Token | Class | Value | Use |
|-------|-------|-------|-----|
| None | `rounded-none` | `0` | Table cells (opsional) |
| Sm | `rounded-sm` | `0.125rem` | Inline code, small badges |
| **Md** | **`rounded-md`** | **`0.375rem`** | Input fields, small cards |
| **Lg** | **`rounded-lg`** | **`0.5rem`** | **PREDOMINANT — cards, buttons, modals** |
| Xl | `rounded-xl` | `0.75rem` | Large cards, hero images |
| 2xl | `rounded-2xl` | `1rem` | Feature cards, dashboard widgets |
| 3xl | `rounded-3xl` | `1.5rem` | Avatar groups, special CTAs |
| Full | `rounded-full` | `9999px` | Avatar, pill badges, toggle |

**Aturan:** Semua interactive element (button, card, input) minimal `rounded-lg`. Inline elements (badge, tag) `rounded-full`.

---

## 6. Shadows & Elevation

### 6.1 Elevation Levels

| Level | Class | Shadow Value | Use |
|-------|-------|-------------|-----|
| 0 | `shadow-none` | none | Flat surface |
| 1 | `shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` | Card default, subtle lift |
| 2 | `shadow-sm` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Hovered card, dropdown |
| 3 | `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)` | Modal, sticky header |
| 4 | `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.04)` | Command palette, toast |
| 5 | `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)` | Full-screen modal overlay |

### 6.2 Nuxt UI Shadow Tokens

```ts
ui: {
  shadow: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.06), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  }
}
```

---

## 7. Nuxt UI Components — Usage Guidelines

### 7.1 Core Components Reference

| Komponen | Penggunaan Utama | Variants |
|----------|-----------------|----------|
| `UButton` | Semua aksi: submit, CTA, danger, ghost | `solid`, `outline`, `soft`, `ghost`, `link` |
| `UCard` | Container konten: dashboard stat, unit detail, form section | Default slot, header, footer |
| `UTable` | Tabel data: daftar unit, transaksi, laporan | Sortable, selectable, paginated |
| `UModal` | Dialog: form booking, konfirmasi, detail unit | `slideover` untuk mobile |
| `UInput` | Input teks: search, form field, nomor unit | Leading/trailing icon |
| `USelect` | Dropdown: pilih cabang, pilih unit, filter | Searchable, multi-select |
| `USelectMenu` | Select dengan custom options rendering | Avatar + label |
| `UBadge` | Status indicator: unit status, payment status | `solid`, `soft`, `outline` |
| `UAvatar` | User profile, cabang icon | Image, text fallback |
| `UDropdown` | Context menu: aksi tabel, user menu | Items array |
| `UCommandPalette` | Global search, quick actions (Cmd+K) | Groups, shortcuts |
| `UContainer` | Layout wrapper, page-level constraint | Responsive |
| `USlideover` | Panel samping: filter, detail mobile | Left / right |
| `UAlert` | Notifikasi inline: warning, error, info | Actions slot |
| `UBreadcrumb` | Navigasi hierarkis | Divider custom |
| `UTabs` | Tab navigasi dalam halaman | Icon + label |
| `UTooltip` | Info tambahan pada hover | Short / long text |
| `UNotification` / Toast | Feedback transient: success, error, warning | Timeout, actions |
| `UProgress` | Progress bar: upload, loading step | Indeterminate |
| `USkeleton` | Loading placeholder | Shape variants |
| `UCheckbox` | Multi-select, terms agreement | Indeterminate |
| `URadioGroup` | Pilihan tunggal dalam form | Card variant |
| `UToggle` | On/off switch: dark mode, notifikasi | Color variant |
| `UPagination` | Navigasi halaman tabel | Max visible pages |
| `UInputMenu` | Autocomplete / combobox | Async search |
| `UForm` | Wrapper form validation | Schema-based |
| `UFormGroup` | Label + input + error message | Required indicator |
| `UDivider` | Pemisah visual | Label slot |
| `UKbd` | Shortcut indicator | Cmd+K, Esc |
| `UChip` | Tag / filter pill | Dismissible |

### 7.2 Component States

Setiap komponen interaktif WAJIB menangani state:

| State | Implementasi |
|-------|-------------|
| **Default** | Tampilan normal, siap interaksi |
| **Hover** | `hover:` variant, cursor pointer |
| **Focus** | `focus-visible:ring-2 focus-visible:ring-primary-500` outline offset |
| **Active** | `active:scale-[0.98]` micro-press effect |
| **Disabled** | `opacity-50 cursor-not-allowed pointer-events-none` |
| **Loading** | Spinner + `aria-busy="true"` pada button; `USkeleton` pada card |
| **Error** | Border merah + pesan error pada UFormGroup |
| **Empty** | Ilustrasi + teks ajakan aksi |

### 7.3 Button Hierarchy

```
Primary Solid       — Aksi utama halaman (Mulai Sewa, Simpan)
Secondary Outlined  — Aksi alternatif (Batal, Kembali)
Tertiary Ghost      — Aksi minor (Filter, Sort, More)
Danger Solid        — Aksi destruktif (Hapus, Batalkan Sewa)
Success Solid       — Aksi konfirmasi (Bayar, Selesai)
```

---

## 8. CSS Variables / Design Tokens

### 8.1 Nuxt UI 4 Standard Tokens

```css
/* main.css — CSS Custom Properties */

@layer base {
  :root {
    /* Nuxt UI core tokens */
    --ui-primary: var(--color-primary-500);
    --ui-primary-soft: var(--color-primary-50);
    --ui-secondary: var(--color-secondary-500);
    --ui-secondary-soft: var(--color-secondary-50);
    --ui-success: var(--color-success-500);
    --ui-success-soft: var(--color-success-50);
    --ui-warning: var(--color-warning-500);
    --ui-warning-soft: var(--color-warning-50);
    --ui-error: var(--color-error-500);
    --ui-error-soft: var(--color-error-50);
    --ui-info: var(--color-info-500);
    --ui-info-soft: var(--color-info-50);

    /* Background & surface */
    --ui-bg: var(--color-neutral-50);
    --ui-bg-elevated: #ffffff;
    --ui-bg-muted: var(--color-neutral-100);
    --ui-bg-accented: var(--color-primary-50);

    /* Text */
    --ui-text: var(--color-neutral-900);
    --ui-text-muted: var(--color-neutral-500);
    --ui-text-dimmed: var(--color-neutral-400);
    --ui-text-highlighted: var(--color-neutral-950);
    --ui-text-inverted: #ffffff;

    /* Border */
    --ui-border: var(--color-neutral-200);
    --ui-border-muted: var(--color-neutral-100);
    --ui-border-accented: var(--color-primary-200);
    --ui-border-inverted: var(--color-neutral-700);

    /* Ring */
    --ui-ring: var(--color-primary-500);
    --ui-ring-soft: var(--color-primary-200);

    /* Radius */
    --ui-radius: 0.5rem; /* rounded-lg default */
    --ui-radius-sm: 0.375rem;
    --ui-radius-xs: 0.25rem;

    /* Container */
    --ui-container: var(--container-xl);
  }
}
```

### 8.2 Color CSS Variables

```css
@layer base {
  :root {
    /* Primary */
    --color-primary-50: #FFF5F0;
    --color-primary-100: #FFE8D6;
    --color-primary-200: #FFCCAA;
    --color-primary-300: #FFA875;
    --color-primary-400: #FF8545;
    --color-primary-500: #FF6B1A;
    --color-primary-600: #E55500;
    --color-primary-700: #B84500;
    --color-primary-800: #8A3400;
    --color-primary-900: #5C2200;
    --color-primary-950: #331100;

    /* Secondary */
    --color-secondary-50: #EBF5FF;
    --color-secondary-100: #D6EAFF;
    --color-secondary-200: #ADD5FF;
    --color-secondary-300: #75B8FF;
    --color-secondary-400: #459BFF;
    --color-secondary-500: #1A7FFF;
    --color-secondary-600: #0061D6;
    --color-secondary-700: #004AA3;
    --color-secondary-800: #003575;
    --color-secondary-900: #001F47;
    --color-secondary-950: #001229;

    /* Success */
    --color-success-50: #F0FFF4;
    --color-success-100: #D6FFE5;
    --color-success-200: #A3F0BD;
    --color-success-300: #66D98A;
    --color-success-400: #33C25C;
    --color-success-500: #00A63E;
    --color-success-600: #008A34;
    --color-success-700: #006B28;
    --color-success-800: #004D1D;
    --color-success-900: #002E11;
    --color-success-950: #001A09;

    /* Warning */
    --color-warning-50: #FFFDF0;
    --color-warning-100: #FFF8CC;
    --color-warning-200: #FFEE99;
    --color-warning-300: #FFE066;
    --color-warning-400: #FFD133;
    --color-warning-500: #FFC400;
    --color-warning-600: #D9A600;
    --color-warning-700: #A67F00;
    --color-warning-800: #755A00;
    --color-warning-900: #473600;
    --color-warning-950: #241B00;

    /* Error */
    --color-error-50: #FFF0F0;
    --color-error-100: #FFD6D6;
    --color-error-200: #FFADAD;
    --color-error-300: #FF7575;
    --color-error-400: #FF4545;
    --color-error-500: #E50000;
    --color-error-600: #BF0000;
    --color-error-700: #990000;
    --color-error-800: #730000;
    --color-error-900: #4D0000;
    --color-error-950: #290000;

    /* Info */
    --color-info-50: #EBF5FF;
    --color-info-100: #D6EAFF;
    --color-info-200: #ADD5FF;
    --color-info-300: #75B8FF;
    --color-info-400: #459BFF;
    --color-info-500: #1A7FFF;
    --color-info-600: #0061D6;
    --color-info-700: #004AA3;
    --color-info-800: #003575;
    --color-info-900: #001F47;
    --color-info-950: #001229;

    /* Neutral */
    --color-neutral-50: #FAFAF8;
    --color-neutral-100: #F2F1ED;
    --color-neutral-200: #E6E4DE;
    --color-neutral-300: #D4D1C9;
    --color-neutral-400: #B0ACA3;
    --color-neutral-500: #8C877D;
    --color-neutral-600: #706B62;
    --color-neutral-700: #57534A;
    --color-neutral-800: #3D3A33;
    --color-neutral-900: #26241F;
    --color-neutral-950: #141310;
  }
}
```

---

## 9. Dark Mode

### 9.1 Strategy

- **Mode:** `class`-based dark mode (Tailwind `darkMode: 'class'`)
- **Toggle:** `UToggle` / `UButton` di header / user menu
- **Persist:** `localStorage` key `color-mode` dengan nilai `light` | `dark` | `system`
- **System:** Deteksi `prefers-color-scheme` via `matchMedia`
- **Nuxt:** Pakai `@nuxtjs/color-mode` module; hook ke `useColorMode()`

### 9.2 Dark Mode Tokens

```css
.dark {
  --ui-bg: #141310; /* neutral-950 */
  --ui-bg-elevated: #1c1a16;
  --ui-bg-muted: #26241F; /* neutral-900 */
  --ui-bg-accented: #3D3A33; /* neutral-800 */

  --ui-text: #FAFAF8; /* neutral-50 */
  --ui-text-muted: #8C877D; /* neutral-500 */
  --ui-text-dimmed: #706B62; /* neutral-600 */

  --ui-border: #3D3A33; /* neutral-800 */
  --ui-border-muted: #26241F; /* neutral-900 */

  --ui-ring: #FF8545; /* primary-400 — lebih terang untuk kontras */
}
```

### 9.3 Dark Mode Rules

- **Tidak inverse warna grafik/data** — warna semantik tetap, hanya background & teks berubah
- **Shadow di dark mode:** subtle glow instead of dark shadow (`0 0 15px rgba(255,107,26,0.08)`)
- **Image/logo:** jika ada logo, sediakan varian dark

---

## 10. Responsive Breakpoints

### 10.1 Breakpoints (Tailwind v4 default, mobile-first)

| Breakpoint | Min Width | Target Device | Prioritas |
|-----------|-----------|--------------|-----------|
| `xs` | `400px` | HP kecil, operator lapangan | **Critical** |
| `sm` | `640px` | HP besar landscape | High |
| `md` | `768px` | Tablet portrait | High |
| `lg` | `1024px` | Tablet landscape, laptop kecil | Medium |
| `xl` | `1280px` | Desktop, dashboard admin | Medium |
| `2xl` | `1536px` | Monitor besar, peta Indonesia | Low |

### 10.2 Mobile-First Principles

1. **Mulai dari `xs` (400px)** — semua fitur utama HARUS berfungsi
2. **Touch target minimum 44×44px** (WCAG)
3. **Bottom navigation** untuk mobile; sidebar untuk desktop
4. **Tabel → collapse ke card list di mobile**
5. **Modal → full-screen sheet di mobile**
6. **Form → single-column di mobile, multi-column di desktop**

### 10.3 Layout Behavior per Breakpoint

| Element | xs (400px) | sm (640px) | md (768px) | lg (1024px) | xl (1280px) |
|---------|-----------|-----------|-----------|-------------|-------------|
| Sidebar | Tersembunyi, hamburger menu | Tersembunyi, hamburger | Terlihat, collapsed | Terlihat, 260px | Terlihat, 280px |
| Card grid | 1 kolom | 1 kolom | 2 kolom | 3 kolom | 4 kolom |
| Tabel data | Card list view | Card list | Tabel | Tabel | Tabel |
| Modal | Full-screen sheet | Full-screen sheet | Dialog centered | Dialog centered | Dialog centered |
| Form layout | Single column | Single column | 2 kolom | 2 kolom | 2 kolom |
| Header | Compact | Compact | Full | Full | Full |
| Peta | Small | Medium | Large | Full | Full |

---

## 11. Icon System

### 11.1 Library

- **Library:** [Lucide Icons](https://lucide.dev) via `@nuxt/icon` module
- **Size scale:** `size-4` (16px), `size-5` (20px), `size-6` (24px), `size-8` (32px), `size-10` (40px)
- **Stroke:** `stroke-2` default (Lucide standard)

### 11.2 Icon Map

| Konteks | Icon | Lucide Name |
|---------|------|-------------|
| Dashboard | Gauge, Layout | `gauge`, `layout-dashboard` |
| Unit / Mobil | Car, Truck | `car`, `car-front` |
| Sewa / Booking | Calendar, Clock | `calendar-check`, `clock` |
| Tracking / Peta | Map, Pin | `map`, `map-pin` |
| Cabang / Store | Store, Building | `store`, `building-2` |
| Laporan | Chart, File | `bar-chart-3`, `file-text` |
| Pengguna | Users, User | `users`, `user-circle` |
| Pengaturan | Settings | `settings` |
| Notifikasi | Bell | `bell` |
| Search | Search | `search` |
| Filter | Filter, Sliders | `filter`, `sliders-horizontal` |
| Tambah | Plus, PlusCircle | `plus`, `plus-circle` |
| Edit | Pencil, Pen | `pencil`, `square-pen` |
| Hapus | Trash | `trash-2` |
| Download | Download | `download` |
| Export | FileSpreadsheet | `file-spreadsheet` |
| Print | Printer | `printer` |
| Logout | LogOut | `log-out` |
| Dark Mode | Moon, Sun | `moon`, `sun` |
| Loading | Loader, LoaderCircle | `loader-circle` |
| Check / Success | Check, CircleCheck | `check`, `circle-check` |
| Alert / Warning | AlertTriangle | `triangle-alert` |
| Info | Info | `info` |
| Error / Close | X, CircleX | `x`, `circle-x` |
| Hamburger Menu | Menu | `menu` |
| Arrow Navigation | ChevronLeft, ChevronRight | `chevron-left`, `chevron-right` |
| Kembali | ArrowLeft | `arrow-left` |
| Upload | Upload | `upload` |
| Lock / Security | Lock, Shield | `lock`, `shield-check` |
| Payment / Uang | CreditCard, Banknote | `credit-card`, `banknote` |
| Timer | Timer, Hourglass | `timer`, `hourglass` |
| Geofence | Globe, Crosshair | `globe`, `crosshair` |

---

## 12. Animation & Micro-interactions

### 12.1 Principles

- **Durasi pendek:** 150–300ms (jangan mengganggu workflow operator)
- **Easing:** `ease-out` untuk muncul, `ease-in` untuk menghilang
- **Purposeful:** setiap animasi punya tujuan (feedback, transisi, fokus)
- **Prefers-reduced-motion:** semua animasi wajib respect `prefers-reduced-motion: reduce`

### 12.2 Transition Tokens

```css
@layer base {
  :root {
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}
```

### 12.3 Defined Animations

| Nama | Trigger | Durasi | Easing | Deskripsi |
|------|---------|--------|--------|-----------|
| `fade-in` | Element mount | 200ms | `ease-out` | Opacity 0→1 |
| `fade-out` | Element unmount | 150ms | `ease-in` | Opacity 1→0 |
| `slide-up` | Modal/Sheet open | 250ms | `ease-out` | TranslateY + fade |
| `slide-down` | Modal/Sheet close | 200ms | `ease-in` | TranslateY + fade |
| `scale-in` | Card muncul (stagger) | 200ms | `cubic-bezier(0.34,1.56,0.64,1)` | Scale 0.95→1 + fade |
| `bounce-in` | Notification muncul | 300ms | `cubic-bezier(0.34,1.56,0.64,1)` | Scale overshoot |
| `pulse-ring` | Status live tracking | 2s infinite | `ease-out` | Ring berdenyut di marker peta |
| `spin` | Loading spinner | Linear infinite | `linear` | Rotate 360° |
| `shimmer` | Skeleton loading | 2s infinite | `ease-in-out` | Gradient sweep |
| `wiggle` | Geofence alert | 500ms | `ease-in-out` | Rotate ±5° |

### 12.4 Hover & Active States

```css
/* Button press */
.u-btn:active {
  transform: scale(0.97);
  transition: transform 100ms ease;
}

/* Card hover */
.u-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
}

/* Table row hover */
tr:hover {
  background: var(--ui-bg-muted);
  transition: background 150ms ease;
}

/* Link underline animation */
a.animated-link {
  background: linear-gradient(var(--ui-primary), var(--ui-primary)) left bottom / 0 2px no-repeat;
  transition: background-size 300ms ease;
}
a.animated-link:hover {
  background-size: 100% 2px;
}
```

### 12.5 Staggered List Animation

Untuk card grid, animasi masuk berurutan dengan delay incremental:

```css
.stagger-item {
  opacity: 0;
  transform: translateY(12px);
  animation: fade-in 200ms ease-out forwards;
}
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 50ms; }
.stagger-item:nth-child(3) { animation-delay: 100ms; }
.stagger-item:nth-child(4) { animation-delay: 150ms; }
.stagger-item:nth-child(5) { animation-delay: 200ms; }
.stagger-item:nth-child(6) { animation-delay: 250ms; }
.stagger-item:nth-child(7) { animation-delay: 300ms; }
.stagger-item:nth-child(8) { animation-delay: 350ms; }
```

---

## 13. Accessibility (WCAG 2.1 AA)

### 13.1 Color Contrast

| Kombinasi | Ratio Min | Diperiksa? |
|-----------|-----------|------------|
| Teks normal (≤18px) vs background | 4.5:1 | Ya |
| Teks besar (≥18px bold / ≥24px) vs bg | 3:1 | Ya |
| UI component boundary vs bg | 3:1 | Ya |
| Focus indicator vs bg | 3:1 | Ya |

### 13.2 Keyboard Navigation

- **Tab order:** Logis, left-to-right, top-to-bottom
- **Focus trap:** Modal, slideover, command palette
- **Skip-to-content:** Link pertama di halaman
- **Shortcuts:** `Cmd/Ctrl + K` → Command Palette; `Esc` → Close modal; `?` → Shortcut help

### 13.3 Screen Reader

- **Semantic HTML:** `<nav>`, `<main>`, `<aside>`, `<header>`, `<section>`, `<article>`
- **ARIA labels:** Semua icon button wajib `aria-label`
- **Live regions:** `aria-live="polite"` untuk notifikasi toast; `aria-live="assertive"` untuk error validasi
- **Table:** `<caption>`, `<thead>`, `<tbody>`, `scope="col"`, `scope="row"`
- **Form:** `<label>` terasosiasi dengan `for`/`id`, `aria-describedby` untuk error/helper
- **Loading state:** `aria-busy="true"` pada container yang sedang loading

### 13.4 Focus Management

```css
/* Global focus ring — menggantikan outline default */
*:focus-visible {
  outline: none;
  ring: 2px solid var(--ui-ring);
  ring-offset: 2px;
  border-radius: var(--ui-radius);
}
```

### 13.5 Motion Reduction

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 14. App Configuration

### 14.1 `app.config.ts`

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'orange',
    gray: 'neutral',
    colors: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    
    // Typography
    typography: {
      fontFamily: {
        sans: '"Plus Jakarta Sans", Nunito, system-ui, sans-serif',
        mono: '"JetBrains Mono", ui-monospace, monospace',
      },
    },

    // Container defaults
    container: {
      constrained: 'max-w-7xl',
      padding: 'px-4 sm:px-6 lg:px-8',
    },

    // Button defaults
    button: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'solid',
      },
      rounded: 'rounded-lg',
      font: 'font-semibold',
    },

    // Input defaults
    input: {
      default: {
        size: 'md',
        color: 'neutral',
      },
      rounded: 'rounded-lg',
    },

    // Card defaults
    card: {
      rounded: 'rounded-lg',
      shadow: 'shadow-xs',
      ring: 'ring-1 ring-ui-border',
      background: 'bg-ui-bg-elevated',
      body: {
        padding: 'p-4 sm:p-6',
      },
    },

    // Table defaults
    table: {
      wrapper: {
        rounded: 'rounded-lg',
        ring: 'ring-1 ring-ui-border',
      },
      thead: 'bg-ui-bg-muted',
      th: {
        padding: 'px-4 py-3',
        color: 'text-ui-text-muted',
        font: 'font-semibold text-caption',
      },
      td: {
        padding: 'px-4 py-3',
        color: 'text-ui-text',
      },
    },

    // Modal defaults
    modal: {
      overlay: {
        background: 'bg-neutral-950/50 dark:bg-neutral-950/70',
        transition: 'transition-opacity duration-200',
      },
      background: 'bg-ui-bg-elevated',
      rounded: 'rounded-xl',
      shadow: 'shadow-xl',
      padding: 'p-4 sm:p-6',
    },

    // Badge defaults
    badge: {
      default: {
        size: 'sm',
        variant: 'soft',
      },
      rounded: 'rounded-full',
      font: 'font-medium text-caption',
    },

    // Notification (toast) defaults
    notification: {
      rounded: 'rounded-lg',
      shadow: 'shadow-lg',
      position: 'bottom-right',
      duration: 5000,
    },

    // Dropdown defaults
    dropdown: {
      rounded: 'rounded-lg',
      shadow: 'shadow-md',
      ring: 'ring-1 ring-ui-border',
    },

    // Command palette
    commandPalette: {
      rounded: 'rounded-xl',
      shadow: 'shadow-xl',
      icon: {
        size: 'size-5',
      },
    },

    // Avatar
    avatar: {
      rounded: 'rounded-full',
      size: {
        xs: 'size-6',
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
        xl: 'size-14',
      },
    },
  },
});
```

### 14.2 `tailwind.config.ts`

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F0', 100: '#FFE8D6', 200: '#FFCCAA',
          300: '#FFA875', 400: '#FF8545', 500: '#FF6B1A',
          600: '#E55500', 700: '#B84500', 800: '#8A3400',
          900: '#5C2200', 950: '#331100',
        },
        secondary: {
          50: '#EBF5FF', 100: '#D6EAFF', 200: '#ADD5FF',
          300: '#75B8FF', 400: '#459BFF', 500: '#1A7FFF',
          600: '#0061D6', 700: '#004AA3', 800: '#003575',
          900: '#001F47', 950: '#001229',
        },
        success: {
          50: '#F0FFF4', 100: '#D6FFE5', 200: '#A3F0BD',
          300: '#66D98A', 400: '#33C25C', 500: '#00A63E',
          600: '#008A34', 700: '#006B28', 800: '#004D1D',
          900: '#002E11', 950: '#001A09',
        },
        warning: {
          50: '#FFFDF0', 100: '#FFF8CC', 200: '#FFEE99',
          300: '#FFE066', 400: '#FFD133', 500: '#FFC400',
          600: '#D9A600', 700: '#A67F00', 800: '#755A00',
          900: '#473600', 950: '#241B00',
        },
        error: {
          50: '#FFF0F0', 100: '#FFD6D6', 200: '#FFADAD',
          300: '#FF7575', 400: '#FF4545', 500: '#E50000',
          600: '#BF0000', 700: '#990000', 800: '#730000',
          900: '#4D0000', 950: '#290000',
        },
        info: {
          50: '#EBF5FF', 100: '#D6EAFF', 200: '#ADD5FF',
          300: '#75B8FF', 400: '#459BFF', 500: '#1A7FFF',
          600: '#0061D6', 700: '#004AA3', 800: '#003575',
          900: '#001F47', 950: '#001229',
        },
        neutral: {
          50: '#FAFAF8', 100: '#F2F1ED', 200: '#E6E4DE',
          300: '#D4D1C9', 400: '#B0ACA3', 500: '#8C877D',
          600: '#706B62', 700: '#57534A', 800: '#3D3A33',
          900: '#26241F', 950: '#141310',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '800' }],
        'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.25', fontWeight: '700' }],
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.06), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};
```

### 14.3 `assets/css/main.css`

```css
/* assets/css/main.css */

@import "tailwindcss";
@import "@nuxt/ui";

@layer base {
  :root {
    /* ── Primary ── */
    --color-primary-50: #FFF5F0;
    --color-primary-100: #FFE8D6;
    --color-primary-200: #FFCCAA;
    --color-primary-300: #FFA875;
    --color-primary-400: #FF8545;
    --color-primary-500: #FF6B1A;
    --color-primary-600: #E55500;
    --color-primary-700: #B84500;
    --color-primary-800: #8A3400;
    --color-primary-900: #5C2200;
    --color-primary-950: #331100;

    /* ── Secondary ── */
    --color-secondary-50: #EBF5FF;
    --color-secondary-100: #D6EAFF;
    --color-secondary-200: #ADD5FF;
    --color-secondary-300: #75B8FF;
    --color-secondary-400: #459BFF;
    --color-secondary-500: #1A7FFF;
    --color-secondary-600: #0061D6;
    --color-secondary-700: #004AA3;
    --color-secondary-800: #003575;
    --color-secondary-900: #001F47;
    --color-secondary-950: #001229;

    /* ── Semantic ── */
    --color-success-50: #F0FFF4;
    --color-success-100: #D6FFE5;
    --color-success-200: #A3F0BD;
    --color-success-300: #66D98A;
    --color-success-400: #33C25C;
    --color-success-500: #00A63E;
    --color-success-600: #008A34;
    --color-success-700: #006B28;
    --color-success-800: #004D1D;
    --color-success-900: #002E11;
    --color-success-950: #001A09;

    --color-warning-50: #FFFDF0;
    --color-warning-100: #FFF8CC;
    --color-warning-200: #FFEE99;
    --color-warning-300: #FFE066;
    --color-warning-400: #FFD133;
    --color-warning-500: #FFC400;
    --color-warning-600: #D9A600;
    --color-warning-700: #A67F00;
    --color-warning-800: #755A00;
    --color-warning-900: #473600;
    --color-warning-950: #241B00;

    --color-error-50: #FFF0F0;
    --color-error-100: #FFD6D6;
    --color-error-200: #FFADAD;
    --color-error-300: #FF7575;
    --color-error-400: #FF4545;
    --color-error-500: #E50000;
    --color-error-600: #BF0000;
    --color-error-700: #990000;
    --color-error-800: #730000;
    --color-error-900: #4D0000;
    --color-error-950: #290000;

    --color-info-50: #EBF5FF;
    --color-info-100: #D6EAFF;
    --color-info-200: #ADD5FF;
    --color-info-300: #75B8FF;
    --color-info-400: #459BFF;
    --color-info-500: #1A7FFF;
    --color-info-600: #0061D6;
    --color-info-700: #004AA3;
    --color-info-800: #003575;
    --color-info-900: #001F47;
    --color-info-950: #001229;

    /* ── Neutral ── */
    --color-neutral-50: #FAFAF8;
    --color-neutral-100: #F2F1ED;
    --color-neutral-200: #E6E4DE;
    --color-neutral-300: #D4D1C9;
    --color-neutral-400: #B0ACA3;
    --color-neutral-500: #8C877D;
    --color-neutral-600: #706B62;
    --color-neutral-700: #57534A;
    --color-neutral-800: #3D3A33;
    --color-neutral-900: #26241F;
    --color-neutral-950: #141310;

    /* ── Nuxt UI Core Tokens ── */
    --ui-primary: var(--color-primary-500);
    --ui-secondary: var(--color-secondary-500);
    --ui-success: var(--color-success-500);
    --ui-warning: var(--color-warning-500);
    --ui-error: var(--color-error-500);
    --ui-info: var(--color-info-500);

    --ui-bg: var(--color-neutral-50);
    --ui-bg-elevated: #ffffff;
    --ui-bg-muted: var(--color-neutral-100);

    --ui-text: var(--color-neutral-900);
    --ui-text-muted: var(--color-neutral-500);
    --ui-text-dimmed: var(--color-neutral-400);

    --ui-border: var(--color-neutral-200);
    --ui-ring: var(--color-primary-500);

    /* ── Animation Tokens ── */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark {
    --ui-bg: #141310;
    --ui-bg-elevated: #1c1a16;
    --ui-bg-muted: #26241F;

    --ui-text: #FAFAF8;
    --ui-text-muted: #8C877D;
    --ui-text-dimmed: #706B62;

    --ui-border: #3D3A33;
    --ui-ring: #FF8545;
  }

  /* ── Focus Ring ── */
  *:focus-visible {
    outline: none;
    ring: 2px solid var(--ui-ring);
    ring-offset: 2px;
  }

  /* ── Reduced Motion ── */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer components {
  /* ── Page Header ── */
  .page-header {
    @apply flex flex-col gap-2 mb-6;
  }
  .page-header h1 {
    @apply text-h1 text-ui-text;
  }
  .page-header p {
    @apply text-body text-ui-text-muted;
  }

  /* ── Stat Card ── */
  .stat-card {
    @apply bg-ui-bg-elevated rounded-lg ring-1 ring-ui-border p-4 sm:p-5
           transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5;
  }
  .stat-card__label {
    @apply text-caption text-ui-text-muted font-medium uppercase tracking-wide;
  }
  .stat-card__value {
    @apply text-h2 text-ui-text font-bold mt-1;
  }
  .stat-card__trend {
    @apply text-body-sm mt-1 flex items-center gap-1;
  }

  /* ── Quick Actions ── */
  .quick-actions {
    @apply flex flex-wrap gap-2;
  }

  /* ── Filter Bar ── */
  .filter-bar {
    @apply flex flex-col sm:flex-row gap-3 p-4 bg-ui-bg-elevated
           rounded-lg ring-1 ring-ui-border mb-4;
  }

  /* ── Status Badge Presets ── */
  .status-active    { @apply bg-success-100 text-success-700; }
  .status-rented    { @apply bg-primary-100 text-primary-700; }
  .status-maintenance { @apply bg-warning-100 text-warning-700; }
  .status-inactive  { @apply bg-neutral-100 text-neutral-600; }
  .status-broken    { @apply bg-error-100 text-error-700; }

  /* ── Shimmer Skeleton ── */
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .skeleton {
    @apply rounded-lg;
    background: linear-gradient(90deg, var(--ui-bg-muted) 25%, var(--ui-border) 50%, var(--ui-bg-muted) 75%);
    background-size: 200% 100%;
    animation: shimmer 2s ease-in-out infinite;
  }
}
```

---

## 15. Component Pattern Library

### 15.1 Data Table Pattern

```vue
<template>
  <div>
    <!-- Filter bar -->
    <div class="filter-bar">
      <UInput v-model="search" placeholder="Cari unit..." icon="i-lucide-search" class="flex-1" />
      <USelect v-model="filterStatus" :options="statusOptions" placeholder="Status" />
      <USelect v-model="filterBranch" :options="branchOptions" placeholder="Cabang" />
      <UButton icon="i-lucide-download" variant="outline">Export</UButton>
    </div>

    <!-- Table / Card List -->
    <UTable
      :rows="filteredUnits"
      :columns="columns"
      :loading="loading"
      :empty-state="{ icon: 'i-lucide-car', label: 'Tidak ada unit ditemukan' }"
      sortable
      @select="onSelect"
    >
      <template #status-data="{ row }">
        <UBadge :class="statusClass(row.status)" variant="soft">
          {{ row.status }}
        </UBadge>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="rowActions(row)">
          <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="xs" />
        </UDropdown>
      </template>
    </UTable>

    <div class="flex justify-between items-center mt-4">
      <span class="text-body-sm text-ui-text-muted">
        Menampilkan {{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }}
      </span>
      <UPagination v-model="page" :total="pagination.total" :page-count="pagination.perPage" />
    </div>
  </div>
</template>
```

### 15.2 Stat Card Pattern

```vue
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <UCard v-for="stat in stats" :key="stat.label">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-caption text-ui-text-muted font-medium uppercase tracking-wide">
            {{ stat.label }}
          </p>
          <p class="text-h2 text-ui-text font-bold mt-1">
            {{ stat.value }}
          </p>
          <p v-if="stat.trend" :class="stat.trend > 0 ? 'text-success-600' : 'text-error-600'"
             class="text-body-sm mt-1 flex items-center gap-1">
            <UIcon :name="stat.trend > 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" />
            {{ Math.abs(stat.trend) }}% dari kemarin
          </p>
        </div>
        <div class="p-3 rounded-lg" :class="stat.iconBg">
          <UIcon :name="stat.icon" class="size-6" :class="stat.iconColor" />
        </div>
      </div>
    </UCard>
  </div>
</template>
```

### 15.3 Form Pattern

```vue
<template>
  <UForm :schema="schema" :state="form" @submit="onSubmit">
    <UCard>
      <template #header>
        <h3 class="text-h3">Form Sewa Unit</h3>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Cabang" name="branch" required>
          <USelect v-model="form.branch" :options="branches" placeholder="Pilih cabang" />
        </UFormGroup>

        <UFormGroup label="Unit" name="unit" required>
          <UInputMenu v-model="form.unit" :items="availableUnits" placeholder="Cari unit..." />
        </UFormGroup>

        <UFormGroup label="Nama Customer" name="customerName" required>
          <UInput v-model="form.customerName" placeholder="Nama orang tua / wali" />
        </UFormGroup>

        <UFormGroup label="Durasi (menit)" name="duration" required hint="Minimal 15 menit">
          <UInput v-model.number="form.duration" type="number" min="15" step="15" />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="outline" @click="reset">Batal</UButton>
          <UButton type="submit" :loading="submitting">Mulai Sewa</UButton>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
```

---

## 16. Implementation Checklist

- [ ] `app.config.ts` — Nuxt UI theme overrides
- [ ] `tailwind.config.ts` — extended colors, fonts, shadows
- [ ] `assets/css/main.css` — CSS custom properties, dark mode, focus ring, animations
- [ ] `@nuxtjs/color-mode` — dark/light/system toggle
- [ ] `@nuxt/icon` — Lucide icon set
- [ ] `@nuxt/fonts` — Plus Jakarta Sans + JetBrains Mono
- [ ] `UContainer` wrapper di semua layout
- [ ] Skip-to-content link
- [ ] Keyboard shortcut handler (`Cmd+K`, `Esc`)
- [ ] `prefers-reduced-motion` compliance
- [ ] Color contrast audit (semua kombinasi teks ≥4.5:1)
- [ ] Mobile-first responsive testing pada 400px, 640px, 768px, 1024px, 1280px
- [ ] Dark mode visual regression test
- [ ] Screen reader audit (NVDA / VoiceOver)
