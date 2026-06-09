import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Kpi } from '../components/Kpi';
import { api, type AppInfo } from '../lib/api';

export function Dashboard() {
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    api.getAppInfo().then(setInfo).catch(() => setInfo(null));
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        lede={
          <>
            Bienvenido. El esqueleto del diseño <b>Jardín de San José</b> ya está en marcha; las
            pantallas se completan por fase (ver roadmap).
          </>
        }
        actions={
          <span className="pill">
            <span className="dot" />
            Equilibrio: a definir
          </span>
        }
      />

      <div className="kpi-row">
        <Kpi lab="Stock crítico" value="—" sub="Fase 2 (Stock)" />
        <Kpi lab="Imports en tránsito" value="—" sub="Fase 4 (Importaciones)" />
        <Kpi lab="Pedidos pendientes" value="—" sub="Fase 3 (Pedidos)" />
        <Kpi lab="Margen del mes" value="—" sub="Fase 6 (Rentabilidad)" />
      </div>

      <div className="sect">
        <h2>Estado del sistema</h2>
        <div className="h-line" />
      </div>

      <div className="panel">
        <div className="panel-h">
          <h3>Entorno</h3>
          <span className="sub">datos reales vía IPC (renderer → main → SQLite)</span>
        </div>
        <div className="panel-body">
          {info ? (
            <dl className="env-grid">
              <dt>App</dt>
              <dd className="mono">{info.appVersion}</dd>
              <dt>Electron</dt>
              <dd className="mono">{info.electronVersion}</dd>
              <dt>Node</dt>
              <dd className="mono">{info.nodeVersion}</dd>
              <dt>SQLite</dt>
              <dd className="mono">{info.sqliteVersion}</dd>
              <dt>Base de datos</dt>
              <dd className="mono path">{info.dbPath}</dd>
            </dl>
          ) : (
            <p className="lede">Cargando estado…</p>
          )}
        </div>
      </div>
    </>
  );
}
