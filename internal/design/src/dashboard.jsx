/* ============================================================
   Dashboards — Admin Pusat (national) & Cabang (branch)
   ============================================================ */
function useTicker(ms = 1000) {
  const [, set] = useState(0);
  useEffect(() => { const id = setInterval(() => set((n) => n + 1), ms); return () => clearInterval(id); }, [ms]);
  return Date.now();
}
function fmtClock(ms) {
  const neg = ms < 0; ms = Math.abs(ms);
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60);
  return (neg ? "+" : "") + String(m).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

function PageHeader({ title, sub, crumbs, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "1.4rem", flexWrap: "wrap" }}>
      <div>
        {crumbs && (
          <div style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".78rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: ".4rem" }}>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Icon name="ChevronRight" size={13} />}
                <span style={{ color: i === crumbs.length - 1 ? "var(--text)" : "var(--text-muted)" }}>{c}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, margin: 0, letterSpacing: "-.025em" }}>{title}</h1>
        {sub && <p style={{ color: "var(--text-muted)", margin: ".3rem 0 0", fontSize: ".92rem" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function StatCard({ icon, color = "var(--primary-500)", bg = "var(--primary-50)", label, value, trend, sub, delay = 0 }) {
  return (
    <Card className="stat-card anim-fade-up" style={{ animationDelay: delay + "ms" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
          <div className="tnum" style={{ fontSize: "1.85rem", fontWeight: 800, marginTop: ".35rem", letterSpacing: "-.02em", lineHeight: 1 }}>{value}</div>
          {(trend != null || sub) && (
            <div style={{ display: "flex", alignItems: "center", gap: ".3rem", marginTop: ".5rem", fontSize: ".8rem", fontWeight: 600 }}>
              {trend != null && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: ".15rem", color: trend >= 0 ? "var(--success-600)" : "var(--error-600)" }}>
                  <Icon name={trend >= 0 ? "TrendingUp" : "TrendingDown"} size={14} />{Math.abs(trend)}%
                </span>
              )}
              <span style={{ color: "var(--text-dimmed)", fontWeight: 500 }}>{sub}</span>
            </div>
          )}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, color, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name={icon} size={22} />
        </div>
      </div>
    </Card>
  );
}

const iconBgDark = (v) => v; // bg tokens already adapt via card; using soft tints

/* ---------------- Admin Pusat Dashboard ---------------- */
function AdminDashboard({ setView }) {
  const [sel, setSel] = useState("br_3");
  const [scope, setScope] = useState("all");
  const k = RMA.kpi;
  const branchOpts = [{ value: "all", label: "Semua Cabang" }, ...RMA.BRANCHES.map((b) => ({ value: b.id, label: b.name }))];
  return (
    <div style={{ padding: "1.6rem 1.8rem 3rem", maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader title="Dashboard Nasional" sub="Ringkasan operasional 250 cabang secara real-time."
        right={<div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
          <Select value={scope} onChange={(e) => setScope(e.target.value)} options={branchOpts} style={{ width: 200 }} />
          <Button variant="outline" icon="Calendar">Hari Ini</Button>
        </div>} />

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) 1.25fr", gap: "1rem", marginBottom: "1rem" }}>
        <StatCard icon="Car" label="Unit Disewa" value={k.rentedNational.toLocaleString("id-ID")} trend={12} sub="vs kemarin" color="var(--primary-600)" bg="var(--primary-50)" delay={0} />
        <StatCard icon="Banknote" label="Pendapatan Hari Ini" value={RMA.rupiahShort(k.revenueToday)} trend={8} sub="vs kemarin" color="var(--success-600)" bg="var(--success-50)" delay={50} />
        <StatCard icon="Store" label="Cabang Online" value={`${k.branchesOnline}/${k.branchesTotal}`} sub="98% beroperasi" color="var(--secondary-600)" bg="var(--secondary-50)" delay={100} />
        <StatCard icon="Receipt" label="Transaksi Hari Ini" value={k.txnToday.toLocaleString("id-ID")} trend={5} sub="vs kemarin" color="var(--warning-700)" bg="var(--warning-50)" delay={150} />
        <Card className="anim-fade-up" style={{ animationDelay: "200ms", display: "flex", flexDirection: "column", gap: ".55rem", justifyContent: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em", display: "flex", alignItems: "center", gap: ".35rem" }}><Icon name="Zap" size={14} /> Aksi Cepat</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
            <Button variant="primary" size="sm" icon="Plus" onClick={() => setView("sewa")}>Sewa</Button>
            <Button variant="outline" size="sm" icon="Car" onClick={() => setView("units")}>Unit</Button>
            <Button variant="outline" size="sm" icon="Map" onClick={() => setView("tracking")}>Tracking</Button>
            <Button variant="outline" size="sm" icon="FileText" onClick={() => setView("laporan")}>Laporan</Button>
          </div>
        </Card>
      </div>

      {/* Map + revenue */}
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <Card>
          <CardHead title="Peta Operasional Nasional" sub="250 cabang · klik penanda untuk detail" icon="MapPinned"
            right={<Badge color="success" dot="var(--success-500)">218 aktif</Badge>} />
          <NationalMap branches={RMA.BRANCHES} selected={sel} onSelect={setSel} />
        </Card>
        <Card>
          <CardHead title="Pendapatan 7 Hari" sub="Tren mingguan nasional" icon="TrendingUp" />
          <AreaLine data={RMA.revenueTrend} height={170} fmt={(v) => RMA.rupiahShort(v)} />
          <div className="divider" style={{ margin: "1rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: ".72rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL MINGGU INI</div><div className="tnum" style={{ fontSize: "1.3rem", fontWeight: 800 }}>{RMA.rupiahShort(RMA.revenueTrend.reduce((s, d) => s + d.value, 0))}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: ".72rem", color: "var(--text-muted)", fontWeight: 600 }}>RATA-RATA / HARI</div><div className="tnum" style={{ fontSize: "1.3rem", fontWeight: 800 }}>{RMA.rupiahShort(Math.round(RMA.revenueTrend.reduce((s, d) => s + d.value, 0) / 7))}</div></div>
          </div>
        </Card>
      </div>

      {/* Utilization + status + transactions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "1rem" }}>
        <Card>
          <CardHead title="Utilisasi per Jam" sub="Rata-rata nasional · 08:00–20:00" icon="Activity" />
          <Bars data={RMA.hours} height={165} />
          <div style={{ display: "flex", gap: "1.2rem", marginTop: ".6rem" }}>
            <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>Rata-rata <b className="mono" style={{ color: "var(--text)" }}>72%</b></span>
            <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>Puncak <b className="mono" style={{ color: "var(--primary-600)" }}>14:00 · 89%</b></span>
          </div>
        </Card>
        <Card>
          <CardHead title="Status Unit" sub="Distribusi 40.000 unit" icon="PieChart" />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Donut data={RMA.statusBreakdown} size={140} center={{ value: "40rb", label: "Total Unit" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: ".55rem", flex: 1 }}>
              {RMA.statusBreakdown.map((s) => (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ fontSize: ".82rem", flex: 1 }}>{s.label}</span>
                  <span className="mono" style={{ fontSize: ".82rem", fontWeight: 700 }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <CardHead title="Transaksi Terbaru" icon="Receipt"
            right={<button onClick={() => setView("laporan")} style={{ background: "none", border: "none", color: "var(--primary-600)", fontWeight: 600, fontSize: ".8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".2rem" }}>Lihat Semua <Icon name="ArrowRight" size={14} /></button>} />
          <div style={{ display: "flex", flexDirection: "column", gap: ".1rem", flex: 1 }}>
            {RMA.recentTxn.slice(0, 6).map((t, i) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: ".7rem", padding: ".5rem .2rem", borderBottom: i < 5 ? "1px solid var(--border-muted)" : "none" }}>
                <span className="mono" style={{ fontSize: ".75rem", color: "var(--text-dimmed)", width: 38 }}>{t.time}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-muted)", display: "grid", placeItems: "center", fontSize: ".9rem" }}>{RMA.UNIT_TYPES.find(x => x) ? "🚗" : ""}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: ".82rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.branchCity} · <span className="mono">{t.unit}</span></div>
                  <div style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{t.customer} · {t.duration} menit</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: ".82rem", fontWeight: 700 }}>{RMA.rupiahShort(t.amount)}</div>
                  <Badge color={t.method === "Tunai" ? "neutral" : "info"} className="">{t.method}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Branch Dashboard ---------------- */
function BranchDashboard({ role, setView }) {
  const now = useTicker(1000);
  const branch = RMA.BRANCHES.find((b) => b.code === "JKT-001");
  const rentals = RMA.activeRentals;
  const totalDenda = rentals.reduce((s, r) => { const late = now - r.expectedEnd; return s + (late > 0 ? Math.floor(late / 60000) * 2000 : 0); }, 0);
  const statusRows = [
    { label: "Tersedia", n: branch.available, color: "var(--success-500)", badge: "success" },
    { label: "Disewa", n: branch.rented, color: "var(--primary-500)", badge: "primary" },
    { label: "Perbaikan", n: branch.maintenance, color: "var(--warning-500)", badge: "warning" },
    { label: "Rusak", n: branch.broken, color: "var(--error-500)", badge: "error" },
  ];
  return (
    <div style={{ padding: "1.6rem 1.8rem 3rem", maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader crumbs={["Cabang", "Jawa", branch.name]} title="Dashboard Cabang"
        sub={`${branch.name} · ${branch.city}`}
        right={<div style={{ display: "flex", gap: ".6rem" }}>
          <Badge color="success" dot="var(--success-500)">Cabang Buka</Badge>
          <Button variant="primary" icon="Plus" onClick={() => setView("sewa")}>Mulai Sewa</Button>
        </div>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1rem" }}>
        <StatCard icon="Car" label="Unit Aktif" value={`${branch.available + branch.rented}/${branch.total}`} sub={`${branch.available} siap disewa`} color="var(--primary-600)" bg="var(--primary-50)" />
        <StatCard icon="Banknote" label="Pendapatan Hari Ini" value={RMA.rupiahShort(branch.revenue)} trend={14} sub="vs kemarin" color="var(--success-600)" bg="var(--success-50)" delay={50} />
        <StatCard icon="Timer" label="Sewa Aktif" value={rentals.length} sub="sedang berjalan" color="var(--secondary-600)" bg="var(--secondary-50)" delay={100} />
        <StatCard icon="Gauge" label="Utilisasi" value={branch.util + "%"} trend={3} sub="hari ini" color="var(--warning-700)" bg="var(--warning-50)" delay={150} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1rem", marginBottom: "1rem" }}>
        <Card>
          <CardHead title="Unit per Status" icon="LayoutGrid" />
          <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
            {statusRows.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                <span style={{ flex: 1, fontSize: ".88rem", fontWeight: 600 }}>{s.label}</span>
                <div style={{ width: 120, height: 8, background: "var(--bg-muted)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${(s.n / branch.total) * 100}%`, height: "100%", background: s.color, borderRadius: 99 }} />
                </div>
                <span className="mono" style={{ width: 30, textAlign: "right", fontWeight: 700, fontSize: ".88rem" }}>{s.n}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Pendapatan per Jam" sub="Hari ini · puncak 14:00" icon="BarChart3" />
          <Bars data={RMA.hours.map((h) => ({ ...h, value: Math.round(h.value * 6800) }))} height={150} fmt={(v) => RMA.rupiahShort(v)} color="#00A63E" />
        </Card>
      </div>

      {/* Live rentals table */}
      <Card pad={false} style={{ overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <CardHead title="Unit Sedang Disewa" sub="Timer countdown real-time" icon="Timer" right={null} />
          <Badge color="neutral"><span className="live-dot" style={{ width: 7, height: 7 }} /> Auto-refresh 1s</Badge>
        </div>
        <table className="tbl">
          <thead><tr><th>Unit</th><th>Customer</th><th>Mulai</th><th>Durasi</th><th>Sisa Waktu</th><th style={{ textAlign: "right" }}>Biaya</th><th></th></tr></thead>
          <tbody>
            {rentals.map((r) => {
              const remain = r.expectedEnd - now;
              const late = remain < 0;
              const warn = !late && remain < 5 * 60000;
              const denda = late ? Math.floor(-remain / 60000) * 2000 : 0;
              return (
                <tr key={r.id} style={{ background: late ? "var(--error-50)" : warn ? "var(--warning-50)" : "transparent" }}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}><span style={{ fontSize: "1.1rem" }}>{r.unit.emoji}</span><div><div className="mono" style={{ fontWeight: 700, fontSize: ".82rem" }}>{r.unit.serial}</div><div style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{r.unit.typeLabel}</div></div></div></td>
                  <td>{r.customer} <span style={{ color: "var(--text-dimmed)", fontSize: ".78rem" }}>· anak {r.child}</span></td>
                  <td className="mono" style={{ color: "var(--text-muted)" }}>{new Date(r.startedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{r.duration} mnt</td>
                  <td>
                    <span className="mono" style={{ fontWeight: 800, fontSize: "1rem", color: late ? "var(--error-600)" : warn ? "var(--warning-700)" : "var(--success-600)", display: "inline-flex", alignItems: "center", gap: ".35rem" }}>
                      {late && <Icon name="TriangleAlert" size={15} />}{warn && <Icon name="Clock" size={15} />}
                      {fmtClock(remain)}
                    </span>
                    {late && <span style={{ display: "block", fontSize: ".7rem", color: "var(--error-600)", fontWeight: 600 }}>+ denda {RMA.rupiah(denda)}</span>}
                  </td>
                  <td className="mono" style={{ textAlign: "right", fontWeight: 700 }}>{RMA.rupiah(r.basePrice + denda)}</td>
                  <td style={{ textAlign: "right" }}><Button variant={late ? "danger" : "outline"} size="sm">{late ? "Tagih & Selesai" : "Selesai"}</Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "1rem" }}>
        <Card>
          <CardHead title="Aksi Cepat" icon="Zap" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
            <Button variant="primary" icon="Plus" onClick={() => setView("sewa")}>Mulai Sewa</Button>
            <Button variant="outline" icon="CircleCheck" onClick={() => setView("units")}>Cek Unit Ready</Button>
            <Button variant="outline" icon="Map" onClick={() => setView("tracking")}>Tracking</Button>
            <Button variant="outline" icon="FileText" onClick={() => setView("laporan")}>Laporan Shift</Button>
          </div>
        </Card>
        <Card>
          <CardHead title="Notifikasi Cabang" icon="Bell" right={<Badge color="error">2 baru</Badge>} />
          <div style={{ display: "flex", flexDirection: "column", gap: ".55rem" }}>
            {[
              { icon: "TriangleAlert", c: "warning", t: "TK-0008 melebihi durasi sewa", s: "denda berjalan" },
              { icon: "PackageOpen", c: "warning", t: "Stok unit tersedia < 10", s: "pertimbangkan request tambahan" },
              { icon: "CircleCheck", c: "success", t: "Maintenance TK-0005 selesai", s: "siap dioperasikan" },
              { icon: "Info", c: "info", t: "Shift sore dimulai 16:00", s: "operator: Mbak Sari" },
            ].map((n, i) => {
              const cm = { warning: ["var(--warning-50)", "var(--warning-600)"], success: ["var(--success-50)", "var(--success-600)"], info: ["var(--secondary-50)", "var(--secondary-600)"] }[n.c];
              return (
                <div key={i} style={{ display: "flex", gap: ".6rem", alignItems: "center", padding: ".6rem .7rem", borderRadius: "var(--radius)", background: "var(--bg-muted)" }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: cm[0], color: cm[1], display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={n.icon} size={16} /></span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: ".84rem", fontWeight: 600 }}>{n.t}</div><div style={{ fontSize: ".74rem", color: "var(--text-muted)" }}>{n.s}</div></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Dashboard({ role, setView }) {
  return role === "super_admin" ? <AdminDashboard setView={setView} /> : <BranchDashboard role={role} setView={setView} />;
}

Object.assign(window, { useTicker, fmtClock, PageHeader, StatCard, Dashboard, AdminDashboard, BranchDashboard });
