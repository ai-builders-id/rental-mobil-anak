/* ============================================================
   Halaman Sewa — fast rental flow + payment + live timer
   ============================================================ */
function QR({ size = 168, seed = 7 }) {
  // deterministic pseudo-QR module grid (stylized placeholder)
  const N = 21; let s = seed * 9301 + 49297;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const finder = (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
    cells.push({ x, y, on: finder ? ((x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) ? (x < 7 || x >= N - 7) : false) : rng() > 0.55 });
  }
  const m = size / N;
  return (
    <svg width={size} height={size} style={{ borderRadius: 8, background: "#fff", padding: 4 }}>
      {cells.map((c, i) => c.on && <rect key={i} x={c.x * m} y={c.y * m} width={m} height={m} fill="#141310" />)}
    </svg>
  );
}

function Sewa({ role, setView }) {
  const now = useTicker(1000);
  const startRef = useRef(Date.now());
  const [stage, setStage] = useState("form"); // form | pay | success
  const [unit, setUnit] = useState(null);
  const [cust, setCust] = useState({ name: "", phone: "", child: "" });
  const [dur, setDur] = useState(30);
  const [method, setMethod] = useState("qris");
  const [payLeft, setPayLeft] = useState(900); // 15:00 booking window
  const [elapsed, setElapsed] = useState(null); // frozen on success
  const branch = RMA.BRANCHES.find((b) => b.code === "JKT-001");
  const available = useMemo(() => RMA.units.filter((u) => u.branchId === branch.id && u.status !== "rented").slice(0, 8)
    .concat(RMA.units.filter((u) => u.status === "available").slice(0, 8)).slice(0, 9), []);

  const base = RMA.priceFor(dur);
  const canNext = unit && cust.name.trim();

  // payment window countdown
  useEffect(() => {
    if (stage !== "pay") return;
    const id = setInterval(() => setPayLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(id);
  }, [stage]);

  const txElapsed = Math.floor((now - startRef.current) / 1000);
  const startedAt = useRef(null);
  const goPay = () => { setPayLeft(900); setStage("pay"); };
  const confirmPay = () => { startedAt.current = Date.now(); setElapsed(Math.floor((Date.now() - startRef.current) / 1000)); setStage("success"); };
  const reset = () => { setStage("form"); setUnit(null); setCust({ name: "", phone: "", child: "" }); setDur(30); startRef.current = Date.now(); };

  const Section = ({ n, title, done, children }) => (
    <Card style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1rem" }}>
        <span style={{ width: 26, height: 26, borderRadius: 99, background: done ? "var(--success-500)" : "var(--primary-500)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: ".82rem", flexShrink: 0 }}>{done ? <Icon name="Check" size={15} /> : n}</span>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      {children}
    </Card>
  );

  return (
    <div style={{ padding: "1.6rem 1.8rem 3rem", maxWidth: 1300, margin: "0 auto" }}>
      <PageHeader title="Sewa Baru" sub={`${branch.name} · operator Mbak Sari`}
        right={
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", background: txElapsed > 30 ? "var(--warning-50)" : "var(--success-50)", border: `1px solid ${txElapsed > 30 ? "var(--warning-200)" : "var(--success-200)"}`, padding: ".4rem .8rem", borderRadius: 99 }}>
            <Icon name="Timer" size={16} className="" style={{ color: txElapsed > 30 ? "var(--warning-700)" : "var(--success-600)" }} />
            <span className="mono" style={{ fontWeight: 800, fontSize: ".95rem", color: txElapsed > 30 ? "var(--warning-700)" : "var(--success-600)" }}>{fmtClock((elapsed != null ? elapsed : txElapsed) * 1000)}</span>
            <span style={{ fontSize: ".72rem", color: "var(--text-muted)", fontWeight: 600 }}>waktu transaksi</span>
          </div>
        } />

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "1.2rem", alignItems: "start" }}>
        {/* left: steps */}
        <div>
          <Section n="1" title="Pilih Unit" done={!!unit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".6rem" }}>
              {available.map((u) => {
                const on = unit && unit.id === u.id;
                return (
                  <button key={u.id} onClick={() => setUnit(u)} style={{
                    textAlign: "left", cursor: "pointer", padding: ".7rem", borderRadius: "var(--radius)", background: on ? "var(--bg-accented)" : "var(--bg-elevated)",
                    border: `1.5px solid ${on ? "var(--primary-400)" : "var(--border)"}`, display: "flex", gap: ".55rem", alignItems: "center", transition: "all var(--t-fast)", fontFamily: "inherit",
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>{u.emoji}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="mono" style={{ fontWeight: 700, fontSize: ".82rem", color: "var(--text)" }}>{u.serial}</div>
                      <div style={{ fontSize: ".72rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.typeLabel}</div>
                    </div>
                    {on && <Icon name="CircleCheck" size={18} className="" style={{ color: "var(--primary-600)", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: ".7rem", fontSize: ".78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: ".4rem" }}><Icon name="ScanLine" size={15} /> Tip: scan QR pada bodi mobil untuk pilih unit lebih cepat.</div>
          </Section>

          <Section n="2" title="Data Customer" done={!!cust.name.trim()}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".9rem" }}>
              <div style={{ gridColumn: "span 2" }}><label className="lbl">Nama Orang Tua / Wali *</label><Field icon="User" placeholder="cth: Budi Setiawan" value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} /></div>
              <div><label className="lbl">Nomor HP (WhatsApp)</label><Field icon="Phone" placeholder="0812-3456-7890" value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} /></div>
              <div><label className="lbl">Nama Anak</label><Field icon="Baby" placeholder="cth: Andi" value={cust.child} onChange={(e) => setCust({ ...cust, child: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: ".7rem", fontSize: ".78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: ".4rem" }}><Icon name="MessageCircle" size={15} /> Struk & pengingat waktu dikirim otomatis via WhatsApp.</div>
          </Section>

          <Section n="3" title="Durasi & Pembayaran" done={false}>
            <label className="lbl">Pilih Durasi</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".6rem", marginBottom: "1.1rem" }}>
              {RMA.durOpts.map((d) => {
                const on = dur === d;
                return (
                  <button key={d} onClick={() => setDur(d)} style={{ cursor: "pointer", padding: ".8rem", borderRadius: "var(--radius)", border: `1.5px solid ${on ? "var(--primary-400)" : "var(--border)"}`, background: on ? "var(--bg-accented)" : "var(--bg-elevated)", fontFamily: "inherit", transition: "all var(--t-fast)" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.3rem", color: on ? "var(--primary-700)" : "var(--text)" }}>{d}<span style={{ fontSize: ".75rem", fontWeight: 600 }}> mnt</span></div>
                    <div className="mono" style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: 2 }}>{RMA.rupiah(RMA.priceFor(d))}</div>
                  </button>
                );
              })}
            </div>
            <label className="lbl">Metode Pembayaran</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".6rem" }}>
              {[{ k: "qris", l: "QRIS", i: "QrCode" }, { k: "gopay", l: "GoPay", i: "Wallet" }, { k: "cash", l: "Tunai", i: "Banknote" }].map((m) => {
                const on = method === m.k;
                return (
                  <button key={m.k} onClick={() => setMethod(m.k)} style={{ cursor: "pointer", padding: ".7rem", borderRadius: "var(--radius)", border: `1.5px solid ${on ? "var(--primary-400)" : "var(--border)"}`, background: on ? "var(--bg-accented)" : "var(--bg-elevated)", display: "flex", alignItems: "center", gap: ".5rem", justifyContent: "center", fontWeight: 600, fontFamily: "inherit", color: on ? "var(--primary-700)" : "var(--text)", transition: "all var(--t-fast)" }}>
                    <Icon name={m.i} size={18} /> {m.l}
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        {/* right: summary */}
        <Card style={{ position: "sticky", top: "1rem" }}>
          <CardHead title="Ringkasan Sewa" icon="ReceiptText" />
          {unit ? (
            <div style={{ display: "flex", alignItems: "center", gap: ".7rem", padding: ".7rem", background: "var(--bg-muted)", borderRadius: "var(--radius)", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.8rem" }}>{unit.emoji}</span>
              <div><div className="mono" style={{ fontWeight: 700 }}>{unit.serial}</div><div style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>{unit.typeLabel} · {unit.color}</div></div>
            </div>
          ) : (
            <div style={{ padding: ".9rem", background: "var(--bg-muted)", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: ".84rem", color: "var(--text-muted)", textAlign: "center" }}>Belum ada unit dipilih</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: ".55rem", fontSize: ".88rem" }}>
            <Row k="Cabang" v={branch.city} />
            <Row k="Customer" v={cust.name || "—"} />
            <Row k="Durasi" v={`${dur} menit`} />
            <Row k="Tarif" v={RMA.rupiah(base)} mono />
            <Row k="Diskon" v="Rp0" mono dim />
            <div className="divider" style={{ margin: ".4rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span className="mono" style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--primary-600)" }}>{RMA.rupiah(base)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: ".6rem", marginTop: "1.2rem" }}>
            <Button variant="outline" onClick={reset}>Batal</Button>
            <Button variant="primary" className="btn-block" disabled={!canNext} onClick={goPay} iconRight="ArrowRight">Lanjut Bayar</Button>
          </div>
          {!canNext && <div style={{ marginTop: ".6rem", fontSize: ".75rem", color: "var(--text-dimmed)", textAlign: "center" }}>Pilih unit & isi nama untuk lanjut</div>}
        </Card>
      </div>

      {stage === "pay" && (
        <Overlay onClose={() => setStage("form")} align="center">
          <div className="modal-card" style={{ padding: "1.6rem", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Konfirmasi Pembayaran</h3>
              <div style={{ display: "flex", alignItems: "center", gap: ".4rem", color: payLeft < 60 ? "var(--error-600)" : "var(--text-muted)" }}>
                <Icon name="Clock" size={15} /><span className="mono" style={{ fontWeight: 700 }}>{fmtClock(payLeft * 1000)}</span>
              </div>
            </div>
            {method === "cash" ? (
              <div style={{ padding: "2rem 1rem" }}>
                <div style={{ fontSize: "3rem" }}>💵</div>
                <p style={{ color: "var(--text-muted)", margin: ".5rem 0 0" }}>Terima pembayaran tunai dari customer.</p>
              </div>
            ) : (
              <>
                <p style={{ color: "var(--text-muted)", margin: "0 0 1rem", fontSize: ".88rem" }}>Pindai QR dengan aplikasi {method === "gopay" ? "GoPay" : "pembayaran"} untuk menyelesaikan.</p>
                <div style={{ display: "grid", placeItems: "center", marginBottom: "1rem" }}><QR seed={dur + (unit ? unit.serial.length : 3)} /></div>
              </>
            )}
            <div style={{ background: "var(--bg-muted)", borderRadius: "var(--radius)", padding: ".8rem", marginBottom: "1.1rem" }}>
              <div style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>Total Tagihan</div>
              <div className="mono" style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--primary-600)" }}>{RMA.rupiah(base)}</div>
            </div>
            <div style={{ display: "flex", gap: ".6rem" }}>
              <Button variant="outline" onClick={() => setStage("form")}>Batal</Button>
              <Button variant="success" className="btn-block" icon="Check" onClick={confirmPay}>{method === "cash" ? "Tunai Diterima" : "Pembayaran Berhasil"}</Button>
            </div>
            <div style={{ marginTop: ".8rem", fontSize: ".74rem", color: "var(--text-dimmed)", display: "flex", alignItems: "center", justifyContent: "center", gap: ".35rem" }}><Icon name="TriangleAlert" size={13} /> Booking otomatis batal jika timer habis.</div>
          </div>
        </Overlay>
      )}

      {stage === "success" && <SuccessModal unit={unit} cust={cust} dur={dur} base={base} elapsed={elapsed} startedAt={startedAt.current} onClose={reset} setView={setView} />}
    </div>
  );
}

function Row({ k, v, mono, dim }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>{k}</span><span className={mono ? "mono" : ""} style={{ fontWeight: 600, color: dim ? "var(--text-dimmed)" : "var(--text)" }}>{v}</span></div>;
}

function SuccessModal({ unit, cust, dur, base, elapsed, startedAt, onClose, setView }) {
  const now = useTicker(1000);
  const endAt = startedAt + dur * 60000;
  const remain = endAt - now;
  return (
    <Overlay onClose={onClose} align="center">
      <div className="modal-card" style={{ padding: "1.8rem", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 99, background: "var(--success-100)", color: "var(--success-600)", display: "grid", placeItems: "center", margin: "0 auto 1rem", animation: "scale-in .4s both" }}>
          <Icon name="CircleCheck" size={36} />
        </div>
        <h3 style={{ margin: "0 0 .3rem", fontSize: "1.4rem", fontWeight: 800 }}>Sewa Berhasil! 🎉</h3>
        <p style={{ color: "var(--text-muted)", margin: "0 0 1.2rem" }}>Transaksi selesai dalam <b className="mono" style={{ color: "var(--success-600)" }}>{elapsed}s</b> — unit siap digunakan.</p>
        <div style={{ background: "var(--bg-muted)", borderRadius: "var(--radius)", padding: "1rem", textAlign: "left", display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem", marginBottom: "1.1rem" }}>
          <Mini k="Unit" v={`${unit.emoji} ${unit.serial}`} />
          <Mini k="Customer" v={cust.name} />
          <Mini k="Durasi" v={`${dur} menit`} />
          <Mini k="Total" v={RMA.rupiah(base)} />
        </div>
        <div style={{ background: "var(--primary-50)", border: "1px solid var(--primary-200)", borderRadius: "var(--radius)", padding: "1rem", marginBottom: "1.2rem" }}>
          <div style={{ fontSize: ".78rem", color: "var(--primary-700)", fontWeight: 600, marginBottom: ".2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem" }}><span className="live-dot" style={{ width: 7, height: 7 }} /> Timer sewa berjalan</div>
          <div className="mono" style={{ fontWeight: 800, fontSize: "2.2rem", color: "var(--primary-600)", lineHeight: 1 }}>{fmtClock(remain)}</div>
          <div style={{ fontSize: ".74rem", color: "var(--text-muted)", marginTop: ".3rem" }}>Pengingat WhatsApp dikirim 5 menit sebelum selesai</div>
        </div>
        <div style={{ display: "flex", gap: ".6rem" }}>
          <Button variant="outline" icon="Printer">Cetak Struk</Button>
          <Button variant="primary" className="btn-block" onClick={onClose} icon="Plus">Sewa Lagi</Button>
        </div>
      </div>
    </Overlay>
  );
}
function Mini({ k, v }) { return <div><div style={{ fontSize: ".72rem", color: "var(--text-muted)", fontWeight: 600 }}>{k}</div><div style={{ fontWeight: 700, fontSize: ".9rem", marginTop: 1 }}>{v}</div></div>; }

window.Sewa = Sewa;
