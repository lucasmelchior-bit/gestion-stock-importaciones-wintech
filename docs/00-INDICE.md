# 00 — Índice de la documentación

Mapa de toda la documentación del proyecto. Leé en este orden si recién llegás.
La entrada canónica para IAs es [`../AGENTS.md`](../AGENTS.md).

| # | Documento | Para qué sirve |
|---|-----------|----------------|
| 01 | [`01-vision.md`](01-vision.md) | Por qué existe el proyecto, quién es el usuario, el problema de negocio y los criterios de éxito. |
| 02 | [`02-glosario.md`](02-glosario.md) | **Jerga del rubro ↔ términos de código.** La "piedra Rosetta". Leer antes que nada. |
| 03 | [`03-requerimientos.md`](03-requerimientos.md) | **Fuente de verdad del QUÉ.** Requerimientos funcionales numerados (FR-n). |
| 04 | [`04-modelo-dominio.md`](04-modelo-dominio.md) | Entidades, relaciones y unidades de medida del dominio. |
| 05 | [`05-reglas-negocio.md`](05-reglas-negocio.md) | **Fuente de verdad de la matemática** de pronóstico y reposición (BR-n), con ejemplos. |
| 06 | [`06-arquitectura.md`](06-arquitectura.md) | Cómo está organizado el código (Electron, IPC, capa de datos). |
| 07 | [`07-convenciones.md`](07-convenciones.md) | Política de idioma, nombres, commits, cómo agregar un ADR. |
| 08 | [`08-roadmap.md`](08-roadmap.md) | **Fases del producto, estado actual y qué sigue.** |
| 09 | [`09-diccionario-datos.md`](09-diccionario-datos.md) | Cada tabla y columna explicada (espejo en prosa de `db/schema.sql`). |
| — | [`adr/`](adr/) | Architecture Decision Records: por qué se decidió cada cosa. |
| — | [`FronEnd_Design/`](FronEnd_Design/design_handoff_wintech/) | Diseño "Jardín de San José": sistema visual + spec de pantallas. Norte de UI desde la Fase 2 (`adr/0005`). Empezar por su `diseno.md`. |

## Convención de los documentos

- Prefijos numéricos (`03-`, `05-`) para mantener orden y referencias estables.
- IDs estables citados desde el código y los commits: `FR-n` (requerimientos), `BR-n` (reglas),
  `ADR-nnnn` (decisiones).
- Si un documento y el código se contradicen: para la **intención**, gana el documento; para el
  **comportamiento actual**, gana el código, y se registra la diferencia en un ADR.
