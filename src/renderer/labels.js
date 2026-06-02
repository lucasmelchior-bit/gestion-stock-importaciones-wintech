// =============================================================================
// Textos visibles de la UI, centralizados (regla de oro: nada de strings
// sueltos en el código). Todo en español. Los identificadores quedan en inglés.
// =============================================================================

export const labels = {
  appTitle: 'Gestion de Stock e Importaciones Wintech',
  tagline:
    'Control de stock y recomendacion de importaciones para insumos de aberturas de PVC.',
  phaseBadge: 'Fase 1 — Esqueleto en marcha',
  envHeading: 'Estado del entorno',
  dataHeading: 'Datos cargados',
  fields: {
    appVersion: 'Version de la app',
    electronVersion: 'Electron',
    nodeVersion: 'Node.js',
    sqliteVersion: 'SQLite',
    dbPath: 'Archivo de base de datos',
  },
  counts: {
    product: 'Productos',
    supplier: 'Proveedores',
    client: 'Clientes',
  },
  loading: 'Cargando…',
  error: 'No se pudo leer el estado de la aplicacion.',
  nextStep:
    'El esqueleto funciona: ventana + base SQLite con migraciones. Lo proximo es el ABM de productos (Fase 2).',
};
