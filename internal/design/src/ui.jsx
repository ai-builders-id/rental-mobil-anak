/* ============================================================
   UI Primitives — match Nuxt UI 4 vocabulary from design.md
   ============================================================ */
const { useState, useEffect, useRef, useMemo, useCallback } = React;
const cx = (...a) => a.filter(Boolean).join(" ");

/* ---------- Icon (Lucide) ---------- */
const _camel = (k) => k === "class" ? "className" : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function _attrs(o) { const a = {}; if (o) for (const k in o) a[_camel(k)] = o[k]; return a; }
function _renderNode(node, key) {
  if (!Array.isArray(node)) return null;
  // list of nodes -> map
  if (Array.isArray(node[0])) return node.map((n, i) => _renderNode(n, i));
  const tag = node[0];
  if (typeof tag !== "string") return null;
  const attrs = node[1] && typeof node[1] === "object" ? node[1] : null;
  const children = node[2];
  return React.createElement(tag, { key, ..._attrs(attrs) },
    Array.isArray(children) ? children.map((c, i) => _renderNode(c, i)) : undefined);
}
function Icon({ name, size = 20, strokeWidth = 2, className, style }) {
  const ic = window.lucide && window.lucide.icons && window.lucide.icons[name];
  if (!ic) return React.createElement("span", { style: { width: size, height: size, display: "inline-block", flexShrink: 0 } });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ flexShrink: 0, ...style }} aria-hidden="true">
      {_renderNode(ic, 0)}
    </svg>
  );
}

/* ---------- Button ---------- */
function Button({ children, variant = "primary", size, icon, iconRight, className, ...rest }) {
  return (
    <button className={cx("btn", "btn-" + variant, size && "btn-" + size, className)} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 15 : 17} />}
    </button>
  );
}

/* ---------- Card ---------- */
function Card({ children, className, style, pad = true, ...rest }) {
  return <div className={cx("card", pad && "card-pad", className)} style={style} {...rest}>{children}</div>;
}

/* ---------- Badge ---------- */
function Badge({ children, color = "neutral", dot, className }) {
  return (
    <span className={cx("badge", "badge-" + color, className)}>
      {dot && <span className="dot" style={{ background: dot }} />}
      {children}
    </span>
  );
}
function StatusBadge({ status }) {
  const s = RMA.STATUS[status] || RMA.STATUS.offline;
  return <Badge color={s.badge} dot={s.dot}>{s.label}</Badge>;
}

/* ---------- Field / Input ---------- */
function Field({ icon, className, ...rest }) {
  if (icon) {
    return (
      <div className="field-wrap">
        <span className="lead-icon"><Icon name={icon} size={17} /></span>
        <input className={cx("field", className)} {...rest} />
      </div>
    );
  }
  return <input className={cx("field", className)} {...rest} />;
}

/* ---------- Select (native, styled) ---------- */
function Select({ value, onChange, options, className, style }) {
  return (
    <div className="field-wrap" style={style}>
      <select className={cx("field", className)} value={value} onChange={onChange}
        style={{ appearance: "none", paddingRight: "2.2rem", cursor: "pointer" }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: "absolute", right: ".7rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-dimmed)" }}>
        <Icon name="ChevronDown" size={16} />
      </span>
    </div>
  );
}

/* ---------- Toggle ---------- */
function Toggle({ checked, onChange, size = 22 }) {
  return (
    <button onClick={() => onChange(!checked)} aria-pressed={checked}
      style={{
        width: size * 1.85, height: size, borderRadius: 99, border: "none", cursor: "pointer",
        background: checked ? "var(--primary-500)" : "var(--neutral-300)", padding: 2,
        transition: "background var(--t-base)", position: "relative", flexShrink: 0,
      }}>
      <span style={{
        display: "block", width: size - 4, height: size - 4, borderRadius: 99, background: "#fff",
        boxShadow: "var(--shadow-sm)", transform: checked ? `translateX(${size * 0.85}px)` : "translateX(0)",
        transition: "transform var(--t-spring)",
      }} />
    </button>
  );
}

/* ---------- Spinner ---------- */
function Spinner({ size = 18 }) {
  return <span className="spin" style={{ display: "inline-block", width: size, height: size, border: "2.5px solid var(--border)", borderTopColor: "var(--primary-500)", borderRadius: "99px" }} />;
}

/* ---------- Segmented control ---------- */
function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", background: "var(--bg-muted)", borderRadius: "var(--radius)", padding: 3, gap: 2 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            style={{
              border: "none", cursor: "pointer", padding: ".4rem .8rem", borderRadius: "calc(var(--radius) - 2px)",
              fontSize: ".82rem", fontWeight: 600, fontFamily: "inherit",
              background: on ? "var(--bg-elevated)" : "transparent",
              color: on ? "var(--text)" : "var(--text-muted)",
              boxShadow: on ? "var(--shadow-xs)" : "none", transition: "all var(--t-fast)",
              display: "inline-flex", alignItems: "center", gap: ".4rem",
            }}>
            {o.icon && <Icon name={o.icon} size={15} />}{o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Tooltip-ish title pill (for charts) ---------- */
function Empty({ icon = "Inbox", title, sub, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem", textAlign: "center", gap: ".6rem", color: "var(--text-muted)" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-muted)", display: "grid", placeItems: "center", color: "var(--text-dimmed)" }}>
        <Icon name={icon} size={26} />
      </div>
      <div style={{ fontWeight: 700, color: "var(--text)", fontSize: ".95rem" }}>{title}</div>
      {sub && <div style={{ fontSize: ".85rem", maxWidth: 280 }}>{sub}</div>}
      {action}
    </div>
  );
}

/* ---------- Modal / Slideover shells ---------- */
function Overlay({ children, onClose, align = "right" }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="overlay" style={{ justifyContent: align === "center" ? "center" : "flex-end", alignItems: align === "center" ? "center" : "stretch" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

/* ---------- Section header ---------- */
function CardHead({ title, sub, icon, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: ".75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", minWidth: 0 }}>
        {icon && <span style={{ color: "var(--text-muted)" }}><Icon name={icon} size={18} /></span>}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-.01em" }}>{title}</div>
          {sub && <div style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

Object.assign(window, { cx, Icon, Button, Card, Badge, StatusBadge, Field, Select, Toggle, Spinner, Segmented, Empty, Overlay, CardHead, useState, useEffect, useRef, useMemo, useCallback });
