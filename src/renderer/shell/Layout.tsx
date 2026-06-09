import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { labels } from '../labels';

export function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <Outlet />
          <footer className="app-foot">
            <span>{labels.brand}</span>
            <span className="grow" />
            <span>{labels.footerNote}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
