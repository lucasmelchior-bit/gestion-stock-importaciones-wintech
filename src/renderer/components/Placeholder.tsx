import { PageHeader } from './PageHeader';
import { IcInfo } from '../shell/icons';
import { labels } from '../labels';

/** Pantalla aún no implementada: encabezado + panel "Próximamente". */
export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="panel">
        <div className="empty">
          <div className="ico">
            <IcInfo size={20} />
          </div>
          <h3>{labels.comingSoon}</h3>
          <p>{labels.comingSoonBody}</p>
        </div>
      </div>
    </>
  );
}
