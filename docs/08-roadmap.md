# 08 — Roadmap y estado

## Estado actual

> **Fase 0 — Arnés: ✅ COMPLETADA (2026-06-02).**
> Documentación y estructura creadas y subidas a GitHub (`main`). Todavía **no hay código de la
> aplicación**. **Próximo paso: Fase 1 (esqueleto Electron + SQLite).**

## Fases

### Fase 0 — Arnés (documentación y estructura) ← AHORA
Estructura de carpetas, `AGENTS.md` + `CLAUDE.md` + `README.md`, `docs/00–09`, ADRs, glosario,
`db/schema.sql`, `.gitignore`/`.editorconfig`/`.nvmrc`. `git init` + commit + push al repo.
**Sin código de app.**

### Fase 1 — Esqueleto
Instalar Node.js (versión en `.nvmrc`), scaffolding de Electron (`main`/`preload`/`renderer`),
conexión a SQLite, correr la migración `0001_init`, ventana en blanco. Objetivo: `npm run dev`
funciona y `electron-builder` genera un `.exe` de prueba.

### Fase 2 — Datos maestros + ABM (FR-1, FR-7)
ABM de productos, proveedores, marcas y clientes. UI en español con mapa `labels`.

### Fase 3 — Libro de stock + stock vivo (FR-2)
Tabla `stock_movement`, cache `product_stock`, pantalla de stock, carga inicial y ajustes.

### Fase 4 — Pedidos de venta (FR-3)
`sales_order` + líneas. Confirmar/entregar descuenta stock vía movimientos. Alimenta historial.

### Fase 5 — Compras / importaciones + stock en tránsito (FR-5)
`purchase_order` + líneas. Al pedir arranca el reloj del lead time; al recibir suma stock.

### Fase 6 — Alertas de stock crítico (FR-4)
Tablero con `min_stock` y `reorderPoint`; lista de "qué está por debajo del mínimo".

### Fase 7 — Pronóstico + recomendaciones (FR-6)
Bucketizado de demanda (BR-1), velocidad EWMA (BR-2), matemática de reposición (BR-3..BR-8),
pantalla "qué/cuándo/cuánto pedir". Lógica pura en `src/domain` con **tests** sobre el ejemplo
numérico de `docs/05`.

### Fase 8 — Pulido y empaquetado
Respaldo/exportación del `.sqlite` (NFR-5), instalador final, datos de ejemplo (`seed/`).

## Historial

- **2026-06-02 — Fase 0 cerrada.** Arnés completo (AGENTS.md, docs/00-09, 4 ADRs, schema.sql +
  migración 0001, seed, READMEs de src/*). Commit inicial y push a `main`.
