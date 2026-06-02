# ESTADO DEL PROYECTO — Software-IA-Lucas

> **Para la próxima IA o persona que retome esto:** este archivo es el registro de todo lo
> conversado y decidido. Leelo entero antes de continuar. Resume el negocio, el objetivo del
> software, las decisiones tomadas, el plan completo, y **qué falta hacer** (sección "PRÓXIMO PASO").

_Última actualización de este registro: 2026-05-29._

---

## 1. Quién es Lucas (el negocio)

- **Importadora y distribuidora en toda Argentina** de insumos para fabricar aberturas (ventanas/puertas) de PVC.
- Importa desde Turquía, del proveedor **Adopen**:
  - **Perfiles de PVC marca Wintech** (para fabricar las aberturas).
  - **Herrajes y accesorios marca Accado** (para el armado de las aberturas).
- También importa **ruedas y otros accesorios** de **otros proveedores y países**.
- **Sus clientes** son los **fabricantes de aberturas de PVC** (a ellos les vende).
- Aclaración importante: **Wintech y Accado son marcas**; **Adopen es el proveedor** turco que fabrica/envía ambas.

## 2. Qué quiere construir (el software)

Un **programa de escritorio instalable en Windows, de un solo usuario** (Lucas), para:

1. **ABM de productos** (alta/baja/modificación) de todos los ítems que provee.
2. **Stock vivo** actualizado por cada ítem.
3. **Pedidos de venta** a clientes que **descuentan stock** a medida que se venden.
4. **Alertas de stock crítico**: cada ítem tiene un mínimo; al cruzarlo, avisa para incluirlo en el próximo pedido al proveedor.
5. **Aprendizaje de demanda (lo más importante):** el sistema debe **aprender la velocidad de venta de cada ítem**
   y, combinándola con la **demora de importación (3–4 meses)**, recomendar **cuándo y cuánto pedir**
   al proveedor para **no quedarse nunca sin stock**.

## 3. Decisiones ya confirmadas con Lucas

| Tema | Decisión |
|------|----------|
| **Tipo de app** | Programa de escritorio instalable en Windows (con ícono) |
| **Usuarios** | Uno solo (Lucas). Sin login por ahora. |
| **Stack** | **Electron** + **SQLite** (archivo local) + HTML/CSS/JS. Offline. |
| **Demora de importación (lead time)** | **105 días** base (3,5 meses) |
| **Cadencia de compra** | "Cuando hace falta" → la app avisa cuándo pedir (sin periodicidad fija) |
| **Perfiles** | Se venden **por barra entera**; herrajes/ruedas por **unidad/juego** (sin corte a medida) |
| **Estrategia de stock** | **Equilibrada**, nivel de servicio ~95% (Z = 1,65), ajustable por producto |
| **Idioma** | UI en español, docs en español, **identificadores de código en inglés**, con glosario puente |
| **Entrada AI-agnóstica** | `AGENTS.md` como archivo canónico; `CLAUDE.md` solo apunta a él |

## 4. Filosofía del proyecto (por qué este archivo existe)

Lucas pidió expresamente armar un **"arnés" AI-agnóstico**: documentación y estructura tal que el
proyecto **no dependa de una sola IA**. Cualquier IA o persona debe poder tomarlo y entenderlo.
Por eso la **primera entrega (Fase 0)** es documentación autoexplicativa + estructura del repo,
**sin código de la app todavía**.

---

## 5. Plan completo aprobado

> El plan detallado está guardado en:
> `C:\Users\Usuario\.claude\plans\el-sistema-debe-ir-greedy-biscuit.md`

### Estructura de archivos del arnés (a crear en Fase 0)

```
Software-IA-Lucas/
├── AGENTS.md                 # Entrada PRIMARIA para cualquier IA.
├── CLAUDE.md                 # Puntero fino a AGENTS.md.
├── README.md                 # Entrada humana: cómo instalar Node, correr en dev, generar el .exe.
├── .editorconfig · .gitignore · .nvmrc
├── docs/
│   ├── 00-INDICE.md          # Mapa de la documentación.
│   ├── 01-vision.md          # Por qué existe, negocio, criterios de éxito.
│   ├── 02-glosario.md        # Jerga del rubro ↔ término en código (piedra Rosetta).
│   ├── 03-requerimientos.md  # FUENTE DE VERDAD del QUÉ (FR-1, FR-2, …).
│   ├── 04-modelo-dominio.md  # Entidades, relaciones, unidades.
│   ├── 05-reglas-negocio.md  # FUENTE DE VERDAD de la matemática de pronóstico/reposición (BR-1, …).
│   ├── 06-arquitectura.md    # Electron main/preload/renderer, IPC, capa SQLite.
│   ├── 07-convenciones.md    # Idioma, nombres, commits, cómo agregar ADR.
│   ├── 08-roadmap.md         # Fases y estado.
│   ├── 09-diccionario-datos.md # Cada tabla/columna (espejo del schema).
│   └── adr/0000-template.md, 0001-stack-electron-sqlite.md, 0002-politica-idioma.md, 0003-enfoque-pronostico.md
├── db/
│   ├── schema.sql            # DDL canónica.
│   └── migrations/           # 0001_init.sql, … append-only.
├── src/ (main/ preload/ renderer/ domain/)  # vacías por ahora, con README de propósito.
├── test/
└── seed/sample-data.sql
```

### Modelo de datos (resumen — el detalle va en db/schema.sql y docs/04)

Tablas: `supplier`, `brand`, `client`, `product`, `stock_movement` (libro mayor append-only =
fuente real del stock en mano, con cache `product_stock`), `sales_order(_line)`,
`purchase_order(_line)` (aportan **stock en tránsito**), `demand_history` (consumo por período),
`demand_forecast` (velocidad aprendida por producto), `settings` (Z, período, alpha EWMA).
Plata: `last_cost_usd` y `sale_price_ars` separados; la matemática de stock es por **cantidad** (agnóstica a moneda).

### Reglas de negocio — pronóstico y reposición (resumen, detalle en docs/05)

- **Aprendizaje de velocidad (EWMA):** consumo de ventas bucketizado por período (semanal);
  `smoothed = α·demanda + (1−α)·smoothed_previo` (α=0,3); `velocity_per_day = smoothed / días`.
- **Demanda durante lead time:** `demandLT = velocity_per_day · L` (L = 105 días).
- **Stock de seguridad:** `sigma_LT = stddev_día · √L`; `safetyStock = Z · sigma_LT` (Z = 1,65).
- **Punto de reposición:** `reorderPoint = demandLT + safetyStock`.
- **Disponible:** `available = on_hand + in_transit`.
- **Alerta:** disparar cuando `on_hand + in_transit ≤ reorderPoint` (avisa antes de quedar sin
  stock y el "en tránsito" evita pedidos duplicados).
- **Cantidad sugerida (order-up-to):** `orderUpTo = velocity_per_day·(L+C) + safetyStock`;
  `recomendado = max(0, orderUpTo − available)` (C ≈ 90 días), redondeado a múltiplos de pack/barra.
- **Casos borde:** producto nuevo sin historial → usa `min_stock` manual hasta ~3 períodos;
  demanda intermitente (herrajes) → mayor safety; perfiles en barra y herrajes/ruedas en unidad
  (nunca mezclar unidades); estacionalidad fuerte → mejora futura (v1 deliberadamente simple).

### Roadmap por fases

- **Fase 0 — Arnés (EN CURSO):** estructura + documentación + ADRs + glosario + `schema.sql` + git/push.
- **Fase 1 — Esqueleto:** instalar Node (pinneado en `.nvmrc`), Electron, conexión SQLite, primera
  migración, ventana en blanco; `npm run dev` y un `.exe` de prueba.
- **Fase 2 — Datos maestros + ABM (FR-1):** productos, proveedores, clientes.
- **Fase 3 — Libro de stock + stock vivo (FR-2).**
- **Fase 4 — Pedidos de venta (FR-3):** confirmar venta descuenta stock.
- **Fase 5 — Compras/importaciones + en tránsito.**
- **Fase 6 — Alertas de stock crítico (FR-4).**
- **Fase 7 — Pronóstico + recomendaciones (FR-5/FR-6):** lógica pura en `src/domain` con tests.
- **Fase 8 — Pulido y empaquetado:** backup del `.sqlite`, instalador, datos de ejemplo.

---

## 6. Entorno / herramientas (estado de la PC)

- SO: Windows 11 Pro. Carpeta de trabajo: `C:\Users\Usuario`.
- **Git** instalado (v2.54.0) vía winget — en `C:\Program Files\Git\cmd\git.exe`.
- **GitHub CLI (gh)** instalado (v2.93.0) — en `C:\Program Files\GitHub CLI\gh.exe`.
  Sesión iniciada como **lucasmelchior-bit** (token con scopes repo, workflow, read:org, gist).
- **Node.js NO está instalado** todavía (se instala en Fase 1).
- Repo GitHub: `https://github.com/lucasmelchior-bit/Software-IA-Lucas` (estaba **vacío**).
- Nota de PATH: en una terminal nueva, refrescar con:
  `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

---

## 7. >>> PRÓXIMO PASO (acá retomamos) <<<

**Estado actual:** plan aprobado. Este registro creado. **Todavía NO se escribieron los archivos
del arnés** (AGENTS.md, docs/, db/schema.sql, etc.).

**Lo que hay que hacer al retomar, en orden:**

1. **Completar la Fase 0 (arnés):** crear todos los archivos del layout de la sección 5 con su
   contenido (AGENTS.md, CLAUDE.md, README.md, los 10 docs de `docs/`, los 4 ADRs,
   `db/schema.sql`, carpetas `src/*` con README, `.gitignore`, `.editorconfig`, `.nvmrc`).
2. **Inicializar git** en `C:\Users\Usuario\Software-IA-Lucas`, primer commit y **push** al repo
   de GitHub (ya autenticado con `gh`).
3. Recién después, **Fase 1**: instalar Node y armar el esqueleto Electron + SQLite.

> Toda la información para hacerlo está en este archivo y en el plan
> (`C:\Users\Usuario\.claude\plans\el-sistema-debe-ir-greedy-biscuit.md`).
