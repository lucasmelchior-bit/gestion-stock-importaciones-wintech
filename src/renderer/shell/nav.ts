// Estructura de navegación del sidebar (3 grupos + Sistema), según el diseño
// "Jardín de San José". Los textos van en español; los `key`/rutas en inglés/slug.

import type { ComponentType } from 'react';
import {
  IcGrid,
  IcTruck,
  IcDoc,
  IcBox,
  IcCat,
  IcWh,
  IcDlr,
  IcBars,
  IcChart,
  IcGear,
  IcShield,
} from './icons';

export type NavItem = {
  label: string;
  path: string;
  Icon: ComponentType<{ size?: number }>;
  badge?: { text: string; kind?: 'amber' };
};

export type NavGroup = { title: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Operación',
    items: [
      { label: 'Dashboard', path: '/', Icon: IcGrid },
      { label: 'Importaciones', path: '/importaciones', Icon: IcTruck },
      { label: 'Pedidos', path: '/pedidos', Icon: IcDoc },
      { label: 'Stock & Alertas', path: '/stock', Icon: IcBox },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { label: 'Productos', path: '/productos', Icon: IcCat },
      { label: 'Proveedores Adopen', path: '/proveedores-adopen', Icon: IcWh },
      { label: 'Proveedores logísticos', path: '/proveedores-logisticos', Icon: IcTruck },
    ],
  },
  {
    title: 'Análisis',
    items: [
      { label: 'Rentabilidad', path: '/rentabilidad', Icon: IcDlr },
      { label: 'Estadísticas', path: '/estadisticas', Icon: IcBars },
      { label: 'Gastos operativos', path: '/gastos', Icon: IcChart },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Ajustes', path: '/configuracion', Icon: IcGear },
      { label: 'Auditoría', path: '/auditoria', Icon: IcShield },
    ],
  },
];

/** Mapa ruta → título de pantalla, para los breadcrumbs del topbar. */
export const ROUTE_TITLES: Record<string, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items).map((i) => [i.path, i.label]),
);
