type KpiProps = {
  lab: string;
  value: string;
  sub?: string;
  active?: boolean;
  dotColor?: string;
};

/** Tarjeta de métrica (.kpi) del design system. */
export function Kpi({ lab, value, sub, active, dotColor }: KpiProps) {
  return (
    <div className={'kpi' + (active ? ' active' : '')}>
      <div className="lab">
        <span className="dot" style={dotColor ? { background: dotColor } : undefined} />
        {lab}
      </div>
      <div className="v">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}
