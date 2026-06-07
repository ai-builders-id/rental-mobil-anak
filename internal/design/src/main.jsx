/* ============================================================
   Root App — routing, persistence, theme
   ============================================================ */
function ComingSoon({ title, icon }) {
  return (
    <div style={{ padding: "1.6rem 1.8rem", maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader title={title} />
      <Card style={{ padding: "4rem" }}>
        <Empty icon={icon || "Hammer"} title={`${title} — dalam pengembangan`} sub="Layar ini ada di peta navigasi sistem namun belum termasuk fokus prototipe ini." />
      </Card>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState(() => localStorage.getItem("rma.view") || "dashboard");
  const [role, setRole] = useState(() => localStorage.getItem("rma.role") || "super_admin");
  const [dark, setDark] = useState(() => localStorage.getItem("rma.dark") === "1");

  useEffect(() => { localStorage.setItem("rma.view", view); }, [view]);
  useEffect(() => { localStorage.setItem("rma.role", role); }, [role]);
  useEffect(() => {
    localStorage.setItem("rma.dark", dark ? "1" : "0");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (!loggedIn) {
    return (
      <div className={cx("app-root", dark && "dark")}>
        <Login onLogin={() => setLoggedIn(true)} dark={dark} />
      </div>
    );
  }

  const screens = {
    dashboard: <Dashboard role={role} setView={setView} />,
    units: window.Units ? <window.Units role={role} /> : <ComingSoon title="Manajemen Unit" icon="Car" />,
    sewa: window.Sewa ? <window.Sewa role={role} setView={setView} /> : <ComingSoon title="Sewa" icon="ClipboardList" />,
    tracking: window.Tracking ? <window.Tracking /> : <ComingSoon title="Tracking Real-time" icon="Map" />,
    laporan: window.Laporan ? <window.Laporan /> : <ComingSoon title="Laporan & Analytics" icon="BarChart3" />,
    popup: window.Popup ? <window.Popup /> : <ComingSoon title="Pop-up Store" icon="Store" />,
    cabang: <ComingSoon title="Manajemen Cabang" icon="Building2" />,
    settings: <ComingSoon title="Pengaturan" icon="Settings" />,
  };

  return (
    <div className={cx("app-root", dark && "dark")}>
      <Shell view={view} setView={setView} role={role} setRole={setRole} dark={dark} setDark={setDark} onLogout={() => setLoggedIn(false)}>
        {screens[view] || screens.dashboard}
      </Shell>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
