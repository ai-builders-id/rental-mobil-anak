/* ============================================================
   App Shell — sidebar, topbar, login
   ============================================================ */
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "units", label: "Manajemen Unit", icon: "Car" },
  { key: "sewa", label: "Sewa", icon: "ClipboardList", cta: true },
  { key: "tracking", label: "Tracking Real-time", icon: "Map" },
  { key: "popup", label: "Pop-up Store", icon: "Store" },
  { key: "laporan", label: "Laporan & Analytics", icon: "BarChart3" },
];

const ROLES = {
  super_admin: { name: "Bu Rina", title: "Admin Pusat", scope: "Kantor Pusat · Jakarta", initials: "RN", short: "Admin Pusat" },
  branch_admin: { name: "Pak Dodi", title: "Manajer Cabang", scope: "Grand Indonesia", initials: "DD", short: "Cabang" },
  operator: { name: "Mbak Sari", title: "Operator", scope: "Grand Indonesia", initials: "SR", short: "Operator" },
};

function Brand({ small }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, var(--primary-400), var(--primary-600))", display: "grid", placeItems: "center", color: "#fff", boxShadow: "0 4px 12px rgba(229,85,0,.35)", flexShrink: 0 }}>
        <Icon name="Car" size={22} strokeWidth={2.4} />
      </div>
      {!small && (
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontWeight: 800, fontSize: ".98rem", letterSpacing: "-.02em" }}>Rental Mobil Anak</div>
          <div style={{ fontSize: ".68rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: ".02em" }}>OPERATIONS PLATFORM</div>
        </div>
      )}
    </div>
  );
}

function Avatar({ initials, size = 36, color = "var(--secondary-500)" }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

/* ---------------- Login ---------------- */
function Login({ onLogin, dark }) {
  const [email, setEmail] = useState("rina@rentalmobilanak.id");
  const [pw, setPw] = useState("password123");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = (e) => { e.preventDefault(); setLoading(true); setTimeout(onLogin, 950); };
  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,1fr)" }}>
      {/* brand pane */}
      <div style={{ position: "relative", background: "linear-gradient(150deg, var(--primary-500), var(--primary-700) 60%, #7a2e00)", color: "#fff", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,.18) 1px, transparent 0)", backgroundSize: "26px 26px" }} />
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,.08)", top: -80, right: -80 }} />
        <div style={{ position: "absolute", fontSize: 130, bottom: 40, right: 40, opacity: 0.9, filter: "drop-shadow(0 10px 20px rgba(0,0,0,.25))" }}>🏎️</div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: ".7rem" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center" }}><Icon name="Car" size={24} /></div>
          <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>Rental Mobil Anak</div>
        </div>
        <div style={{ position: "relative" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.08, margin: "0 0 1rem", letterSpacing: "-.02em" }}>Satu dashboard untuk<br />250 cabang.</h1>
          <p style={{ fontSize: "1.02rem", opacity: 0.9, maxWidth: 380, margin: 0, lineHeight: 1.5 }}>Lacak 40.000 unit secara real-time, proses sewa dalam 30 detik, dan pantau performa nasional — semua di satu tempat.</p>
          <div style={{ display: "flex", gap: ".7rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
            {[["250", "Cabang"], ["40.000", "Unit terlacak"], ["<30s", "Per transaksi"]].map(([n, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,.12)", borderRadius: 12, padding: ".7rem 1rem", backdropFilter: "blur(4px)" }}>
                <div style={{ fontWeight: 800, fontSize: "1.3rem" }} className="mono">{n}</div>
                <div style={{ fontSize: ".75rem", opacity: 0.85 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", fontSize: ".78rem", opacity: 0.7 }}>© 2026 Rental Mobil Anak · v1.0.0</div>
      </div>
      {/* form pane */}
      <div style={{ display: "grid", placeItems: "center", padding: "2rem", background: "var(--bg)" }}>
        <form onSubmit={submit} style={{ width: "100%", maxWidth: 380, animation: "fade-up .5s both" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 .35rem", letterSpacing: "-.02em" }}>Masuk ke Dashboard</h2>
          <p style={{ color: "var(--text-muted)", margin: "0 0 1.8rem", fontSize: ".92rem" }}>Selamat datang kembali 👋 Silakan masuk untuk melanjutkan.</p>
          <label className="lbl">Email / Username</label>
          <Field icon="Mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ketik email..." />
          <div style={{ height: "1rem" }} />
          <label className="lbl">Kata Sandi</label>
          <div className="field-wrap">
            <span className="lead-icon"><Icon name="Lock" size={17} /></span>
            <input className="field" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} style={{ paddingRight: "2.6rem" }} />
            <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: ".6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-dimmed)", padding: 4 }}>
              <Icon name={show ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1.1rem 0 1.4rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".85rem", color: "var(--text-muted)", cursor: "pointer", fontWeight: 500 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary-500)", width: 16, height: 16 }} /> Ingat saya
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: ".85rem", color: "var(--primary-600)", fontWeight: 600, textDecoration: "none" }}>Lupa kata sandi?</a>
          </div>
          <Button type="submit" variant="primary" size="lg" className="btn-block" disabled={loading}>
            {loading ? <><Spinner size={16} /> Memproses...</> : <>Masuk <Icon name="ArrowRight" size={18} /></>}
          </Button>
          <div style={{ marginTop: "1.4rem", padding: ".7rem .9rem", background: "var(--bg-muted)", borderRadius: "var(--radius)", fontSize: ".78rem", color: "var(--text-muted)", display: "flex", gap: ".5rem", alignItems: "center" }}>
            <Icon name="Info" size={15} /> Demo prototype — klik <b style={{ color: "var(--text)" }}>Masuk</b> untuk menjelajah.
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Shell ---------------- */
function Shell({ view, setView, role, setRole, dark, setDark, onLogout, children, notifCount = 3 }) {
  const u = ROLES[role];
  const [roleOpen, setRoleOpen] = useState(false);
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{ width: 264, flexShrink: 0, background: "var(--bg-elevated)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1.1rem 1.1rem 1rem", borderBottom: "1px solid var(--border-muted)" }}><Brand /></div>
        <nav className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: "1rem .85rem", display: "flex", flexDirection: "column", gap: ".15rem" }}>
          <div style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--text-dimmed)", letterSpacing: ".06em", padding: "0 .4rem .5rem" }}>MENU UTAMA</div>
          {NAV.map((n) => (
            <div key={n.key} className={cx("nav-link", view === n.key && "active")} onClick={() => setView(n.key)}>
              <Icon name={n.icon} size={19} />
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.cta && <span className="badge badge-primary" style={{ fontSize: ".62rem", padding: ".2rem .4rem" }}>{RMA.activeRentals.length}</span>}
            </div>
          ))}
          <div style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--text-dimmed)", letterSpacing: ".06em", padding: "1rem .4rem .5rem" }}>SISTEM</div>
          {[{ key: "cabang", label: "Manajemen Cabang", icon: "Building2" }, { key: "settings", label: "Pengaturan", icon: "Settings" }].map((n) => (
            <div key={n.key} className={cx("nav-link", view === n.key && "active")} onClick={() => setView(n.key)}>
              <Icon name={n.icon} size={19} /><span>{n.label}</span>
            </div>
          ))}
        </nav>
        {/* user card */}
        <div style={{ padding: ".85rem", borderTop: "1px solid var(--border-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".55rem", borderRadius: "var(--radius)", background: "var(--bg-muted)" }}>
            <Avatar initials={u.initials} size={36} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: ".85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
              <div style={{ fontSize: ".72rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.title}</div>
            </div>
            <button onClick={onLogout} title="Keluar" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dimmed)", padding: 5, borderRadius: 6 }}><Icon name="LogOut" size={17} /></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ height: 62, flexShrink: 0, borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)", display: "flex", alignItems: "center", gap: "1rem", padding: "0 1.4rem", position: "relative", zIndex: 20 }}>
          <div className="field-wrap" style={{ width: 320, maxWidth: "32vw" }}>
            <span className="lead-icon"><Icon name="Search" size={17} /></span>
            <input className="field" placeholder="Cari unit, cabang, transaksi..." style={{ height: "2.3rem", paddingRight: "3.2rem" }} />
            <span style={{ position: "absolute", right: ".5rem", top: "50%", transform: "translateY(-50%)", display: "flex", gap: 2 }}>
              <span className="kbd">⌘</span><span className="kbd">K</span>
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".78rem", color: "var(--text-muted)", fontWeight: 600, marginRight: ".3rem" }}>
            <span className="live-dot" /> Live · diperbarui 30s
          </div>
          {/* role switcher */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setRoleOpen(!roleOpen)} className="btn btn-outline btn-sm" style={{ gap: ".5rem" }}>
              <Avatar initials={u.initials} size={20} color="var(--primary-500)" />
              <span style={{ fontWeight: 600 }}>{u.short}</span>
              <Icon name="ChevronsUpDown" size={14} />
            </button>
            {roleOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setRoleOpen(false)} />
                <div className="card" style={{ position: "absolute", right: 0, top: "calc(100% + .5rem)", width: 230, zIndex: 31, padding: ".4rem", boxShadow: "var(--shadow-lg)" }}>
                  <div style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--text-dimmed)", padding: ".4rem .5rem .3rem" }}>LIHAT SEBAGAI</div>
                  {Object.entries(ROLES).map(([k, r]) => (
                    <div key={k} onClick={() => { setRole(k); setRoleOpen(false); if (k === "operator") setView("sewa"); }}
                      style={{ display: "flex", alignItems: "center", gap: ".55rem", padding: ".5rem", borderRadius: "var(--radius)", cursor: "pointer", background: role === k ? "var(--bg-accented)" : "transparent" }}
                      onMouseEnter={(e) => { if (role !== k) e.currentTarget.style.background = "var(--bg-muted)"; }}
                      onMouseLeave={(e) => { if (role !== k) e.currentTarget.style.background = "transparent"; }}>
                      <Avatar initials={r.initials} size={28} color={role === k ? "var(--primary-500)" : "var(--neutral-400)"} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: ".82rem" }}>{r.title}</div>
                        <div style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>{r.scope}</div>
                      </div>
                      {role === k && <Icon name="Check" size={16} className="" style={{ color: "var(--primary-600)" }} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setDark(!dark)} title="Ganti tema" style={{ padding: ".45rem", width: "2.3rem" }}>
            <Icon name={dark ? "Sun" : "Moon"} size={18} />
          </button>
          <button className="btn btn-ghost btn-sm" style={{ padding: ".45rem", width: "2.3rem", position: "relative" }} title="Notifikasi">
            <Icon name="Bell" size={18} />
            {notifCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: 99, background: "var(--error-500)", border: "2px solid var(--bg-elevated)" }} />}
          </button>
        </header>
        <main className="scroll-area" style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { NAV, ROLES, Brand, Avatar, Login, Shell });
