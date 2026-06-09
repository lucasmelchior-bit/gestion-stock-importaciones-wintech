# ESTADO DEL PROYECTO — Gestión de Stock e Importaciones Wintech

> _(El proyecto se llamaba antes "Software-IA-Lucas"; renombrado el 2026-06-02.)_

> **Para la próxima IA o persona que retome esto:** este archivo es el registro de todo lo
> conversado y decidido. Leelo entero antes de continuar. Resume el negocio, el objetivo del
> software, las decisiones tomadas, el plan completo, y **qué falta hacer** (sección "PRÓXIMO PASO").

_Última actualización de este registro: 2026-06-09 (Fase 2 en curso: Productos + imágenes; carga de catálogo pendiente)._

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
| **Motor SQLite** | Módulo integrado **`node:sqlite`** (no `better-sqlite3`). Sin dependencias nativas. Decidido en Fase 1 (ADR-0004). |
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
gestion-stock-importaciones-wintech/
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
- **Node.js instalado** (Fase 1): **v24.16.0 LTS** vía `winget install OpenJS.NodeJS.LTS`
  (winget ya no sirve la 22; por eso `.nvmrc` se actualizó a `24`). npm 11.x. Electron 42 embebe
  Node 24, lo que habilita el módulo integrado `node:sqlite`.
- Repo GitHub: `https://github.com/lucasmelchior-bit/gestion-stock-importaciones-wintech`.
- Nota de PATH: en una terminal nueva, refrescar con:
  `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

---

## 7. >>> PRÓXIMO PASO (acá retomamos) <<<

**Estado actual (2026-06-09):** 🚧 **Fase 2 EN CURSO** en la rama
**`feat/fase-2-productos-stock`** (commits locales; ver abajo). Fases 0 y 1 ✅ completadas.
El plan aprobado de la Fase 2 está en
`C:\Users\Usuario\.claude\plans\abstract-tickling-flurry.md`.

### Lo hecho hoy (Fase 2, commiteado en `feat/fase-2-productos-stock`)
- **Hito 0 — Fundación** (`818a1e4`): se adoptó el diseño **"Jardín de San José"** como norte
  (**ADR-0005**) y **React + Vite + TS** en el renderer (**ADR-0006**). Se versionó el diseño en
  `docs/FronEnd_Design/`, se reconciliaron los docs canónicos y se confirmó **herrajes = Accado**
  (el diseño decía "Roto NT" por error).
- **Hito 1 — Shell** (`8e4e68c`): renderer reconstruido con React + Vite + TS; shell del design
  system (Sidebar 3 grupos + Sistema, Topbar, tokens, íconos, router HashRouter). Fuentes Inter +
  JetBrains Mono **locales** (offline). `npm run dev` levanta Vite + Electron concurrentes.
- **Hito 2 — Productos** (`5af151e`): ABM de catálogo (migración **0002** amplía `product` con
  family/line/color/peso/volumen/margen/landed_cost/target_stock). IPC `products:*` +
  `catalog:refData` en `main.js`, pantalla **Productos** (tabla densa + filtros + alta/edición en
  modal). `scripts/seed.js` carga 10 productos de ejemplo.
- **Paleta verde** (`8e14d62`): se corrigió a la paleta VERDE de `diseno.md §4.1` (confirmada por
  Lucas), no la beige de `wintech-shell.css`.
- **Imágenes de producto** (`34104ab`): migración **0003** (`image_filename`); las imágenes se
  guardan como archivos en `userData/product-images/` y se sirven con el protocolo interno
  `app-image://`; `images:pick` (diálogo) + miniatura en la tabla + visor ampliado (lightbox).

### EN CURSO al cortar: cargar el catálogo real desde Excel
Lucas pidió cargar perfiles (Wintech) y herrajes (Accado) desde sus listas de precios. **No se
cargó nada todavía.** Archivos:
- Perfiles: `C:\Users\Usuario\OneDrive\Documentos\Wintech\Lista de Precios\2026\Mayo\Lista de Precios Wintech Abril 2026 CON PESOS v3.xlsx`
- Herrajes: `C:\Users\Usuario\OneDrive\Documentos\Accado\...\Febrero 26\` (un Excel "con Imágenes",
  un Excel "completa" y un PDF).

**Estructura Wintech** (hojas: `Linea 60`, `Linea 70`, `Linea Corrediza W232`, `Junquillos`,
`Auxiliares`). Columnas por bloque: **col2**=IMAGEN, **col3**=NOMBRE, **col4**=CODIGO, **col5**=COLOR,
**col6**=USD x metro, **col7**=kg/metro, **col8**=Categoria, **col9**=Linea. Cada color es una fila.

**Decisiones de mapeo confirmadas con Lucas (2026-06-09):**
- `USD x METRO` = **precio de venta** (en USD). → hay que agregar **`sale_price_usd`** al modelo
  (migración **0004**); el schema actual solo tiene `sale_price_ars`.
- Perfiles se manejan **por barra de 6 m** → `unit='bar'`, `bar_length_m=6`,
  `sale_price_usd = USD/m × 6`, `weight_kg = kg/m × 6`.
- **Datos primero, fotos después** (las imágenes embebidas se resuelven en un segundo paso).

**Bloqueantes / pendientes de la carga:**
1. 🔑 **Regla de normalización del código (SKU) de perfiles** — Lucas la va a explicar; es la
   referencia permanente (ver memoria `normalizacion-codigo-perfiles`). Necesaria para SKUs únicos
   (varios colores comparten prefijo `P.K.`). **No importar perfiles sin esta regla.**
2. 📕 **Accado no se deja leer con `exceljs`** (los Excel con imágenes embebidas rompen el lector:
   `Cannot read properties of undefined (reading 'anchors')`). Opciones: extraer datos del **PDF**,
   o leer el Excel descomprimiéndolo (los `.xlsx` son ZIP) sin pasar por exceljs.
3. 🖼️ **Imágenes embebidas**: extraer de `xl/media/` del ZIP del Excel y asociarlas por los anchors
   de `xl/drawings/`. Segundo paso, tras cargar los datos.
4. Herramienta: **`exceljs` ya está instalado** (devDependency). Falta escribir el importador real
   (`scripts/import-catalog.js`).

### Pendientes operativos arrastrados
- 🔀 PRs sin abrir: `feat/fase-1-esqueleto` y `feat/fase-2-productos-stock` → `main`.
- 🧱 Instalador NSIS (`.exe`) requiere **Modo de Desarrollador de Windows** (symlinks). Fase 8.
- ⚙️ Si se borra `node_modules` y `npm run dev` falla con `ENOENT path.txt`: la instalación de
  Electron quedó resuelta a mano (extraer el zip del cache con `tar` + crear
  `node_modules/electron/path.txt` con `electron.exe`).

### Próximos pasos sugeridos
1. Pedir a Lucas la **regla del código de perfiles** y guardarla en la memoria correspondiente.
2. Migración **0004**: `sale_price_usd` en `product` (+ UI: campo y columna de precio USD).
3. Escribir `scripts/import-catalog.js`: parsear Wintech (por barra ×6), normalizar SKU, upsert.
4. Resolver lectura de **Accado** (PDF o ZIP) y cargar herrajes.
5. Segundo paso: **imágenes** embebidas → extraer y asociar.
6. Retomar el roadmap: **Hito 3 — Stock & Alertas** (quedó pendiente del plan de Fase 2).

> Diseño y reglas en `docs/` (empezar por `AGENTS.md` → `docs/00-INDICE.md` y
> `docs/FronEnd_Design/design_handoff_wintech/diseno.md`).
