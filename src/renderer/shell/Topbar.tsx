import { useLocation } from 'react-router-dom';
import { ROUTE_TITLES } from './nav';
import { IcSrch, IcBell, IcChevR } from './icons';
import { labels } from '../labels';

export function Topbar() {
  const { pathname } = useLocation();
  const title = ROUTE_TITLES[pathname] ?? labels.brand;

  return (
    <header className="tb">
      <div className="tb-crumbs">
        <span>{labels.brand}</span>
        <IcChevR size={12} />
        <span className="cur">{title}</span>
      </div>

      <div className="grow" />

      <div className="tb-search" title={labels.searchHint}>
        <IcSrch size={14} />
        <span className="grow">{labels.searchPlaceholder}</span>
        <span className="sb-kbd">Ctrl K</span>
      </div>

      <button className="tb-bell has-dot" aria-label={labels.notifications}>
        <IcBell size={16} />
      </button>
    </header>
  );
}
