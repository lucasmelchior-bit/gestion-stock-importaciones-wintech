import { NavLink } from 'react-router-dom';
import { NAV_GROUPS } from './nav';
import { WintechLogo, IcSrch } from './icons';
import { labels } from '../labels';

export function Sidebar() {
  return (
    <aside className="sb">
      <div className="sb-head">
        <div className="sb-logo">
          <WintechLogo />
        </div>
        <div className="sb-brand">
          {labels.brand}
          <small>{labels.brandSub}</small>
        </div>
      </div>

      <div className="sb-search" title={labels.searchHint}>
        <IcSrch size={14} />
        <span className="grow">{labels.searchPlaceholder}</span>
        <span className="sb-kbd">Ctrl K</span>
      </div>

      <nav className="sb-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="sb-group">{group.title}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => 'sb-item' + (isActive ? ' active' : '')}
              >
                <item.Icon size={16} />
                <span className="lbl">{item.label}</span>
                {item.badge && (
                  <span className={'badge' + (item.badge.kind === 'amber' ? ' amber' : '')}>
                    {item.badge.text}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="avatar">LP</div>
        <div className="who">
          {labels.userName}
          <small>{labels.userRole}</small>
        </div>
      </div>
    </aside>
  );
}
