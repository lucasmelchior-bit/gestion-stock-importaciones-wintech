# ADR-0005 — Adoptar el design system "Jardín de San José" y el alcance ampliado del diseño

- **Estado:** Aceptada
- **Fecha:** 2026-06-09

## Contexto

Después de cerrar la Fase 1 (esqueleto), Lucas aportó un **paquete de diseño hi-fi aprobado** —el
"design handoff" en [`../FronEnd_Design/design_handoff_wintech/`](../FronEnd_Design/design_handoff_wintech/)—
que define un **sistema visual completo** ("Jardín de San José": paleta, tipografía Inter +
JetBrains Mono, shell con sidebar + topbar, paleta ⌘K, drill-downs) y un **alcance de producto
bastante mayor** que el roadmap original: importaciones con timeline de 9 estados, plan de pagos
30/40/30, costo desembarcado (landed cost), documentos versionados + hilo de mails con el
proveedor, carga de pedidos por PDF asistida por IA, rentabilidad / punto de equilibrio, gastos
operativos, proveedores logísticos y auditoría.

Ese paquete fue generado de forma genérica y, en su prosa, propone un stack web (Next.js +
Postgres) y nombra los herrajes como "Roto NT". Ambas cosas **no aplican** a este proyecto.

## Decisión

1. **Adoptar el design system "Jardín de San José" como la dirección visual** del producto, y la
   **visión funcional del diseño como el norte** del proyecto (supera el alcance del roadmap
   original de Fase 0).
2. **Mantener Electron + SQLite, app de escritorio single-user offline** (ADR-0001). El diseño se
   **recrea dentro** del renderer; las features que el diseño asume "en la nube" se adaptan al
   modelo local: documentos en el sistema de archivos del usuario, IA de PDF **opcional cuando hay
   internet**, sin buzón de email ni multiusuario por ahora.
3. **Implementación incremental ("arrancar acotado")**: primero Productos y Stock; importaciones,
   pedidos por PDF y rentabilidad llegan en fases posteriores.
4. **Corrección de dominio:** los herrajes son marca **Accado** (del proveedor **Adopen**), no
   "Roto NT" — el diseño tenía un error; manda la documentación canónica (`docs/01`, `docs/02`).

## Puntos diferidos (a confirmar en su fase, no se deciden acá)

- **Lead time**: el roadmap dice **105 días** (confirmado con Lucas); el diseño menciona ~90. Se
  mantiene 105 hasta revisarlo en la fase de importaciones.
- **Pronóstico**: `docs/05` define **EWMA + stock de seguridad (Z)**; el diseño usa "consumo 90d +
  20% de buffer" (más simple). Se reconcilian en la fase de reposición/importaciones (probablemente
  conviva un método simple para sugerencia y el estadístico para forecast).
- Las **6 entidades nuevas** (importación rica, pago, documento, mail, proveedor logístico,
  auditoría, gasto operativo) se modelan con migraciones append-only cuando llegue su fase.

## Consecuencias

- **Positivas:** una sola dirección visual y de producto, aprobada por el usuario; el repo sigue
  siendo AI-agnóstico (el diseño queda versionado como referencia canónica).
- **Negativas / riesgos:** el alcance es grande para un solo desarrollador → se mitiga con la
  entrega incremental y los checkpoints por hito.
- La documentación canónica (`docs/03`, `04`, `05`, `09`) queda con **notas de "pendiente de
  expansión"** que apuntan al diseño; se reescribe a fondo a medida que cada fase la necesita.
- Decisión técnica derivada (framework del renderer) → ver `0006-react-vite-renderer.md`.
