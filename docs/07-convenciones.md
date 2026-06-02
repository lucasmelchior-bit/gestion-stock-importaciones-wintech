# 07 — Convenciones

## Idioma (ver `adr/0002`)

- **UI:** español. Los textos visibles van **centralizados** en un mapa `labels` (la UI es dato,
  no literales sueltos), para mantener consistencia y poder revisarlos.
- **Documentación:** español (Lucas es la fuente de verdad de los requerimientos y debe poder leerla).
- **Código (identificadores: variables, funciones, tablas, columnas):** **inglés**, usando los
  términos del [`02-glosario.md`](02-glosario.md). Evita nombres mezclados tipo `crearSalesOrder`.
- **Comentarios de código:** preferentemente español si ayudan a Lucas; términos técnicos en inglés.
- **Sin acentos en identificadores ni nombres de archivo** (evita problemas de encoding).

## Nombres de archivos y documentos

- Documentos de `docs/` con prefijo numérico estable (`03-`, `05-`).
- IDs estables que se citan desde código/commits: `FR-n` (requerimientos), `BR-n` (reglas),
  `ADR-nnnn` (decisiones), `NFR-n` (no funcionales).

## Estilo de código (JS)

- Indentación 2 espacios, UTF-8, fin de línea LF (ver `.editorconfig`).
- Nombres: `camelCase` para variables/funciones, `PascalCase` para clases, `snake_case` para
  columnas/tablas SQL.
- Lógica de negocio en `src/domain/` sin dependencias de Electron/UI/SQL.
- (Linter/formatter se define en Fase 1 y se registra en un ADR si se agrega.)

## Commits (Conventional Commits)

Formato: `tipo(scope): descripción`, citando el ID cuando aplique.

- Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Ejemplos:
  - `docs(harness): estructura inicial del proyecto (Fase 0)`
  - `feat(product): ABM de productos (FR-1)`
  - `feat(reorder): cantidad order-up-to (BR-7)`
  - `fix(stock): corregir cache de on_hand en ventas (FR-2)`

## Cómo agregar una decisión (ADR)

1. Copiá [`adr/0000-template.md`](adr/0000-template.md) a `adr/NNNN-titulo-corto.md` (número siguiente).
2. Completá contexto, decisión, alternativas y consecuencias.
3. Estado: `Propuesta` → `Aceptada` → `Superada` (cuando otra ADR la reemplaza).
4. **No se editan las ADR viejas**: una decisión nueva *supera* a la anterior (queda el historial).

## Migraciones de base de datos

- Append-only en `db/migrations/`. Una migración publicada **no se edita**; se agrega otra.
- El nombre lleva número incremental: `0001_init.sql`, `0002_descripcion.sql`, …
