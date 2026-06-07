/* ============================================================
   Manajemen Unit — list, filter, detail slideover
   ============================================================ */
function UnitPhoto({ unit, height = 180 }) {
  return (
    <div style={{ height, borderRadius: "var(--radius)", overflow: "hidden", position: "relative", background: `repeating-linear-gradient(135deg, var(--bg-muted), var(--bg-muted) 11px, var(--border-muted) 11px, var(--border-muted) 22px)`, display: "grid", placeItems: "center", border: "1px solid var(--border)" }}>
      <div style={{ fontSize: height * 0.42, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.18))" }}>{unit.emoji}</div>
      <div className="mono" style={{ position: "absolute", bottom: 8, left: 8, fontSize: ".66rem", color: "var(--text-dimmed)", background: "var(--bg-elevated)", padding: ".2rem .45rem", borderRadius: 5, border: "1px solid var(--border)" }}>foto unit · {unit.serial}</div>
    </div>
  );
}

function UnitDetail({ unit, onClose }) {
  const hist = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    date: `0${5 + (i % 2)}/06`, cust: RMA.pick(["Budi", "Ani", "Siti", "Dewi", "Joko"]),
    dur: RMA.pick([15, 30, 45]), amt: RMA.pick([20000, 30000, 40000]),
  })), [unit.id]);
  const svc = [{ date: "01/06", type: "Servis Rutin", who: "Teknisi A" }, { date: "15/05", type: "Ganti Baterai", who: "Teknisi B" }];
  const fields = [
    ["Kode Unit", unit.serial, true], ["Tipe", unit.typeLabel], ["Warna", unit.color],
    ["Tahun", unit.year], ["Cabang", unit.branchName], ["Lokasi Rak", unit.rack, true],
    ["ID GPS", unit.gps, true], ["ID RFID", unit.rfid, true],
  ];
  return (
    <Overlay onClose={onClose}>
      <div className="slideover scroll-area" style={{ overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.25rem", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg-elevated)", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <span style={{ fontSize: "1.4rem" }}>{unit.emoji}</span>
            <div><div style={{ fontWeight: 800, fontSize: "1.05rem" }} className="mono">{unit.serial}</div><div style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>{unit.typeLabel}</div></div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: "2.2rem", padding: 0 }}><Icon name="X" size={18} /></button>
        </div>
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <UnitPhoto unit={unit} />
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <StatusBadge status={unit.status} />
            <Badge color="neutral"><Icon name="BatteryMedium" size={13} /> Baterai {unit.battery}%</Badge>
            <Badge color="info"><Icon name="Repeat" size={13} /> {unit.totalRentals.toLocaleString("id-ID")}× disewa</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".25rem .75rem" }}>
            {fields.map(([k, v, mono]) => (
              <div key={k} style={{ padding: ".5rem 0", borderBottom: "1px solid var(--border-muted)" }}>
                <div style={{ fontSize: ".7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em" }}>{k}</div>
                <div className={mono ? "mono" : ""} style={{ fontSize: ".88rem", fontWeight: 600, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".4rem" }}><Icon name="History" size={16} /> Riwayat Sewa</div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {hist.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".55rem .75rem", borderBottom: i < hist.length - 1 ? "1px solid var(--border-muted)" : "none", fontSize: ".82rem" }}>
                  <span className="mono" style={{ color: "var(--text-muted)" }}>{h.date}</span>
                  <span style={{ flex: 1 }}>{h.cust}</span>
                  <span style={{ color: "var(--text-muted)" }}>{h.dur} mnt</span>
                  <span className="mono" style={{ fontWeight: 700 }}>{RMA.rupiah(h.amt)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".4rem" }}><Icon name="Wrench" size={16} /> Riwayat Service</div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {svc.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".55rem .75rem", borderBottom: i < svc.length - 1 ? "1px solid var(--border-muted)" : "none", fontSize: ".82rem" }}>
                  <span className="mono" style={{ color: "var(--text-muted)" }}>{h.date}</span>
                  <span style={{ flex: 1 }}>{h.type}</span>
                  <span style={{ color: "var(--text-muted)" }}>{h.who}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: ".6rem", padding: "1rem 1.25rem", borderTop: "1px solid var(--border)", position: "sticky", bottom: 0, background: "var(--bg-elevated)" }}>
          <Button variant="primary" icon="SquarePen" style={{ flex: 1 }}>Edit Unit</Button>
          <Button variant="outline" icon="Wrench">Tandai Service</Button>
        </div>
      </div>
    </Overlay>
  );
}

function Units({ role }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [branch, setBranch] = useState(role === "super_admin" ? "all" : "br_3");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState(null);
  const perPage = 9;

  const filtered = useMemo(() => RMA.units.filter((u) =>
    (status === "all" || u.status === status) &&
    (branch === "all" || u.branchId === branch) &&
    (type === "all" || u.type === type) &&
    (!q || u.serial.toLowerCase().includes(q.toLowerCase()) || u.typeLabel.toLowerCase().includes(q.toLowerCase()))
  ), [q, status, branch, type]);
  useEffect(() => setPage(0), [q, status, branch, type]);
  const pageRows = filtered.slice(page * perPage, page * perPage + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const reset = () => { setQ(""); setStatus("all"); setBranch(role === "super_admin" ? "all" : "br_3"); setType("all"); };

  const statusOpts = [{ value: "all", label: "Semua Status" }, ...Object.entries(RMA.STATUS).map(([k, v]) => ({ value: k, label: v.label }))];
  const branchOpts = [{ value: "all", label: "Semua Cabang" }, ...RMA.BRANCHES.map((b) => ({ value: b.id, label: b.name }))];
  const typeOpts = [{ value: "all", label: "Semua Tipe" }, ...RMA.UNIT_TYPES.map((t) => ({ value: t.key, label: t.label }))];

  return (
    <div style={{ padding: "1.6rem 1.8rem 3rem", maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader title="Manajemen Unit" sub={`${RMA.kpi.totalUnits.toLocaleString("id-ID")} unit terdaftar di seluruh cabang`}
        right={<div style={{ display: "flex", gap: ".6rem" }}>
          <Button variant="outline" icon="Download">Export</Button>
          <Button variant="primary" icon="Plus">Tambah Unit</Button>
        </div>} />

      <Card pad={false} style={{ padding: ".85rem", marginBottom: "1rem", display: "flex", gap: ".6rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200 }}><Field icon="Search" placeholder="Cari kode unit / merek..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} options={statusOpts} style={{ width: 160 }} />
        {role === "super_admin" && <Select value={branch} onChange={(e) => setBranch(e.target.value)} options={branchOpts} style={{ width: 190 }} />}
        <Select value={type} onChange={(e) => setType(e.target.value)} options={typeOpts} style={{ width: 160 }} />
        <Button variant="ghost" icon="RotateCcw" onClick={reset}>Reset</Button>
      </Card>

      <Card pad={false} style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr><th>Kode</th><th>Merek</th><th>Cabang</th><th>Status</th><th>Baterai</th><th>Last Service</th><th style={{ textAlign: "right" }}>Total Sewa</th><th></th></tr></thead>
            <tbody>
              {pageRows.map((u) => (
                <tr key={u.id} onClick={() => setSel(u)}>
                  <td className="mono" style={{ fontWeight: 700 }}>{u.serial}</td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}><span style={{ fontSize: "1.15rem" }}>{u.emoji}</span><div><div style={{ fontWeight: 600 }}>{u.typeLabel}</div><div style={{ fontSize: ".74rem", color: "var(--text-muted)" }}>{u.color} · {u.year}</div></div></div></td>
                  <td><div style={{ fontWeight: 600, fontSize: ".84rem" }}>{u.branchCity}</div></td>
                  <td><StatusBadge status={u.status} /></td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}><div style={{ width: 34, height: 6, borderRadius: 99, background: "var(--bg-muted)", overflow: "hidden" }}><div style={{ width: u.battery + "%", height: "100%", background: u.battery < 20 ? "var(--error-500)" : u.battery < 50 ? "var(--warning-500)" : "var(--success-500)" }} /></div><span className="mono" style={{ fontSize: ".74rem", color: "var(--text-muted)" }}>{u.battery}%</span></div></td>
                  <td className="mono" style={{ color: "var(--text-muted)", fontSize: ".82rem" }}>{u.lastService}</td>
                  <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>{u.totalRentals.toLocaleString("id-ID")}</td>
                  <td style={{ textAlign: "right" }}><Icon name="ChevronRight" size={16} className="" style={{ color: "var(--text-dimmed)" }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <Empty icon="Car" title="Tidak ada unit yang cocok" sub="Coba ubah atau reset filter pencarian." action={<Button variant="outline" size="sm" icon="RotateCcw" onClick={reset}>Reset Filter</Button>} />}
        {filtered.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".8rem 1.1rem", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>Menampilkan <b className="mono">{page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)}</b> dari <b className="mono">{filtered.length}</b> unit terfilter <span style={{ color: "var(--text-dimmed)" }}>(40.000 total)</span></span>
            <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
              <Button variant="outline" size="sm" icon="ChevronLeft" disabled={page === 0} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
              <span className="mono" style={{ fontSize: ".82rem", padding: "0 .5rem", color: "var(--text-muted)" }}>{page + 1} / {totalPages}</span>
              <Button variant="outline" size="sm" iconRight="ChevronRight" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Berikutnya</Button>
            </div>
          </div>
        )}
      </Card>

      {sel && <UnitDetail unit={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

window.Units = Units;
