# Empezá acá — Prompt para Claude Code

Abrí esta carpeta en VS Code, lanzá Claude Code (`claude` en la terminal) y pegale este prompt:

---

```
Sos un desarrollador full-stack. En esta carpeta hay un paquete de diseño completo
para "GESTIÓN de Stock e Importaciones" — un sistema interno para Wintech AR,
importador-distribuidor B2B de perfilería PVC (Adopen) y herrajes (Roto NT).

PASO 1 — Leé en este orden, completo, antes de escribir código:
  1. README.md          (overview + design system + resumen de pantallas)
  2. diseno.md          (SPEC MAESTRO — 700+ líneas: dominio, lógica, cada pantalla)
  3. wintech-shell.css  (tokens de color/tipo — FUENTE DE VERDAD del look)

PASO 2 — Abrí los HTML 01–07 en un navegador (son los mockups hi-fi APROBADOS).
  NO los copies tal cual: son React+Babel inline para prototipar, no producción.
  Recreá ese diseño pixel-perfect en un stack real.

PASO 3 — Proponeme (y esperá mi OK antes de codear):
  a) el stack — sugerencia: Next.js + TypeScript + Tailwind + tRPC + Prisma + Postgres
  b) el modelo de datos a partir de la sección "Modelo de dominio" del README
  c) el plan de implementación pantalla por pantalla (orden: shell → 01 → 07)

PASO 4 — Primero el shell: sidebar (3 grupos + sistema), topbar contextual,
  paleta ⌘K global y drop universal de PDF. Después una pantalla por vez,
  validando conmigo en cada una.

Reglas duras:
  - Traducí PRIMERO las CSS variables de wintech-shell.css a tailwind.config.ts.
    No inventes colores nuevos.
  - Inter (texto) + JetBrains Mono (números/SKUs/fechas, con tabular-nums).
  - USD como moneda principal; ARS solo de referencia.
  - El Dashboard canónico es "01 Dashboard.html" (NO el v7, fue descartado).
  - Es una herramienta interna densa para 1 usuario, no un sitio público.
```

---

## Notas de estado (junio 2026)

- **Dashboard canónico**: `01 Dashboard.html`. Se exploró un "v7 Hero Equilibrio" y se **descartó** — no está en este bundle.
- **Shell ya funcional en los mockups**: navegación entre pantallas (sidebar con `<a href>`), paleta ⌘K (`wintech-shell.jsx` → `ShellGlobals`/`CmdPalette`), y drop universal de PDF que redirige a "Cargar pedido".
- **Tokens actualizados** a la paleta cálida Jardín de San José (ver `wintech-shell.css` `:root`).
- Pantallas pendientes de diseñar (pedir mockups antes de improvisar): Productos, Proveedores logísticos, Estadísticas, Gastos, Ajustes, Auditoría, Login.
