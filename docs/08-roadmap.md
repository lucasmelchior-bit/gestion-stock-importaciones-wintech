# 08 — Roadmap y estado

## Estado actual

> **Fase 2 — Diseño base + Productos y Stock: 🚧 EN CURSO (2026-06-09).**
> Tras adoptar el diseño "Jardín de San José" como norte (`adr/0005`), se reconstruye el renderer
> con **React + Vite + TS** (`adr/0006`) y se implementan las primeras pantallas (Productos, Stock).
> Las Fases 0 (arnés) y 1 (esqueleto) están ✅ completadas.

> **Nota:** el roadmap se re-planteó en la Fase 2 para seguir el alcance del diseño. Las fases de
> abajo reemplazan al plan original (más acotado) de la Fase 0.

## Fases

### Fase 0 — Arnés (documentación y estructura) ✅
Estructura de carpetas, `AGENTS.md` + `CLAUDE.md` + `README.md`, `docs/00–09`, ADRs, glosario,
`db/schema.sql`, `.gitignore`/`.editorconfig`/`.nvmrc`. `git init` + commit + push al repo.

### Fase 1 — Esqueleto ✅
Node.js, scaffolding de Electron (`main`/`preload`/`renderer`), conexión a SQLite vía `node:sqlite`,
migración `0001_init`, ventana que levanta con `npm run dev` y `.exe` de prueba.

### Fase 2 — Diseño base + Productos + Stock 🚧 (FR-1, FR-2, FR-7)
Shell React/Vite con el design system "Jardín de San José" (sidebar, topbar, tokens, ⌘K por venir).
ABM de **Productos** (catálogo ~450 SKUs: familia, línea, color, costos, precio, mínimos). Pantalla
de **Stock & Alertas** (físico real + carga de movimientos; disponible/reservado/en-tránsito se
completan al haber pedidos e importaciones).

### Fase 3 — Pedidos de venta + carga por PDF con IA (FR-3, FR-9)
`sales_order` enriquecida (código, estados, origen). Confirmar reserva/entrega descuenta stock.
Carga asistida por IA desde PDF del cliente (split-screen, revisión de matches). Alimenta historial.

### Fase 4 — Importaciones (FR-5, FR-10, FR-11)
Importación enriquecida: timeline de estados, ruta y puertos, costos logísticos desglosados, plan
de pagos 30/40/30, documentos versionados, **stock en tránsito** y **landed cost** al recibir.

### Fase 5 — Alertas, proyección y reposición sugerida (FR-4, FR-6)
Disponible = físico − reservado; proyección a 90 días con ETAs; alertas de stock crítico;
sugerencia de "qué/cuándo/cuánto pedir". Lógica pura en `src/domain` con **tests** (`docs/05` +
método del diseño, a reconciliar).

### Fase 6 — Rentabilidad y gastos (FR-7-análisis)
Margen bruto vs neto, **punto de equilibrio** mensual, alerta de venta a pérdida; carga de gastos
operativos.

### Fase 7 — Módulos de soporte
Estadísticas, proveedores logísticos, auditoría (log inmutable), paleta ⌘K global y atajos.

### Fase 8 — Pulido y empaquetado
Respaldo/exportación del `.sqlite` (NFR-5), instalador `.exe` final (requiere Modo de Desarrollador
de Windows para los symlinks de firma), datos de ejemplo (`seed/`).

## Historial

- **2026-06-02 — Fase 0 cerrada.** Arnés completo (AGENTS.md, docs/00-09, 4 ADRs, schema.sql +
  migración 0001, seed, READMEs de src/*). Commit inicial y push a `main`.
- **2026-06-02 — Fase 1 cerrada.** Node 24 instalado; scaffolding de Electron (main/preload/
  renderer); capa de datos sobre `node:sqlite` con runner de migraciones append-only; migración
  `0001_init` corriendo; ventana de bienvenida con `npm run dev`; ejecutable empaquetado en
  `dist/win-unpacked/`. Decisión registrada en **ADR-0004** (`node:sqlite` en vez de
  `better-sqlite3`). Instalador NSIS final queda para Fase 8.
