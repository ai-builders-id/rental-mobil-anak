/* ============================================================
   Rental Mobil Anak — Mock Data Layer  (window.RMA)
   ============================================================ */
(function () {
  // Seeded PRNG for stable data across reloads
  let _s = 20260607;
  const rnd = () => { _s = (_s * 1103515245 + 12345) & 0x7fffffff; return _s / 0x7fffffff; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const int = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;
  const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
  const rupiahShort = (n) => {
    if (n >= 1e9) return "Rp" + (n / 1e9).toFixed(1).replace(".0", "") + "M";
    if (n >= 1e6) return "Rp" + (n / 1e6).toFixed(1).replace(".0", "") + "jt";
    if (n >= 1e3) return "Rp" + Math.round(n / 1e3) + "rb";
    return "Rp" + n;
  };

  // ---- Unit types (toy car models) ----
  const UNIT_TYPES = [
    { key: "jeep",    label: "Jeep Off-road", emoji: "🚙", color: "#FF6B1A" },
    { key: "sport",   label: "Mobil Sport",   emoji: "🏎️", color: "#E50000" },
    { key: "suv",     label: "SUV Mewah",     emoji: "🚐", color: "#1A7FFF" },
    { key: "classic", label: "Klasik Antik",  emoji: "🚗", color: "#A67F00" },
    { key: "bus",     label: "Bus Sekolah",   emoji: "🚌", color: "#FFC400" },
    { key: "motor",   label: "Motor Mini",    emoji: "🏍️", color: "#00A63E" },
    { key: "truck",   label: "Pickup Truck",  emoji: "🛻", color: "#706B62" },
  ];
  const COLORS = ["Merah", "Biru", "Kuning", "Hijau", "Putih", "Hitam", "Pink", "Oranye"];

  // ---- Status meta ----
  const STATUS = {
    available:   { label: "Tersedia",  badge: "success", dot: "#00A63E", color: "#00A63E" },
    rented:      { label: "Disewa",    badge: "primary", dot: "#FF6B1A", color: "#FF6B1A" },
    maintenance: { label: "Perbaikan", badge: "warning", dot: "#FFC400", color: "#D9A600" },
    broken:      { label: "Rusak",     badge: "error",   dot: "#E50000", color: "#E50000" },
    offline:     { label: "Offline",   badge: "neutral", dot: "#8C877D", color: "#8C877D" },
  };

  // ---- Branches (positioned on a stylized Indonesia map, 1000x470 viewBox) ----
  const BRANCHES = [
    { code: "MDN-001", name: "Sun Plaza Medan",        city: "Medan",       prov: "Sumatera Utara",  x: 138, y: 92,  cap: 180 },
    { code: "PDG-002", name: "Plaza Andalas Padang",   city: "Padang",      prov: "Sumatera Barat",  x: 118, y: 196, cap: 120 },
    { code: "PLG-003", name: "Palembang Icon",         city: "Palembang",   prov: "Sumatera Selatan",x: 232, y: 250, cap: 150 },
    { code: "JKT-001", name: "Grand Indonesia",        city: "Jakarta",     prov: "DKI Jakarta",     x: 318, y: 300, cap: 240 },
    { code: "JKT-004", name: "Mall Kelapa Gading",     city: "Jakarta",     prov: "DKI Jakarta",     x: 330, y: 286, cap: 200 },
    { code: "BDO-001", name: "Paris Van Java",         city: "Bandung",     prov: "Jawa Barat",      x: 344, y: 322, cap: 160 },
    { code: "SMG-002", name: "Paragon Semarang",       city: "Semarang",    prov: "Jawa Tengah",     x: 392, y: 312, cap: 130 },
    { code: "SBY-001", name: "Tunjungan Plaza",        city: "Surabaya",    prov: "Jawa Timur",      x: 452, y: 322, cap: 210 },
    { code: "DPS-001", name: "Beachwalk Bali",         city: "Denpasar",    prov: "Bali",            x: 512, y: 352, cap: 140 },
    { code: "PNK-001", name: "Ayani Megamall",         city: "Pontianak",   prov: "Kalimantan Barat",x: 436, y: 206, cap: 90  },
    { code: "BPN-002", name: "Pentacity Balikpapan",   city: "Balikpapan",  prov: "Kalimantan Timur",x: 566, y: 214, cap: 110 },
    { code: "BJM-003", name: "Duta Mall Banjarmasin",  city: "Banjarmasin", prov: "Kalimantan Selatan",x:524, y: 256, cap: 95  },
    { code: "MKS-001", name: "Trans Studio Makassar",  city: "Makassar",    prov: "Sulawesi Selatan",x: 624, y: 296, cap: 170 },
    { code: "MDC-002", name: "Manado Town Square",     city: "Manado",      prov: "Sulawesi Utara",  x: 686, y: 178, cap: 80  },
    { code: "MTR-001", name: "Lombok Epicentrum",      city: "Mataram",     prov: "NTB",             x: 548, y: 356, cap: 70  },
    { code: "AMB-001", name: "Maluku City Mall",       city: "Ambon",       prov: "Maluku",          x: 766, y: 296, cap: 60  },
    { code: "JYP-001", name: "Jayapura Mall",          city: "Jayapura",    prov: "Papua",           x: 906, y: 250, cap: 65  },
  ];
  BRANCHES.forEach((b, i) => {
    const total = b.cap - int(0, 18);
    const rented = int(Math.floor(total * 0.15), Math.floor(total * 0.45));
    const maintenance = int(0, 5);
    const broken = rnd() > 0.7 ? 1 : 0;
    const available = total - rented - maintenance - broken;
    b.id = "br_" + i;
    b.total = total; b.rented = rented; b.maintenance = maintenance; b.broken = broken; b.available = available;
    b.util = Math.round((rented / total) * 100);
    b.revenue = rented * int(45000, 95000) + int(200000, 900000);
    b.open = !(rnd() > 0.92);
    b.todayTxn = int(40, 220);
  });

  // ---- Units (generate a rich set) ----
  const FIRST = ["Budi", "Ani", "Siti", "Dodi", "Rina", "Adi", "Maya", "Joko", "Putri", "Bayu", "Dewi", "Eko", "Fitri", "Gita", "Hadi", "Indah", "Citra", "Wawan"];
  const units = [];
  let uid = 1;
  for (const b of BRANCHES) {
    const n = Math.min(b.total, 9) + 3;
    for (let k = 0; k < n; k++) {
      const t = pick(UNIT_TYPES);
      let st = "available";
      const r = rnd();
      if (r < 0.34) st = "rented"; else if (r < 0.42) st = "maintenance";
      else if (r < 0.45) st = "broken"; else if (r < 0.48) st = "offline";
      units.push({
        id: "u_" + uid,
        serial: "TK-" + String(uid).padStart(4, "0"),
        type: t.key, typeLabel: t.label, emoji: t.emoji, typeColor: t.color,
        color: pick(COLORS), year: int(2022, 2026),
        status: st, branchId: b.id, branchName: b.name, branchCity: b.city,
        rack: pick(["A", "B", "C", "D"]) + "-" + int(1, 24),
        battery: st === "offline" ? int(0, 8) : int(28, 100),
        totalRentals: int(40, 2400),
        lastService: `2026-${String(int(3, 6)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
        gps: "GPS-" + int(10000, 99999), rfid: "RF-" + int(100000, 999999),
      });
      uid++;
    }
  }

  // ---- Active rentals (for branch dashboard + sewa) at JKT-001 ----
  const jkt = BRANCHES.find((b) => b.code === "JKT-001");
  const now = Date.now();
  const activeRentals = [];
  const durOpts = [15, 30, 45];
  const priceFor = (d) => ({ 15: 20000, 30: 30000, 45: 40000 }[d]);
  const jktUnits = units.filter((u) => u.branchId === jkt.id);
  for (let i = 0; i < 6; i++) {
    const dur = pick(durOpts);
    const startedAgo = int(2, dur + 4); // minutes ago (some overtime)
    const u = jktUnits[i] || units[i];
    u.status = "rented";
    activeRentals.push({
      id: "r_" + i,
      code: `R-20260607-JKT-${String(i + 1).padStart(4, "0")}`,
      unit: u, customer: pick(FIRST), child: pick(["Andi", "Keenan", "Zaki", "Nayla", "Bila", "Reno"]),
      phone: "0812" + int(10000000, 99999999),
      duration: dur, basePrice: priceFor(dur),
      startedAt: now - startedAgo * 60000,
      expectedEnd: now - startedAgo * 60000 + dur * 60000,
    });
  }

  // ---- Recent transactions (live feed) ----
  const recentTxn = [];
  for (let i = 0; i < 14; i++) {
    const b = pick(BRANCHES);
    const u = pick(units);
    const dur = pick(durOpts);
    const m = int(0, 58);
    recentTxn.push({
      id: "t_" + i, time: `${14 - Math.floor(i / 4)}:${String(58 - i * 3 < 0 ? 58 - i * 3 + 60 : 58 - i * 3).padStart(2, "0")}`,
      branch: b.name, branchCity: b.city, unit: u.serial, customer: pick(FIRST),
      duration: dur, amount: priceFor(dur), method: pick(["QRIS", "Tunai", "GoPay"]),
    });
  }

  // ---- Trends ----
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const revenueTrend = days.map((d, i) => ({
    label: d, value: int(28, 42) * 1e6 + (i >= 5 ? int(8, 16) * 1e6 : 0), // weekend spike
  }));
  const hours = [];
  for (let h = 8; h <= 20; h++) {
    let base = 30 + Math.sin((h - 8) / 12 * Math.PI) * 55;
    if (h >= 13 && h <= 15) base += 15;
    hours.push({ label: h + ":00", value: Math.max(8, Math.min(95, Math.round(base + int(-6, 6)))) });
  }
  const topBranches = [...BRANCHES].sort((a, b) => b.revenue - a.revenue).slice(0, 6)
    .map((b) => ({ name: b.name, city: b.city, value: b.revenue }));
  const statusBreakdown = [
    { key: "available", label: "Tersedia", value: 62, color: "#00A63E" },
    { key: "rented", label: "Disewa", value: 26, color: "#FF6B1A" },
    { key: "maintenance", label: "Perbaikan", value: 9, color: "#FFC400" },
    { key: "broken", label: "Rusak", value: 3, color: "#E50000" },
  ];

  // ---- Tracking: units on a venue floor map (Grand Indonesia) ----
  const ZONES = [
    { id: "A", name: "Atrium Utama", x: 90,  y: 90,  w: 250, h: 160 },
    { id: "B", name: "Zona Timur",   x: 360, y: 90,  w: 200, h: 160 },
    { id: "C", name: "Plaza Selatan",x: 90,  y: 270, w: 470, h: 150 },
  ];
  const trackUnits = [];
  for (let i = 0; i < 22; i++) {
    const z = pick(ZONES);
    const r = rnd();
    let st = "rented";
    if (r > 0.62) st = "available"; if (r > 0.93) st = "maintenance";
    trackUnits.push({
      id: "tk_" + i, serial: "TK-" + String(int(1, 999)).padStart(4, "0"),
      x: z.x + 20 + rnd() * (z.w - 40), y: z.y + 20 + rnd() * (z.h - 40),
      vx: (rnd() - 0.5) * 0.5, vy: (rnd() - 0.5) * 0.5,
      status: st, zone: z.id, battery: int(20, 100),
      outside: false,
    });
  }
  // one unit near the geofence edge for the alert narrative
  trackUnits[0].x = 600; trackUnits[0].y = 60; trackUnits[0].outside = true; trackUnits[0].status = "rented";

  const alertLog = [
    { time: "14:32", unit: "TK-0188", type: "exit",   text: "keluar dari zona geofence aman", sev: "error" },
    { time: "14:28", unit: "TK-0015", type: "enter",  text: "berpindah dari Zona B ke Zona A", sev: "info" },
    { time: "14:25", unit: "TK-0142", type: "warn",   text: "mendekati batas geofence", sev: "warning" },
    { time: "14:20", unit: "TK-0093", type: "battery",text: "baterai GPS rendah (8%)", sev: "warning" },
    { time: "14:12", unit: "TK-0207", type: "enter",  text: "memasuki Zona C (Plaza Selatan)", sev: "info" },
    { time: "14:05", unit: "TK-0031", type: "offline",text: "tidak mengirim sinyal > 1 jam", sev: "neutral" },
  ];

  // ---- Reports transactions table ----
  const reportTxn = [];
  for (let i = 0; i < 24; i++) {
    const b = pick(BRANCHES); const u = pick(units); const dur = pick(durOpts);
    reportTxn.push({
      date: "07/06", branch: b.name, branchCity: b.city, unit: u.serial,
      customer: pick(FIRST), duration: dur, amount: priceFor(dur),
      method: pick(["QRIS", "Tunai", "GoPay"]), operator: pick(["Sari", "Ahmad", "Dewi", "Operator"]),
    });
  }

  // ---- National KPIs ----
  const totalUnits = 40000;
  const kpi = {
    rentedNational: BRANCHES.reduce((s, b) => s + b.rented, 0) * 130 + 9800,
    revenueToday: BRANCHES.reduce((s, b) => s + b.revenue, 0) * 95,
    branchesOnline: BRANCHES.filter((b) => b.open).length * 14 + 6,
    branchesTotal: 250,
    totalUnits,
    avgUtil: 72,
    txnToday: 28420,
  };

  window.RMA = {
    rnd, pick, int, rupiah, rupiahShort,
    UNIT_TYPES, COLORS, STATUS, BRANCHES, units, activeRentals,
    recentTxn, revenueTrend, hours, topBranches, statusBreakdown,
    ZONES, trackUnits, alertLog, reportTxn, kpi, priceFor, durOpts,
  };
})();
