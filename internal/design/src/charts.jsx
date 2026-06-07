/* ============================================================
   Charts — hand-built responsive SVG (no dependencies)
   ============================================================ */
function useMeasure() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    setW(ref.current.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/* ---- Smoothed area-line chart ---- */
function AreaLine({ data, height = 180, color = "#FF6B1A", fmt = (v) => v, area = true }) {
  const [ref, w] = useMeasure();
  const [hover, setHover] = useState(null);
  const padX = 12, padTop = 16, padBot = 26;
  const max = Math.max(...data.map((d) => d.value)) * 1.12;
  const min = Math.min(...data.map((d) => d.value)) * 0.85;
  const innerW = Math.max(0, w - padX * 2);
  const H = height - padTop - padBot;
  const xy = data.map((d, i) => [
    padX + (data.length === 1 ? innerW / 2 : (innerW * i) / (data.length - 1)),
    padTop + H - ((d.value - min) / (max - min || 1)) * H,
  ]);
  const path = xy.map((p, i) => {
    if (i === 0) return `M${p[0]},${p[1]}`;
    const prev = xy[i - 1], cx = (prev[0] + p[0]) / 2;
    return `C${cx},${prev[1]} ${cx},${p[1]} ${p[0]},${p[1]}`;
  }).join(" ");
  const gid = "g" + Math.round(max);
  return (
    <div ref={ref} style={{ width: "100%" }}>
      {w > 0 && (
        <svg width={w} height={height} onMouseLeave={() => setHover(null)}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} x1={padX} x2={w - padX} y1={padTop + H * g} y2={padTop + H * g}
              stroke="var(--border-muted)" strokeWidth="1" />
          ))}
          {area && <path d={`${path} L${xy[xy.length - 1][0]},${padTop + H} L${xy[0][0]},${padTop + H} Z`} fill={`url(#${gid})`} />}
          <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          {xy.map((p, i) => (
            <g key={i}>
              {hover === i && <circle cx={p[0]} cy={p[1]} r="9" fill={color} opacity="0.15" />}
              <circle cx={p[0]} cy={p[1]} r={hover === i ? 5 : 3.5} fill="var(--bg-elevated)" stroke={color} strokeWidth="2.5" />
              <rect x={p[0] - innerW / data.length / 2} y={padTop} width={innerW / data.length} height={H}
                fill="transparent" onMouseEnter={() => setHover(i)} />
              <text x={p[0]} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--text-dimmed)" fontWeight="600">{data[i].label}</text>
            </g>
          ))}
          {hover !== null && (
            <g pointerEvents="none">
              <rect x={Math.min(Math.max(xy[hover][0] - 42, 2), w - 86)} y={Math.max(xy[hover][1] - 34, 2)} width="84" height="24" rx="6" fill="var(--neutral-900)" />
              <text x={Math.min(Math.max(xy[hover][0], 44), w - 44)} y={Math.max(xy[hover][1] - 17, 19)} textAnchor="middle" fontSize="11.5" fill="#fff" fontWeight="700" fontFamily="var(--mono)">{fmt(data[hover].value)}</text>
            </g>
          )}
        </svg>
      )}
    </div>
  );
}

/* ---- Vertical bars (utilization per hour) ---- */
function Bars({ data, height = 170, color = "#1A7FFF", fmt = (v) => v + "%" }) {
  const [ref, w] = useMeasure();
  const [hover, setHover] = useState(null);
  const padX = 8, padTop = 14, padBot = 24;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const innerW = Math.max(0, w - padX * 2);
  const H = height - padTop - padBot;
  const bw = innerW / data.length;
  return (
    <div ref={ref} style={{ width: "100%" }}>
      {w > 0 && (
        <svg width={w} height={height} onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => {
            const bh = (d.value / max) * H;
            const x = padX + i * bw, y = padTop + H - bh;
            const peak = d.value === Math.max(...data.map((p) => p.value));
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect x={x + bw * 0.18} y={padTop} width={bw * 0.64} height={H} fill="var(--bg-muted)" rx="3" />
                <rect x={x + bw * 0.18} y={y} width={bw * 0.64} height={bh} rx="3"
                  fill={hover === i || peak ? "var(--primary-500)" : color} style={{ transition: "fill .15s" }} />
                {(i % 2 === 0) && <text x={x + bw / 2} y={height - 7} textAnchor="middle" fontSize="10" fill="var(--text-dimmed)" fontWeight="600">{d.label.replace(":00", "")}</text>}
                {hover === i && (
                  <g pointerEvents="none">
                    <rect x={Math.min(Math.max(x + bw / 2 - 26, 2), w - 54)} y={Math.max(y - 26, 0)} width="52" height="20" rx="5" fill="var(--neutral-900)" />
                    <text x={Math.min(Math.max(x + bw / 2, 28), w - 28)} y={Math.max(y - 12, 14)} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700" fontFamily="var(--mono)">{fmt(d.value)}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/* ---- Horizontal bars (top branches) ---- */
function HBars({ data, fmt = (v) => v, color = "#FF6B1A" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <div style={{ width: 130, flexShrink: 0, fontSize: ".82rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={d.name}>{d.name}</div>
          <div style={{ flex: 1, height: 22, background: "var(--bg-muted)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${color}, ${color}cc)`, animation: `fade-in .6s ${i * 0.06}s both` }} />
          </div>
          <div className="mono" style={{ width: 64, textAlign: "right", fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>{fmt(d.value)}</div>
        </div>
      ))}
    </div>
  );
}

/* ---- Donut ---- */
function Donut({ data, size = 150, thickness = 22, center }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * C;
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color} strokeWidth={thickness}
              strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc * C} strokeLinecap="butt"
              style={{ transition: "stroke-dashoffset .6s" }} />
          );
          acc += frac;
          return el;
        })}
      </g>
      {center && (
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central">
          <tspan x={size / 2} dy="-2" fontSize="22" fontWeight="800" fill="var(--text)">{center.value}</tspan>
          <tspan x={size / 2} dy="18" fontSize="10.5" fontWeight="600" fill="var(--text-muted)">{center.label}</tspan>
        </text>
      )}
    </svg>
  );
}

Object.assign(window, { useMeasure, AreaLine, Bars, HBars, Donut });
