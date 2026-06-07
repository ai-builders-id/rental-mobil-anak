/* ============================================================
   Maps — stylized, self-contained SVG (no tile dependency)
   ============================================================ */

/* Soft island blobs (composed from simple ellipses) approximating Indonesia */
const ISLANDS = [
  // Sumatra (NW-SE diagonal)
  { cx: 150, cy: 100, rx: 34, ry: 20, rot: -40 },
  { cx: 178, cy: 150, rx: 30, ry: 18, rot: -40 },
  { cx: 210, cy: 205, rx: 30, ry: 20, rot: -45 },
  { cx: 238, cy: 250, rx: 24, ry: 16, rot: -50 },
  // Java (thin E-W)
  { cx: 330, cy: 318, rx: 48, ry: 13, rot: -6 },
  { cx: 420, cy: 322, rx: 50, ry: 12, rot: -3 },
  { cx: 500, cy: 326, rx: 26, ry: 11, rot: 0 },
  // Kalimantan (big central)
  { cx: 480, cy: 215, rx: 70, ry: 55, rot: 0 },
  { cx: 520, cy: 250, rx: 45, ry: 35, rot: 0 },
  { cx: 440, cy: 180, rx: 40, ry: 30, rot: 0 },
  // Sulawesi
  { cx: 645, cy: 250, rx: 30, ry: 48, rot: 18 },
  { cx: 668, cy: 195, rx: 32, ry: 18, rot: -30 },
  { cx: 625, cy: 300, rx: 24, ry: 20, rot: 30 },
  // Papua
  { cx: 880, cy: 255, rx: 70, ry: 42, rot: 0 },
  { cx: 820, cy: 240, rx: 38, ry: 26, rot: 0 },
  // Bali / Nusa Tenggara
  { cx: 515, cy: 352, rx: 12, ry: 7, rot: 0 },
  { cx: 548, cy: 356, rx: 16, ry: 7, rot: 0 },
  { cx: 585, cy: 358, rx: 14, ry: 6, rot: 0 },
  // Maluku
  { cx: 760, cy: 292, rx: 16, ry: 12, rot: 0 },
  { cx: 730, cy: 250, rx: 12, ry: 14, rot: 0 },
];

function NationalMap({ branches, selected, onSelect }) {
  const [hover, setHover] = useState(null);
  const maxRev = Math.max(...branches.map((b) => b.revenue));
  const hb = hover != null ? branches.find((b) => b.id === hover) : null;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1000 / 470", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-muted)" }}>
      <svg viewBox="0 0 1000 470" width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <pattern id="ocean" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="var(--border)" opacity="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="1000" height="470" fill="url(#ocean)" />
        {/* islands */}
        <g opacity="0.9">
          {ISLANDS.map((e, i) => (
            <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
              transform={`rotate(${e.rot} ${e.cx} ${e.cy})`}
              fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="1" />
          ))}
        </g>
        {/* markers */}
        {branches.map((b) => {
          const r = 4 + (b.total / 240) * 7;
          const isSel = selected === b.id, isHov = hover === b.id;
          const big = b.revenue > maxRev * 0.6;
          const col = !b.open ? "var(--neutral-400)" : "var(--primary-500)";
          return (
            <g key={b.id} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(b.id)} onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(b.id === selected ? null : b.id)}>
              {(isSel || (big && b.open)) && (
                <circle cx={b.x} cy={b.y} r={r}>
                  <animate attributeName="r" from={r} to={r + 12} dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                  <set attributeName="fill" to={col} />
                </circle>
              )}
              <circle cx={b.x} cy={b.y} r={isSel ? r + 3 : r} fill={col}
                stroke={isSel ? "#fff" : "var(--bg-elevated)"} strokeWidth={isSel ? 2.5 : 1.5}
                opacity={isHov || isSel ? 1 : 0.92} />
            </g>
          );
        })}
      </svg>
      {/* hover popup */}
      {hb && (
        <div style={{
          position: "absolute", left: `${(hb.x / 1000) * 100}%`, top: `${(hb.y / 470) * 100}%`,
          transform: `translate(-50%, calc(-100% - 12px))`, pointerEvents: "none", zIndex: 5,
          background: "var(--neutral-900)", color: "#fff", borderRadius: "var(--radius)", padding: ".55rem .7rem",
          boxShadow: "var(--shadow-lg)", whiteSpace: "nowrap", minWidth: 150,
        }}>
          <div style={{ fontWeight: 700, fontSize: ".82rem" }}>{hb.name}</div>
          <div style={{ fontSize: ".72rem", opacity: 0.7, marginBottom: ".35rem" }}>{hb.city} · {hb.code}</div>
          <div style={{ display: "flex", gap: ".75rem", fontSize: ".72rem" }}>
            <span><b className="mono">{hb.available}</b> siap</span>
            <span style={{ color: "#FFA875" }}><b className="mono">{hb.rented}</b> sewa</span>
          </div>
          <div style={{ fontSize: ".72rem", marginTop: ".25rem", color: "#66D98A", fontWeight: 600 }} className="mono">{RMA.rupiahShort(hb.revenue)} hari ini</div>
        </div>
      )}
      {/* legend */}
      <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: ".75rem", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "99px", padding: ".35rem .7rem", fontSize: ".72rem", fontWeight: 600, color: "var(--text-muted)", boxShadow: "var(--shadow-sm)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}><span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--primary-500)" }} /> Buka</span>
        <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}><span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--neutral-400)" }} /> Tutup</span>
        <span style={{ color: "var(--text-dimmed)" }}>•  ukuran = jumlah unit</span>
      </div>
    </div>
  );
}

/* ---- Venue floor map for real-time tracking ---- */
function VenueMap({ zones, units, onSelect, selected }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "650 / 460", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
      <svg viewBox="0 0 650 460" width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <pattern id="floor" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0V26" fill="none" stroke="var(--border-muted)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="650" height="460" fill="url(#floor)" />
        {/* geofence boundary */}
        <rect x="55" y="55" width="540" height="380" rx="20" fill="var(--success-500)" opacity="0.05" />
        <rect x="55" y="55" width="540" height="380" rx="20" fill="none" stroke="var(--success-500)" strokeWidth="2" strokeDasharray="9 7" opacity="0.55" />
        <text x="68" y="46" fontSize="12" fontWeight="700" fill="var(--success-600)">⬡ Zona Geofence Aman · radius 100m</text>
        {/* zones */}
        {zones.map((z) => (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="12" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="1.5" />
            <text x={z.x + 14} y={z.y + 26} fontSize="13" fontWeight="700" fill="var(--text-muted)">Zona {z.id}</text>
            <text x={z.x + 14} y={z.y + 43} fontSize="11" fill="var(--text-dimmed)">{z.name}</text>
          </g>
        ))}
        {/* units */}
        {units.map((u) => {
          const col = RMA.STATUS[u.status].color;
          const sel = selected === u.id;
          return (
            <g key={u.id} style={{ cursor: "pointer" }} onClick={() => onSelect(u)}>
              {u.outside && (
                <circle cx={u.x} cy={u.y} r="7" fill="var(--error-500)">
                  <animate attributeName="r" from="7" to="20" dur="1.1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.1s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={u.x} cy={u.y} r={sel ? 8 : 5.5} fill={col} stroke={u.outside ? "var(--error-500)" : "var(--bg-elevated)"} strokeWidth={sel ? 2.5 : 1.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

Object.assign(window, { NationalMap, VenueMap });
