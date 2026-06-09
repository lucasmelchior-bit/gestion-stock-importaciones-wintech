# 06 — Arquitectura

> El código de la app se crea a partir de la **Fase 1**. Este documento define la estructura
> objetivo para que cualquier IA/dev la respete desde el primer commit de código.

## Stack

- **Electron** — empaqueta la app de escritorio para Windows (instalador `.exe` con
  `electron-builder`).
- **SQLite** — base de datos en un único archivo local. Acceso vía el módulo **integrado
  `node:sqlite`** (`DatabaseSync`, síncrono): sin dependencias nativas ni compilación. Decidido en
  la Fase 1 (ver `adr/0004-sqlite-integrado-node.md`).
- **React + Vite + TypeScript** — interfaz (renderer). Adoptado en la Fase 2 por la densidad del
  diseño "Jardín de San José" (ver `adr/0006`). En dev, Vite dev server con HMR; en producción, un
  build estático que Electron carga con `loadFile`. Fuentes (Inter + JetBrains Mono) empaquetadas
  **localmente** (offline). Los procesos `main` y `preload` siguen en JavaScript/CommonJS.

## Procesos de Electron y su responsabilidad

| Carpeta | Proceso | Responsabilidad |
|---------|---------|-----------------|
| `src/main/` | **main** | Ciclo de vida de la app, ventana, **conexión a SQLite**, registro de handlers IPC. Es el único que toca la base y el sistema de archivos. |
| `src/preload/` | **preload** | Puente seguro (`contextBridge`) entre renderer y main. **Única superficie IPC**; cada canal documentado. Sin lógica de negocio. |
| `src/renderer/` | **renderer** | La UI (React + Vite + TS). En español. No accede directo a la base: pide datos por IPC vía `window.api`. Textos en un mapa `labels`. Sigue el design system "Jardín de San José". |
| `src/domain/` | (puro) | **Lógica de negocio pura**: pronóstico, reposición, cálculo de stock. **Sin Electron, sin SQL, sin UI.** Recibe datos y devuelve resultados. Testeable con tests unitarios. Implementa `docs/05`. |

## Flujo de datos (típico)

```
renderer (UI)  ──IPC──>  preload  ──>  main (handler)  ──>  SQLite
                                                  │
                                                  └──>  src/domain (cálculo puro)  ──>  resultado
resultado  ──IPC──>  renderer (se muestra)
```

Regla: **toda regla de negocio vive en `src/domain`** y el `main` solo orquesta (lee de la base,
llama a domain, escribe en la base, responde por IPC). Así la matemática se testea sin levantar Electron.

## Base de datos

- Esquema canónico: [`../db/schema.sql`](../db/schema.sql).
- Cambios al esquema mediante **migraciones ordenadas y append-only** en
  [`../db/migrations/`](../db/migrations/) (`0001_init.sql`, `0002_*.sql`, …). Nunca editar una
  migración ya publicada.
- El **stock en mano** es la suma de `stock_movement`; se mantiene una cache `product_stock`
  actualizada en la misma transacción que el movimiento, para lectura rápida.

## Empaquetado

- `electron-builder` genera el instalador para Windows (Fase 8).
- El archivo `.sqlite` de datos vive en la carpeta de datos del usuario (no dentro del install),
  y debe poder respaldarse/exportarse (NFR-5).

## Decisiones registradas

- `adr/0001-stack-electron-sqlite.md` — por qué Electron + SQLite.
- `adr/0002-politica-idioma.md` — UI/docs en español, código en inglés.
- `adr/0003-enfoque-pronostico.md` — por qué EWMA y v1 simple.
- `adr/0004-sqlite-integrado-node.md` — por qué `node:sqlite` en vez de `better-sqlite3`.
- `adr/0005-design-system-alcance.md` — adopción del diseño "Jardín de San José" y alcance ampliado.
- `adr/0006-react-vite-renderer.md` — React + Vite + TS en el renderer.
