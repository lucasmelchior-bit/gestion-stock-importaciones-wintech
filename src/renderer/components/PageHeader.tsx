import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  lede?: ReactNode;
  actions?: ReactNode;
};

/** Encabezado de pantalla (.page-h): h1 con stripe + bajada + acciones a la derecha. */
export function PageHeader({ title, lede, actions }: PageHeaderProps) {
  return (
    <div className="page-h">
      <div>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {actions && <div className="right">{actions}</div>}
    </div>
  );
}
