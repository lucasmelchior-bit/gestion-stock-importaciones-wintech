// Íconos del design system "Jardín de San José".
// SVG inline, stroke currentColor 1.6, viewBox 24x24. Portados de wintech-shell.jsx.

type IconProps = { size?: number };

function Ic({ size = 16, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

export const IcGrid = (p: IconProps) => (
  <Ic {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </Ic>
);
export const IcTruck = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 7h12v8H3z" />
    <path d="M15 9h4l2 3v3h-6z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="18" cy="17" r="2" />
  </Ic>
);
export const IcDoc = (p: IconProps) => (
  <Ic {...p}>
    <path d="M5 3h9l5 5v13H5z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </Ic>
);
export const IcBox = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 7v10l9 4 9-4V7l-9-4z" />
    <path d="m3 7 9 4 9-4" />
    <path d="M12 11v10" />
  </Ic>
);
export const IcCat = (p: IconProps) => (
  <Ic {...p}>
    <rect x="4" y="4" width="6" height="6" />
    <rect x="14" y="4" width="6" height="6" />
    <rect x="4" y="14" width="6" height="6" />
    <rect x="14" y="14" width="6" height="6" />
  </Ic>
);
export const IcChart = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 14l4-4 3 3 5-7" />
  </Ic>
);
export const IcBars = (p: IconProps) => (
  <Ic {...p}>
    <rect x="4" y="10" width="3" height="10" />
    <rect x="10" y="6" width="3" height="14" />
    <rect x="16" y="13" width="3" height="7" />
  </Ic>
);
export const IcDlr = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3v18" />
    <path d="M16 7c0-2-2-3-4-3s-4 1-4 3 2 3 4 3 4 1 4 3-2 3-4 3-4-1-4-3" />
  </Ic>
);
export const IcGear = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </Ic>
);
export const IcShield = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
  </Ic>
);
export const IcWh = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 21V8l9-4 9 4v13" />
    <path d="M7 21v-8h10v8" />
  </Ic>
);
export const IcSrch = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Ic>
);
export const IcBell = (p: IconProps) => (
  <Ic {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </Ic>
);
export const IcPlus = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 5v14M5 12h14" />
  </Ic>
);
export const IcArrR = (p: IconProps) => (
  <Ic {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Ic>
);
export const IcChevR = (p: IconProps) => (
  <Ic {...p}>
    <path d="m9 6 6 6-6 6" />
  </Ic>
);
export const IcInfo = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8v.01" />
  </Ic>
);

export function WintechLogo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 6c-1.5 2-3 4-3 6.5 0 1.8 1.4 3 3 3s3-1.2 3-3c0-2.5-1.5-4.5-3-6.5z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <path
        d="M10 14c-1.5 1-2.5 2.5-2.5 4 0 1.5 1.2 2.5 2.5 2.5 1.8 0 3-1.5 3-3.5"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M22 14c1.5 1 2.5 2.5 2.5 4 0 1.5-1.2 2.5-2.5 2.5-1.8 0-3-1.5-3-3.5"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        fill="none"
        opacity="0.85"
      />
      <circle cx="16" cy="13" r="1.2" fill="#F5C842" />
      <path d="M16 17v8" stroke="#F5C842" strokeWidth="1.4" />
    </svg>
  );
}
