# ADR-0004 — Motor de acceso a SQLite: módulo integrado `node:sqlite`

- **Estado:** Aceptada
- **Fecha:** 2026-06-02
- **Supera el punto "a revisar" de:** [`0001-stack-electron-sqlite.md`](0001-stack-electron-sqlite.md)

## Contexto

El ADR-0001 dejó pendiente confirmar en la Fase 1 **cómo** se accede a SQLite. El candidato
documentado era **`better-sqlite3`** (síncrono, simple, estándar de facto en Electron). Al armar
el esqueleto en la Fase 1 surgió un obstáculo concreto:

- `better-sqlite3` es un **módulo nativo** (C++): hay que compilarlo contra el ABI exacto de la
  versión de Electron.
- La versión de Electron instalada (**42.3.2**, que embebe **Node 24**) **no tiene binarios
  precompilados** publicados por `better-sqlite3`.
- Compilarlo desde fuente exige **Python + Visual Studio Build Tools** (varios GB) en la PC de
  Lucas, y **recompilar en cada actualización de Electron**. Frágil para una PC sin entorno de
  desarrollo (justamente el escenario del ADR-0001).

Al verificar el runtime se confirmó que **Electron 42 expone el módulo integrado `node:sqlite`**
(`DatabaseSync`, `StatementSync`, `Session`, `backup`), parte del core de Node 24.

## Decisión

Usar el módulo **integrado `node:sqlite`** (`DatabaseSync`) como capa de acceso a SQLite, en lugar
de `better-sqlite3`. Toda la capa de datos vive aislada en
[`../../src/main/db.js`](../../src/main/db.js).

## Alternativas consideradas

- **`better-sqlite3`:** API muy cómoda y madura, pero dependencia nativa sin prebuilt para
  Electron 42 → toolchain de C++ obligatorio y recompilación en cada upgrade. Descartada por
  fricción de mantenimiento en el entorno objetivo.
- **Bajar la versión de Electron** hasta una con prebuilt de `better-sqlite3`: ata el proyecto a
  una versión vieja por una razón accesoria. Descartada.
- **`node:sqlite` (elegida):** sin dependencias nativas, sin compilación, sin build tools; el
  mismo SQLite síncrono; API `prepare().get()/all()/run()` casi idéntica; viaja **dentro** de
  Electron, así que no se rompe al actualizar.

## Consecuencias

- **Positivas:** cero dependencias nativas y cero toolchain de C++; instalación y actualización de
  Electron sin recompilar; `dependencies` de producción queda vacío; incluye `backup` nativo (útil
  para el respaldo del NFR-5 en la Fase 8).
- **Negativas / riesgos:** `node:sqlite` está marcado **experimental** en Node 24 (emite un
  warning); su API podría cambiar en futuras versiones. Mitigación: el acceso está **encapsulado
  en `db.js`**, de modo que volver a `better-sqlite3` u otro driver es un cambio localizado.
- **Diferencias de API a tener en cuenta:** no hay helper `db.pragma(...)` ni `db.transaction(fn)`;
  se usan `db.exec('PRAGMA ...')` y `BEGIN/COMMIT/ROLLBACK` explícitos (ya implementados en
  `db.js`).
