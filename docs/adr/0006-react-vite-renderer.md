# ADR-0006 — React + Vite + TypeScript en el renderer

- **Estado:** Aceptada
- **Fecha:** 2026-06-09
- **Matiza:** la nota "sin framework pesado en v1" de [`../06-arquitectura.md`](../06-arquitectura.md)

## Contexto

`docs/06-arquitectura.md` decía que el renderer sería HTML/CSS/JS plano "si no hace falta un
framework". El diseño adoptado (ADR-0005) tiene una UI **densa y muy interactiva**: shell con
sidebar + topbar contextual, paleta de comandos ⌘K global, tablas de cientos de filas con
mini-gauges, drill-down lateral sticky, wizard de importación, split-screen de PDF, gráficos de
proyección. Mantener eso en HTML/JS plano sería lento de construir y difícil de mantener.

Los mockups del handoff ya están escritos en React, y `diseno.md` recomienda **React + Vite + TS**.

## Decisión

Construir el **renderer con React + Vite + TypeScript**. El bundle de Vite se carga en Electron:
- **Desarrollo:** Vite dev server (`http://localhost:5173`) con HMR; `main` hace `loadURL`.
- **Producción:** build estático en `build/renderer/`; `main` hace `loadFile`. Se incluye en
  `files` de electron-builder.

Los procesos **`main` y `preload` siguen en JavaScript/CommonJS** (no necesitan framework; tocan
Electron, IPC y la base). La frontera renderer↔main sigue siendo el `preload` con `contextBridge`.

Decisiones de detalle:
- **Routing:** `HashRouter` (rutas con `#`), que funciona con `file://` en producción sin
  configurar un servidor.
- **Fuentes:** Inter y JetBrains Mono **empaquetadas localmente** (`@fontsource/*`), no desde un
  CDN — la app debe funcionar **offline** (NFR-3).
- **Dependencias mínimas al principio:** React Router + componentes propios sobre `window.api`. Se
  evalúan TanStack Query/Table/Zustand recién cuando una pantalla lo justifique (no se adoptan "por
  las dudas").
- **CSP:** estricta en producción; en desarrollo se habilita lo mínimo para el HMR de Vite.

## Alternativas consideradas

- **HTML/CSS/JS plano (lo que decía `docs/06`):** menos dependencias, pero inviable para la
  densidad de esta UI sin reinventar un mini-framework. Descartada.
- **Otro framework (Vue/Svelte):** válidos, pero los mockups y el handoff ya están en React →
  menos fricción de portado. Descartada por costo de traducción.

## Consecuencias

- **Positivas:** desarrollo rápido de UI compleja, componentes reutilizables (shell, tablas),
  tipado TS en la capa de UI, ecosistema amplio.
- **Negativas:** se agrega un paso de build (Vite) y más dependencias de desarrollo; el `dev`
  ahora levanta dos procesos (Vite + Electron) de forma concurrente.
- El renderer en HTML plano de la Fase 1 se reemplaza por la base React/Vite en la Fase 2.
