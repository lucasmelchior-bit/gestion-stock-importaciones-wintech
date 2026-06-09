/* Wintech AR — Shared shell components
   Sidebar + Topbar + Icons
   Loaded as: <script type="text/babel" src="wintech-shell.jsx"></script> */

const Ic = ({ children, size = 16, vb = "0 0 24 24", style }) => (
  <svg className="ic" width={size} height={size} viewBox={vb} style={style}>{children}</svg>
);
const IcGrid = (p) => <Ic {...p}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></Ic>;
const IcTruck = (p) => <Ic {...p}><path d="M3 7h13l3 4v6H3z"/><circle cx="7" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></Ic>;
const IcDoc = (p) => <Ic {...p}><path d="M5 3h10l4 4v14H5z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></Ic>;
const IcBox = (p) => <Ic {...p}><path d="M3 7v10l9 4 9-4V7l-9-4z"/><path d="m3 7 9 4 9-4"/><path d="M12 11v10"/></Ic>;
const IcCat = (p) => <Ic {...p}><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></Ic>;
const IcLog = (p) => <Ic {...p}><path d="M3 6h18M3 12h18M3 18h12"/></Ic>;
const IcChart = (p) => <Ic {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-7"/></Ic>;
const IcBars = (p) => <Ic {...p}><rect x="4" y="10" width="3" height="10"/><rect x="10" y="6" width="3" height="14"/><rect x="16" y="13" width="3" height="7"/></Ic>;
const IcClk = (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Ic>;
const IcGear = (p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/></Ic>;
const IcShield = (p) => <Ic {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></Ic>;
const IcSrch = (p) => <Ic {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Ic>;
const IcBell = (p) => <Ic {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 0 0 4 0"/></Ic>;
const IcPlus = (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>;
const IcMinus = (p) => <Ic {...p}><path d="M5 12h14"/></Ic>;
const IcUp = (p) => <Ic {...p}><path d="M12 16V4"/><path d="m6 10 6-6 6 6"/><path d="M4 20h16"/></Ic>;
const IcDown = (p) => <Ic {...p}><path d="M12 4v12"/><path d="m6 10 6 6 6-6"/><path d="M4 20h16"/></Ic>;
const IcArrR = (p) => <Ic {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Ic>;
const IcArrL = (p) => <Ic {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></Ic>;
const IcChevR = (p) => <Ic {...p}><path d="m9 6 6 6-6 6"/></Ic>;
const IcChevD = (p) => <Ic {...p}><path d="m6 9 6 6 6-6"/></Ic>;
const IcShip = (p) => <Ic {...p}><path d="M3 17h18l-2 4H5z"/><path d="M5 17V8h14v9"/></Ic>;
const IcAnchor = (p) => <Ic {...p}><circle cx="12" cy="6" r="2"/><path d="M12 8v13M5 12h14"/></Ic>;
const IcWh = (p) => <Ic {...p}><path d="M3 21V8l9-4 9 4v13"/><path d="M7 21v-8h10v8"/></Ic>;
const IcSpk = (p) => <Ic {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/></Ic>;
const IcAlert = (p) => <Ic {...p}><path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.01"/></Ic>;
const IcUser = (p) => <Ic {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Ic>;
const IcCheck = (p) => <Ic {...p}><path d="m4 12 5 5 11-11"/></Ic>;
const IcX = (p) => <Ic {...p}><path d="M6 6l12 12M18 6 6 18"/></Ic>;
const IcCart = (p) => <Ic {...p}><path d="M3 4h2l2.5 12h11l2-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></Ic>;
const IcCalc = (p) => <Ic {...p}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/></Ic>;
const IcFltr = (p) => <Ic {...p}><path d="M4 5h16M7 12h10M10 19h4"/></Ic>;
const IcDlr = (p) => <Ic {...p}><path d="M12 3v18M16 7c0-2-2-3-4-3s-4 1-4 3 2 3 4 3 4 1 4 3-2 3-4 3-4-1-4-3"/></Ic>;
const IcStar = (p) => <Ic {...p}><path d="m12 3 2.7 6 6.3.6-4.8 4.4 1.5 6.5L12 17l-5.7 3.5 1.5-6.5L3 9.6 9.3 9z"/></Ic>;
const IcMagic = (p) => <Ic {...p}><path d="m4 20 12-12M14 4l2 2M18 8l2 2M4 14l2 2M9 5l1 1M19 15l1 1"/></Ic>;
const IcLnk = (p) => <Ic {...p}><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1"/><path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/></Ic>;
const IcInfo = (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></Ic>;

function WintechLogo(){
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M16 6c-1.5 2-3 4-3 6.5 0 1.8 1.4 3 3 3s3-1.2 3-3c0-2.5-1.5-4.5-3-6.5z" fill="#FFFFFF" opacity="0.95"/>
      <path d="M10 14c-1.5 1-2.5 2.5-2.5 4 0 1.5 1.2 2.5 2.5 2.5 1.8 0 3-1.5 3-3.5" stroke="#FFFFFF" strokeWidth="1.4" fill="none" opacity="0.85"/>
      <path d="M22 14c1.5 1 2.5 2.5 2.5 4 0 1.5-1.2 2.5-2.5 2.5-1.8 0-3-1.5-3-3.5" stroke="#FFFFFF" strokeWidth="1.4" fill="none" opacity="0.85"/>
      <circle cx="16" cy="13" r="1.2" fill="#F5C842"/>
      <path d="M16 17v8" stroke="#F5C842" strokeWidth="1.4"/>
    </svg>
  );
}

function NavI({ I, l, k, active, onNav, badge, badgeKind }){
  const href = navHref(k);
  const handleClick = (e) => {
    // If there's a real href, let browser navigate (cross-page)
    if (href && href !== "#") return;
    // Otherwise it's a placeholder — keep in-page active state via onNav
    e.preventDefault();
    if (onNav) onNav(k);
  };
  return (
    <a href={href} className={`sb-item ${active === k ? "active" : ""}`} style={{ textDecoration: "none" }} onClick={handleClick}>
      <I size={16} /><span className="lbl">{l}</span>
      {badge && <span className={`badge ${badgeKind === "amber" ? "amber" : ""}`}>{badge}</span>}
    </a>
  );
}

function navHref(k){
  const map = {
    Dashboard: "Dashboard v6 Jardin San Jose.html",
    Importaciones: "Importaciones - Armar.html",
    ImpDetalle: "Importacion - Detalle.html",
    ImpDocumentos: "Importacion - Documentos.html",
    Pedidos: "Pedidos - Cargar PDF.html",
    Stock: "Stock y Alertas.html",
    Productos: "#",
    Proveedores: "#",
    Rentabilidad: "Rentabilidad.html",
    Stats: "#",
    Gastos: "#",
    Config: "#",
    Auditoria: "#",
  };
  return map[k] || "#";
}

function Sidebar({ active, onNav, onCmd }){
  return (
    <>
    <ShellGlobals />
    <aside className="sb">
      <div className="sb-head">
        <div className="sb-logo"><WintechLogo /></div>
        <div className="sb-brand">Wintech AR<small>Stock & Imports</small></div>
      </div>
      <div className="sb-search" onClick={() => (onCmd ? onCmd() : window.__openCmd && window.__openCmd())}>
        <IcSrch size={14} /><span style={{ flex: 1 }}>Buscar producto, importación…</span><span className="sb-kbd">⌘K</span>
      </div>
      <div className="sb-group">Operación</div>
      <NavI I={IcGrid} l="Dashboard" k="Dashboard" {...{ active, onNav }} />
      <NavI I={IcTruck} l="Importaciones" k="Importaciones" badge="3" badgeKind="amber" {...{ active, onNav }} />
      <NavI I={IcDoc} l="Pedidos" k="Pedidos" {...{ active, onNav }} />
      <NavI I={IcBox} l="Stock & Alertas" k="Stock" badge="7" {...{ active, onNav }} />
      <div className="sb-group">Catálogo</div>
      <NavI I={IcCat} l="Productos" k="Productos" {...{ active, onNav }} />
      <NavI I={IcLog} l="Proveedores logísticos" k="Proveedores" {...{ active, onNav }} />
      <div className="sb-group">Análisis</div>
      <NavI I={IcChart} l="Rentabilidad" k="Rentabilidad" {...{ active, onNav }} />
      <NavI I={IcBars} l="Estadísticas" k="Stats" {...{ active, onNav }} />
      <NavI I={IcClk} l="Gastos operativos" k="Gastos" {...{ active, onNav }} />
      <div className="sb-group">Sistema</div>
      <NavI I={IcGear} l="Configuración" k="Config" {...{ active, onNav }} />
      <NavI I={IcShield} l="Auditoría" k="Auditoria" {...{ active, onNav }} />
      <div className="sb-foot">
        <div className="avatar">LP</div>
        <div style={{ fontSize: 12 }}>Lucas P.<small style={{ display: "block", color: "var(--ink-3)", fontSize: 10.5, marginTop: 2 }}>Dueño · Córdoba</small></div>
      </div>
    </aside>
    </>
  );
}

/* ---------- Global ⌘K palette + PDF drop ---------- */

const CMD_ITEMS = [
  { sec: "Ir a", icon: "IcGrid", label: "Dashboard", href: "Dashboard v6 Jardin San Jose.html", kw: "inicio home" },
  { sec: "Ir a", icon: "IcTruck", label: "Importaciones · Armar próxima", href: "Importaciones - Armar.html", kw: "contenedor adopen" },
  { sec: "Ir a", icon: "IcShip", label: "Importación en curso · Detalle", href: "Importacion - Detalle.html", kw: "eta timeline pago" },
  { sec: "Ir a", icon: "IcDoc", label: "Documentos de importación", href: "Importacion - Documentos.html", kw: "factura bl despacho" },
  { sec: "Ir a", icon: "IcBox", label: "Stock & Alertas", href: "Stock y Alertas.html", kw: "inventario critico" },
  { sec: "Ir a", icon: "IcChart", label: "Rentabilidad del mes", href: "Rentabilidad.html", kw: "margen utilidad equilibrio" },
  { sec: "Acciones", icon: "IcPlus", label: "Nueva importación", href: "Importaciones - Armar.html", kw: "armar contenedor" },
  { sec: "Acciones", icon: "IcMagic", label: "Cargar pedido por PDF", href: "Pedidos - Cargar PDF.html", kw: "ia extraer cliente" },
  { sec: "Acciones", icon: "IcAlert", label: "Ver stock crítico", href: "Stock y Alertas.html?filter=crit", kw: "rojo urgente faltante" },
  { sec: "Productos", icon: "IcBox", label: "WT-58-7001 · Marco Wintech 58 Blanco", href: "Stock y Alertas.html", kw: "perfil pvc" },
  { sec: "Productos", icon: "IcBox", label: "HRJ-CRM-2101 · Cremona Roto NT", href: "Stock y Alertas.html", kw: "herraje" },
  { sec: "Productos", icon: "IcBox", label: "WT-70-3201 · Marco Wintech 70 Blanco", href: "Stock y Alertas.html", kw: "perfil" },
];

function CmdPalette({ open, onClose }){
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inpRef = React.useRef(null);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CMD_ITEMS;
    return CMD_ITEMS.filter(it => (it.label + " " + it.kw + " " + it.sec).toLowerCase().includes(s));
  }, [q]);

  React.useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => inpRef.current?.focus(), 30); } }, [open]);
  React.useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;

  const go = (it) => { onClose(); setTimeout(() => { window.location.href = it.href; }, 50); };
  const onKey = (e) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(filtered.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[sel]) go(filtered[sel]); }
  };

  let lastSec = "";
  const ICONS = { IcGrid, IcTruck, IcShip, IcDoc, IcBox, IcChart, IcPlus, IcMagic, IcAlert };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(41,38,27,0.45)", backdropFilter: "blur(2px)", zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 560, maxWidth: "92vw", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "0 20px 60px rgba(41,38,27,0.25)", overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--line-soft)" }}>
          <IcSrch size={16} />
          <input ref={inpRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey} placeholder="Buscar pantallas, productos, acciones…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "var(--ink)", fontFamily: "inherit" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-3)", border: "1px solid var(--line-soft)", padding: "2px 6px", borderRadius: 4 }}>Esc</span>
        </div>
        <div style={{ maxHeight: 420, overflowY: "auto", padding: "6px 0" }}>
          {filtered.length === 0 && <div style={{ padding: "20px 16px", color: "var(--ink-3)", fontSize: 13, textAlign: "center" }}>Sin resultados</div>}
          {filtered.map((it, i) => {
            const I = ICONS[it.icon] || IcArrR;
            const showSec = it.sec !== lastSec;
            lastSec = it.sec;
            return (
              <React.Fragment key={i}>
                {showSec && <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-3)", padding: "8px 16px 4px", fontWeight: 600 }}>{it.sec}</div>}
                <div onMouseEnter={() => setSel(i)} onClick={() => go(it)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 16px", cursor: "pointer", background: sel === i ? "var(--primary-soft)" : "transparent", color: sel === i ? "var(--primary)" : "var(--ink)", fontSize: 13 }}>
                  <I size={15} />
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {sel === i && <IcArrR size={13} />}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ padding: "8px 16px", borderTop: "1px solid var(--line-soft)", fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--mono)", display: "flex", gap: 14 }}>
          <span>↑↓ navegar</span><span>↵ abrir</span><span>esc cerrar</span><span style={{ marginLeft: "auto" }}>arrastrá un PDF para cargar pedido</span>
        </div>
      </div>
    </div>
  );
}

function PdfDropOverlay({ active }){
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,56,24,0.85)", backdropFilter: "blur(3px)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ background: "var(--paper)", border: "2px dashed var(--accent)", borderRadius: 16, padding: "40px 56px", textAlign: "center", color: "var(--ink)" }}>
        <div style={{ fontSize: 40, marginBottom: 6 }}>📄</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Soltá el PDF para cargarlo como pedido</div>
        <div style={{ fontSize: 13, color: "var(--ink-2)" }}>La IA va a extraer los items y cantidades automáticamente</div>
      </div>
    </div>
  );
}

function ShellGlobals(){
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const dragCnt = React.useRef(0);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen(o => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const onEnter = (e) => {
      if (!e.dataTransfer || ![...(e.dataTransfer.types || [])].includes("Files")) return;
      e.preventDefault(); dragCnt.current++; setDrag(true);
    };
    const onOver = (e) => { if (e.dataTransfer && [...(e.dataTransfer.types || [])].includes("Files")) e.preventDefault(); };
    const onLeave = (e) => { dragCnt.current = Math.max(0, dragCnt.current - 1); if (dragCnt.current === 0) setDrag(false); };
    const onDrop = (e) => {
      if (!e.dataTransfer || ![...(e.dataTransfer.types || [])].includes("Files")) return;
      e.preventDefault(); dragCnt.current = 0; setDrag(false);
      const files = [...(e.dataTransfer.files || [])];
      const pdf = files.find(f => f.type === "application/pdf" || /\.pdf$/i.test(f.name));
      if (pdf) window.location.href = "Pedidos - Cargar PDF.html";
    };
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragover", onOver);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  // Make ⌘K open from any sidebar/topbar click that uses onCmd-style
  React.useEffect(() => {
    window.__openCmd = () => setCmdOpen(true);
    return () => { delete window.__openCmd; };
  }, []);

  return <><CmdPalette open={cmdOpen} onClose={() => setCmdOpen(false)} /><PdfDropOverlay active={drag} /></>;
}

function Topbar({ crumbs = [], actions, today }){
  const date = today ?? new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="tb">
      <div className="tb-crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span style={{ color: i === crumbs.length - 1 ? "var(--ink)" : undefined }}>{c}</span>
            {i < crumbs.length - 1 && <IcChevR size={12} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)", textTransform: "capitalize" }}>{date}</div>
      <div className="tb-search" onClick={() => window.__openCmd && window.__openCmd()} style={{ cursor: "pointer" }}><IcSrch size={14} /><span style={{ flex: 1 }}>Buscar o ejecutar…</span><span className="sb-kbd">⌘K</span></div>
      {actions}
      <div className="tb-bell"><IcBell size={15} /></div>
    </div>
  );
}

Object.assign(window, {
  Ic, IcGrid, IcTruck, IcDoc, IcBox, IcCat, IcLog, IcChart, IcBars, IcClk, IcGear, IcShield,
  IcSrch, IcBell, IcPlus, IcMinus, IcUp, IcDown, IcArrR, IcArrL, IcChevR, IcChevD,
  IcShip, IcAnchor, IcWh, IcSpk, IcAlert, IcUser, IcCheck, IcX, IcCart, IcCalc, IcFltr,
  IcDlr, IcStar, IcMagic, IcLnk, IcInfo,
  WintechLogo, Sidebar, Topbar, NavI, navHref,
  ShellGlobals, CmdPalette, PdfDropOverlay,
});
