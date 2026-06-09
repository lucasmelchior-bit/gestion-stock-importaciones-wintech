# AGENTS.md — Entrada para cualquier IA o desarrollador

> **Este es el archivo canónico de onboarding.** Si sos una IA o una persona que recién llega
> al proyecto, **empezá por acá** y seguí los enlaces. Su trabajo es *enrutar*, no almacenar:
> el detalle vive en `docs/`.

## Qué es este proyecto

**Gestión de Stock e Importaciones Wintech** es un **programa de escritorio para Windows (un solo usuario)** que gestiona
el **stock y los pedidos** de Lucas, un **importador/distribuidor argentino** de insumos para
fabricar aberturas de PVC (perfiles **Wintech** y herrajes **Accado** del proveedor **Adopen**,
Turquía; ruedas y accesorios de otros proveedores). Sus clientes son fabricantes de aberturas.

La función distintiva: el sistema **aprende la velocidad de venta de cada ítem** y, combinándola
con la **demora de importación (~3,5 meses)**, recomienda **cuándo y cuánto pedir** al proveedor
para **no quedarse nunca sin stock**.

## Leé la documentación en este orden

Todo el detalle está en `docs/`. El mapa completo está en **[`docs/00-INDICE.md`](docs/00-INDICE.md)**.
Orden sugerido:

1. [`docs/01-vision.md`](docs/01-vision.md) — por qué existe y para quién.
2. [`docs/02-glosario.md`](docs/02-glosario.md) — **jerga del rubro ↔ términos de código** (leer SÍ o SÍ).
3. [`docs/03-requerimientos.md`](docs/03-requerimientos.md) — qué tiene que hacer (FR-n).
4. [`docs/04-modelo-dominio.md`](docs/04-modelo-dominio.md) — entidades y relaciones.
5. [`docs/05-reglas-negocio.md`](docs/05-reglas-negocio.md) — la matemática de pronóstico y reposición (BR-n).
6. [`docs/06-arquitectura.md`](docs/06-arquitectura.md) — cómo está armado el código.
7. [`docs/07-convenciones.md`](docs/07-convenciones.md) — estilo, idioma, commits.
8. [`docs/08-roadmap.md`](docs/08-roadmap.md) — **en qué fase estamos y qué sigue.**

## Dónde está la "fuente de verdad" (no adivines)

| Pregunta | Fuente de verdad |
|----------|------------------|
| ¿QUÉ tiene que hacer? | `docs/03-requerimientos.md` (IDs `FR-n`) |
| ¿Cómo se calcula la reposición / el pronóstico? | `docs/05-reglas-negocio.md` (IDs `BR-n`) |
| ¿Cómo es el esquema de datos? | `db/schema.sql` (prosa en `docs/09-diccionario-datos.md`) |
| ¿Por qué se decidió X? | `docs/adr/` (Architecture Decision Records) |
| ¿Qué significa esta palabra del rubro? | `docs/02-glosario.md` |
| ¿En qué fase vamos? | `docs/08-roadmap.md` |
| ¿Cómo se ve / cómo debería verse la UI? | `docs/FronEnd_Design/design_handoff_wintech/` (diseño "Jardín de San José", `adr/0005`) |

## Reglas de oro (no negociables)

1. **Idioma:** la UI y la documentación van en **español**; los **identificadores de código en inglés**
   (ver [`docs/07-convenciones.md`](docs/07-convenciones.md) y `docs/adr/0002`). El glosario es el puente.
2. **Migraciones append-only:** nunca edites una migración ya publicada en `db/migrations/`; agregá una nueva.
3. **La lógica de negocio vive en `src/domain/`** (pronóstico, reposición, stock): sin Electron, sin UI,
   testeable, y **debe coincidir con `docs/05`**. Si cambiás la matemática, actualizá `docs/05` en el mismo commit.
2. **Strings de UI centralizados:** los textos visibles en español van en un mapa `labels`, no sueltos en el código.
4. **Decisiones → ADR:** toda decisión de arquitectura se registra como un archivo nuevo en `docs/adr/`
   (no se editan los viejos; se "superan" con uno nuevo).
5. **Commits:** estilo Conventional Commits, citando el ID cuando aplique. Ej.: `feat(reorder): order-up-to por BR-7`.

## Stack y cómo correr

- **Stack:** Electron + SQLite (`node:sqlite`) + **React + Vite + TypeScript** en el renderer. Un
  solo usuario, offline, sin login. (Ver `adr/0001`, `0004`, `0006`.)
- **Estado actual:** **Fase 2 en curso** — se adoptó el diseño "Jardín de San José" como norte
  (`adr/0005`) y se construyen las pantallas de Productos y Stock sobre un shell React/Vite. Fases
  0 (arnés) y 1 (esqueleto) completadas. Ver `docs/08-roadmap.md` y `ESTADO.md`. Pasos de
  setup/dev/build en `README.md`.

## Contexto de negocio imprescindible

- **Wintech** y **Accado** son **marcas**; **Adopen** es el **proveedor** (Turquía) que las fabrica/envía.
- **Cliente** = fabricante de aberturas de PVC (a quien Lucas le vende). **Lucas no fabrica aberturas.**
- **Lead time** de importación: ~105 días (3,5 meses). Es el corazón del problema de reposición.
