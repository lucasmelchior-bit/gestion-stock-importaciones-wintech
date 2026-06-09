# Wintech AR — Sistema de Stock & Importaciones
**Documento de diseño completo para handoff a desarrollo**

> Versión 1.0 · Jardín de San José design system  
> Negocio: Wintech Argentina — importador y distribuidor B2B de perfilería de PVC + herrajes (líneas Adopen TR + Roto NT). Vende a fabricantes de aberturas. Operado por una sola persona (Lucas P., dueño, Córdoba).

---

## 1. Contexto del negocio

### 1.1 Modelo
- **Importador-distribuidor** mayorista. Compra contenedores de 40' HC en Estambul (Adopen) y los distribuye a fabricantes de aberturas de PVC en Argentina.
- **Frecuencia**: 4–6 importaciones por año. Pocas, pero altísimo valor unitario (USD 140–180k FOB cada una).
- **Catálogo**: ~450 SKUs. Tres familias:
  - **Perfiles** (PVC) — la mayor parte del peso/volumen.
  - **Herrajes** (Roto NT y otros) — alto margen, alta rotación.
  - **Accesorios y juntas** — complemento.
- **Moneda**: USD primero, ARS secundario (gastos operativos locales, sueldos).
- **Cliente típico**: fabricante B2B que pide por PDF/email, con detalle item-cantidad. Pago en cuenta corriente o anticipado.

### 1.2 Pain points actuales
1. **No sabe cuándo armar la próxima importación**. Hoy lo decide a ojo.
2. **No tiene visibilidad de stock futuro** (físico + en tránsito + reservado).
3. **Carga de pedidos manual** — recibe PDFs, los retipea en una planilla.
4. **No sabe el costo real desembarcado** (landed cost) por SKU hasta que cierra el ejercicio.
5. **No sabe si vende a pérdida** en algún producto puntual.

### 1.3 Restricciones operativas
- **Contenedor 40' HC**: capacidad ~26.000 kg, ~67 m³ utilizable. Pagás el contenedor entero — conviene siempre llenarlo.
- **Plazo Estambul → Córdoba**: ~90 días puerta a puerta (44d marítimo + 30d aduana/terrestre + buffers).
- **Plan de pago Adopen típico**: 30% al confirmar / 40% al embarcar / 30% contra docs.
- **Puerto de entrada**: Buenos Aires (default) o Montevideo (alternativo).
- **Despacho aduanero**: en Córdoba (sucursal aduana).
- **Depósito propio**: en Córdoba.

---

## 2. Decisiones de arquitectura

### 2.1 TL;DR — tres decisiones que mandan todo
1. **Navegación**: sidebar fijo izquierdo + top-bar contextual.
2. **Agrupamiento del sidebar**: 3 grupos — *Operación · Catálogo · Análisis* (+ Sistema al pie).
3. **Atajo de poder**: `⌘K` como columna vertebral (búsqueda global + paleta de comandos + drag-and-drop de PDF universal).

### 2.2 Por qué sidebar y no top-nav
10 módulos no entran en una top-nav sin colapsar. Convención conocida (Linear, Notion, Stripe). Reduce carga cognitiva.

### 2.3 Top-bar contextual
Cambia por pantalla: breadcrumbs, acciones primarias (ej. "Nueva importación"), filtros guardados, notificaciones, search global. **No duplica navegación del sidebar.**

### 2.4 Badges como sistema nervioso
- `Importaciones` con badge ámbar = importaciones que requieren atención (pago vencido, ETA por confirmar).
- `Stock` con badge rojo = SKUs en estado crítico.
- Diseño "calma por default": si no hay nada urgente, no hay badges.

### 2.5 Pedidos como módulo de primera clase
Tienen estados, historial, cruzan cliente↔stock↔importaciones. La pantalla "cargar PDF con IA" vive **dentro** como acción primaria, no como módulo aparte.

---

## 3. Mapa de módulos (10)

| # | Módulo | Ruta | Prioridad | Qué resuelve |
|---|---|---|---|---|
| 01 | **Dashboard** | `/dashboard` | P1 | KPIs del día: stock crítico, imports en tránsito, pedidos pendientes, margen mes, punto de equilibrio. Pantalla de aterrizaje. |
| 02 | **Importaciones** | `/importaciones` | P1 | Listado + detalle con timeline, ruta, costos logísticos, pagos a Adopen, landed cost. |
| 03 | **Pedidos** | `/pedidos` | P1 | Pedidos B2B. Carga por PDF + IA, revisión, disponibilidad cruzada con stock e imports futuras. |
| 04 | **Stock & Alertas** | `/stock` | P1 | Vista única: físico, reservado, disponible, en tránsito. La verdad operativa. |
| 05 | **Productos** | `/productos` | P2 | ABM catálogo (~450 SKUs). Línea, color, proveedor, costos históricos, precio venta. |
| 06 | **Proveedores logísticos** | `/proveedores` | P2 | Forwarders, fletes, despachantes, depósitos. Cotizaciones históricas y comparación. |
| 07 | **Rentabilidad** | `/rentabilidad` | P1 | Margen bruto vs neto. Punto de equilibrio mensual. Productos con peor margen. Alerta si vendés a pérdida. |
| 08 | **Estadísticas** | `/stats` | P2 | Top productos, rotación, comparativa de costos entre imports, evolución del flete. |
| 09 | **Gastos operativos** | `/gastos` | P3 | Carga mensual: alquiler, sueldos, combustible, embalaje. Alimenta overhead. |
| 10 | **Auditoría** | `/auditoria` | P3 | Log inmutable. Filtro por entidad/usuario/fecha. Accesible transversal desde "última modificación". |

### 3.1 Árbol de rutas completo
```
/                                  → redirige a /dashboard

━━ OPERACIÓN
/dashboard
/importaciones
  /importaciones/nueva             ← flujo "armar próxima importación" (sugerencias del sistema)
  /importaciones/:id               ← detalle: items, costos, pagos, timeline
  /importaciones/:id/recibir       ← conciliación al arribo, calcula landed cost
/pedidos
  /pedidos/nuevo
  /pedidos/cargar-pdf              ← flujo IA · drag-and-drop
  /pedidos/:id
/stock
  /stock/criticos                  ← vista guardada
  /stock/movimientos               ← log unificado de entradas/salidas
  /stock/:productoId               ← drill-down con histórico

━━ CATÁLOGO
/productos
  /productos/nuevo
  /productos/importar              ← desde Excel/PDF
  /productos/:id
/proveedores
  /proveedores/:id

━━ ANÁLISIS
/rentabilidad
  /rentabilidad/punto-equilibrio
  /rentabilidad/producto/:id
/stats
/gastos

━━ SISTEMA (footer del sidebar)
/configuracion
  /configuracion/parametros        ← capacidad contenedor, umbrales
  /configuracion/usuarios
  /configuracion/integraciones
/auditoria
```

---

## 4. Design System "Jardín de San José"

### 4.1 Paleta (CSS custom properties)

```css
:root{
  /* Fondos */
  --bg:#FAFCF5;          /* fondo de app, blanco-verdoso muy suave */
  --paper:#FFFFFE;       /* tarjetas, paneles */
  --paper-2:#F4F8E8;     /* fondos sutiles, hover, headers internos */
  --lily:#FFFFFE;

  /* Tinta */
  --ink:#1F2818;         /* texto principal — verde muy oscuro casi negro */
  --ink-2:#465038;       /* texto secundario */
  --ink-3:#7A8463;       /* texto terciario, labels, metadata */

  /* Líneas */
  --line:#7A8A5C;        /* bordes fuertes (raros) */
  --line-2:#B8C49A;      /* bordes medios */
  --line-soft:#DCE4C8;   /* bordes default de paneles */

  /* Primario — verde olivo profundo (corporativo) */
  --primary:#1F3818;
  --primary-2:#2E4D24;   /* hover */
  --primary-soft:#DCE6CC;

  /* Secundario — verde oliva claro */
  --teal:#8AA63E;
  --teal-soft:#E8F0CF;

  /* Acento — amarillo lirio (CTAs, badges activos, highlights) */
  --accent:#F5C842;
  --accent-2:#F4A93A;
  --accent-soft:#FCEFB4;
  --pastel:#F5C842;
  --pastel-soft:#FCEFB4;

  /* Equilibrio (gauges, gradientes de salud financiera) */
  --eq-from:#93B041;
  --eq-to:#6E8530;

  /* Semántica */
  --ok:#5C8A1E;          /* verde positivo */
  --warn:#D89020;        /* ámbar */
  --crit:#A03B1E;        /* rojo cálido */

  /* Mono */
  --mono:'JetBrains Mono', ui-monospace, monospace;
}
```

### 4.2 Tipografía
- **Sans**: Inter (400/500/600/700)
- **Mono**: JetBrains Mono (400/500/600) — para cifras, IDs, SKUs, códigos, fechas técnicas. **Siempre con `font-variant-numeric: tabular-nums`.**

### 4.3 Reglas tipográficas
- **H1 de página**: 24px / weight 600 / `letter-spacing: -0.02em`
- **H1 hero (códigos IMP)**: 28px mono / weight 600
- **H3 de panel**: 14px / weight 600
- **Body**: 13–14px / line-height 1.5
- **Metadata**: 11.5px mono, color `--ink-3`
- **Labels (uppercase)**: 10.5px / `letter-spacing: 0.04em` / weight 600 / `--ink-3`

### 4.4 Espaciado y forma
- **Border radius**: 6px (chips), 7px (botones, inputs), 10–12px (paneles, cards), 999px (pills)
- **Padding panel**: 14px 18px (header), 14–18px (body)
- **Gap entre paneles**: 14–18px
- **Sombras**: `box-shadow: 0 1px 0 rgba(94,90,51,0.03)` — sombra mínima, casi solo borde

### 4.5 Componentes shell
Definidos en `wintech-shell.css` + `wintech-shell.jsx`:

- **Sidebar** (`.sb`) — 248px fijo, top-stripe degradé verde→amarillo→verde, header con logo, search, grupos, footer con avatar.
- **Topbar** (`.tb`) — 56px alto, breadcrumbs uppercase, search trigger, action buttons, bell con dot crítico.
- **Botones**:
  - `.tb-btn` — secundario, borde sutil, hover con tinte amarillo claro
  - `.tb-btn.primary` — fondo `--primary` verde, texto `--lily`
- **Pill** — 999px, fondo `--pastel-soft`, dot semántico
- **Panel** — borde `--line-soft`, header degradé `--paper-2 → --paper`
- **Page header** (`.page-h`) — h1 + lede + acciones a la derecha
- **Footer de app** (`.app-foot`) — texto mono, `--ink-3`, separador dashed

### 4.6 Sistema de íconos
SVG inline, `stroke="currentColor"`, `fill="none"`, stroke-width 1.6, line cap round. Set en `wintech-shell.jsx`:

`IcGrid, IcTruck, IcDoc, IcBox, IcCat, IcLog, IcChart, IcBars, IcClk, IcGear, IcShield, IcSrch, IcBell, IcPlus, IcMinus, IcUp, IcDown, IcArrR, IcArrL, IcChevR, IcChevD, IcShip, IcAnchor, IcWh, IcSpk, IcAlert, IcUser, IcCheck, IcX, IcCart, IcCalc, IcFltr, IcDlr, IcStar, IcMagic, IcLnk, ...`

---

## 5. Patrones transversales

| # | Patrón | Detalle |
|---|---|---|
| P-01 | **Drag-and-drop de PDF universal** | Soltar un PDF en *cualquier* pantalla dispara el flujo "Cargar pedido". Overlay oscurece la pantalla actual. Un mismo gesto, siempre. |
| P-02 | **`⌘K` como cerebro** | Búsqueda global (productos, imports, pedidos, proveedores) + paleta de comandos ("crear pedido", "ir a IMP-2026-005", "marcar como pagada"). |
| P-03 | **Drill-down progresivo** | Listado → resumen lateral al seleccionar fila → click para detalle completo. Tres niveles, nunca más. |
| P-04 | **"Última modificación" en cada detalle** | Footer con "Modificado hace 2h por Lucas" → click → drawer lateral con historial de Auditoría sin salir del contexto. |
| P-05 | **Estados vacíos con CTA** | Nunca "no hay datos". Siempre "Aún no cargaste pedidos. Soltá un PDF acá o creá uno manual." + botón. |
| P-06 | **Toast + Undo** | Acciones reversibles confirman con toast 6s con botón Deshacer. Solo lo irreversible (confirmar pago, cerrar import) pide modal. |
| P-07 | **USD primero, ARS de referencia** | USD principal en mono tabular. ARS secundario en gris cuando aplica (gastos operativos). |
| P-08 | **Notificaciones sutiles** | Campana en top-bar. Eventos: ETA cambió, pago vencido, stock cruzó umbral, IA terminó de procesar PDF. Preferencias por tipo. |

### 5.1 Atajos de teclado

**Navegación (`go-to`)**
- `⌘K` — Búsqueda global / paleta
- `G D` — Dashboard · `G I` — Importaciones · `G P` — Pedidos · `G S` — Stock · `G R` — Rentabilidad

**Acciones**
- `N` — Nuevo (contextual)
- `⌘U` — Subir PDF
- `⌘Z` / `⌘⇧Z` — Deshacer / Rehacer
- `⌘,` — Configuración
- `?` — Ver atajos

**Listas (vim-style)**
- `J / K` — Mover selección
- `↵` — Abrir
- `/` — Buscar local
- `F` — Toggle filtros
- `X` — Multi-selección
- `Esc` — Cerrar

**Dominio**
- `⌘I` — "¿Tengo este producto?"
- `A / R` — Aceptar / rechazar item sugerido
- `+ / -` — Ajustar cantidad ±1 (con shift, ±10)
- `⌘↵` — Confirmar acción primaria

---

## 6. Modelo de datos (entidades core)

### 6.1 Producto (`Product`)
```ts
{
  id: string;                   // UUID
  sku: string;                  // ej. "WT-58-7001"
  nombre: string;               // "Marco Wintech 58 Blanco"
  familia: 'perfil' | 'herraje' | 'accesorio';
  linea: string;                // "Wintech 58", "Wintech 70", "Roto NT"
  color?: string;               // "Blanco", "Símil madera", etc.
  proveedor: string;            // "Adopen", "Roto Frank"
  unidad: 'unidad' | 'metro' | 'barra' | 'juego';
  pesoUnitarioKg: number;
  volumenUnitarioM3?: number;
  costoFobUsd: number;          // último FOB conocido
  landedCostUsd: number;        // calculado al recibir importación
  precioVentaUsd: number;
  margenObjetivoPct: number;    // ej. 35
  stockMinimo: number;          // umbral crítico
  stockObjetivo: number;        // sugerencia de reposición
  activo: boolean;
}
```

### 6.2 Importación (`Import`)
```ts
{
  id: string;
  codigo: string;               // "IMP-2026-005"
  proveedor: string;            // "Adopen"
  estado: 'borrador' | 'confirmada' | 'embarcada' | 'en_transito_maritimo'
        | 'en_puerto' | 'en_aduana' | 'en_transito_terrestre' | 'recibida' | 'cerrada';
  puertoEntrada: 'BUE' | 'MVD';
  fechaConfirmacion: Date;
  fechaEmbarque?: Date;
  etaPuerto: Date;
  fechaArribo?: Date;
  fechaDeposito?: Date;
  items: ImportItem[];          // ver 6.3
  costos: {
    fobUsd: number;
    maritimoUsd: number;
    estadiaDesembarqueUsd: number;
    despachoAduaneroUsd: number;
    terrestreUsd: number;
    arancelesImpuestosUsd: number;
    totalCifImpuestosUsd: number;   // calculado
  };
  pagos: Pago[];                // 30/40/30 a Adopen + logística
  forwarders: {
    maritimo: ProveedorLogId;
    estadia: ProveedorLogId;
    despachante: ProveedorLogId;
    terrestre: ProveedorLogId;
  };
  documentos: Documento[];      // factura, packing, BL, certif. origen, póliza, despacho, liquidación
  capacidad: {
    pesoTotalKg: number;
    volumenTotalM3: number;
    pesoMaxKg: 26000;
    volumenMaxM3: 67;
  };
}
```

### 6.3 Item de importación
```ts
{
  productoId: string;
  cantidad: number;
  costoFobUnitarioUsd: number;
  pesoTotalKg: number;        // cantidad * pesoUnitario
  origen: 'sugerido_ia' | 'manual' | 'critico' | 'mas_vendido';
}
```

### 6.4 Pedido (`Order`)
```ts
{
  id: string;
  codigo: string;               // "PED-2026-018"
  cliente: string;              // fabricante B2B
  fechaCreacion: Date;
  fechaEntregaSolicitada?: Date;
  estado: 'borrador' | 'confirmado' | 'preparando' | 'entregado' | 'facturado' | 'cancelado';
  origen: 'pdf_ia' | 'manual';
  pdfFuenteUrl?: string;        // si vino de PDF
  items: OrderItem[];
  totales: {
    subtotalUsd: number;
    descuentoPct?: number;
    totalUsd: number;
  };
}
```

### 6.5 Stock (`StockLevel`) — vista derivada por SKU
```ts
{
  productoId: string;
  fisico: number;               // en depósito
  reservado: number;            // en pedidos confirmados
  disponible: number;           // = fisico - reservado
  enTransito: { importId: string; cantidad: number; etaPuerto: Date }[];
  proximoArribo?: Date;
  estado: 'ok' | 'bajo' | 'critico' | 'sobrestock';
}
```

### 6.6 Proveedor logístico (`ProveedorLogistico`)
```ts
{
  id: string;
  nombre: string;               // "Maersk Line", "DHL Global Forwarding", "Andreani"
  tipo: 'maritimo' | 'estadia_desembarque' | 'despachante' | 'terrestre' | 'deposito';
  contacto: { ... };
  cotizacionesHistoricas: { fecha, ruta, costoUsd }[];
}
```

### 6.7 Comunicación con proveedor + historial de archivos

Cada importación tiene un **hilo de comunicación con el proveedor (Adopen)** que se va construyendo desde el armado hasta el cierre. El sistema **guarda cada archivo** que se envía y se recibe, con su versión, fecha, remitente y a qué etapa pertenece. Esto es el "expediente" de la importación.

**Tipos de documentos típicos en el ciclo:**

| Etapa | Documento | Dirección | Quién |
|---|---|---|---|
| Armado | Pedido inicial / RFQ (Excel o PDF) | → Adopen | Wintech envía |
| Cotización | Lista de precios cotizada | ← Adopen | Adopen envía |
| Negociación | Pedido revisado v2, v3… | ↔ ambos | Iteran |
| Confirmación | Factura proforma | ← Adopen | Adopen |
| Confirmación | Orden de compra (PO) firmada | → Adopen | Wintech |
| Producción | Confirmación de producción | ← Adopen | Adopen |
| Embarque | Factura comercial final | ← Adopen | Adopen |
| Embarque | Packing list | ← Adopen | Adopen |
| Embarque | Bill of Lading (BL) | ← Forwarder/Adopen | Maersk/Adopen |
| Embarque | Certificado de origen | ← Adopen | Adopen |
| Embarque | Póliza de seguro | ← Aseguradora | Aseguradora |
| Aduana | Despacho a plaza | interno | Despachante |
| Aduana | Liquidación aduanera | interno | Despachante |

```ts
type DocumentoImport = {
  id: string;
  importId: string;
  tipo: 'rfq' | 'cotizacion' | 'pedido_revisado' | 'proforma' | 'po_firmada'
      | 'confirmacion_produccion' | 'factura_comercial' | 'packing_list'
      | 'bl' | 'certificado_origen' | 'poliza_seguro'
      | 'despacho_plaza' | 'liquidacion_aduanera' | 'otro';
  version: number;                  // 1, 2, 3 — para iteraciones del mismo tipo
  esVersionActiva: boolean;         // true en la última versión
  nombreArchivo: string;            // "Pedido_IMP-2026-005_v3.xlsx"
  archivoUrl: string;               // S3/storage
  mime: string;                     // "application/pdf", "application/vnd.ms-excel"
  tamanoBytes: number;
  direccion: 'enviado' | 'recibido' | 'interno';
  fecha: Date;
  remitente: string;                // "Lucas P.", "ventas@adopen.com.tr"
  etapa: 'armado' | 'cotizacion' | 'confirmacion' | 'produccion' | 'embarque' | 'transito' | 'aduana' | 'cerrada';
  emailMensajeId?: string;          // si vino/se envió por email, vincula al MailMessage
  notas?: string;                   // anotaciones del usuario
}

type MailMessage = {
  id: string;
  importId: string;
  threadId: string;                 // hilo de email
  fecha: Date;
  direccion: 'enviado' | 'recibido';
  from: string;                     // "Lucas P. <lucas@wintech.com.ar>"
  to: string[];
  cc?: string[];
  asunto: string;
  cuerpo: string;                   // texto plano + html
  adjuntos: { docId: string; nombre: string }[];  // referencia a DocumentoImport
}
```

**Flujo de UI:**

- **Pestaña "Documentos"** del detalle de importación → lista todos los archivos agrupados por etapa, con badge de versión y dirección (↑ enviado / ↓ recibido).
- **Pestaña "Conversación"** → vista tipo email/timeline, cada mensaje con sus adjuntos linkeados a la lista de documentos.
- **Versionado**: cuando subís un nuevo "pedido revisado" o llega una nueva proforma, no se sobreescribe — se crea una versión nueva, la anterior queda accesible. La versión activa es la que cuenta para totales/cálculos.
- **Comparar versiones** (v2 vs v3 de cotización) → muestra qué cambió en precios/cantidades.
- **Subida**: drag-and-drop directo en la pestaña, o forward del email a `imports@wintech.app` que parsea adjuntos automáticamente y los asocia a IMP-XXXX por matching de asunto/código.
- **Trazabilidad**: cada movimiento queda en Auditoría (quién subió qué, cuándo).

### 6.8 Pago
```ts
{
  id: string;
  importId?: string;            // o vinculado a otra entidad
  concepto: string;             // "30% al confirmar", "40% al embarcar"
  montoUsd: number;
  vencimiento: Date;
  fechaPago?: Date;
  estado: 'pendiente' | 'vencido' | 'pagado';
}
```

### 6.9 Auditoría
```ts
{
  id: string;
  timestamp: Date;
  usuario: string;
  entidad: string;              // "import", "order", "product"
  entidadId: string;
  accion: string;               // "update", "create", "delete", "status_change"
  cambios: { campo: string; antes: any; despues: any }[];
}
```

---

## 7. Pantallas mockeadas (estado actual)

### 7.1 Dashboard (`Dashboard v6 Jardin San Jose.html`)
**Aprobada como dirección visual.** Estructura:

- Page header con saludo, fecha, pill "Equilibrio: positivo"
- Fila de 4 KPIs: Stock crítico (7 SKUs) · Imports en tránsito (3) · Pedidos pendientes · Margen del mes
- **Punto de equilibrio del mes** — gauge horizontal con marcador, USD necesario vs USD facturado
- Stack de paneles:
  - Próximas importaciones (timeline visual)
  - Stock crítico (lista priorizada con sugerencia de reposición)
  - Pedidos recientes
  - Acciones rápidas (4 botones: Armar import / Cargar PDF / Ver stock / Ver rentab.)
- Footer con última sincronización

### 7.2 Armar próxima importación (`Importaciones - Armar.html`)
**Wizard de 4 pasos:**
1. Proveedor ✓ (Adopen, pre-seleccionado)
2. **Items y cantidades** ← pantalla principal
3. Costos
4. Revisar

Componentes clave:
- **Banner de IA** — explica por qué pre-cargó N productos: críticos + consumo + 90 días + 20% buffer + holgura del contenedor
- **Tabs**: Sugeridos por IA / Stock crítico / Más vendidos / Catálogo completo
- **Tabla editable** con cantidades +/- (recalcula contenedor en vivo)
- **Ring de capacidad usada** (peso + volumen) en rail derecho
- **Resumen del pedido**: FOB + flete + aranceles
- **Plan de pago 30/40/30** preview
- **Footer sticky** con navegación del wizard

### 7.3 Detalle de importación (`Importacion - Detalle.html`)
Vista de IMP-2026-005 (en tránsito marítimo):

- **Hero** con código mono, estado, ruta, **ETA grande**, delta vs plan
- **Diagrama de ruta** de 5 paradas (Adopen → Embarque → Pto. BsAs → Aduana Cba → Depósito) con pins coloreados según estado y selector de puerto editable (BUE/MVD)
- **Stats de ruta**: tiempo total / transcurrido / restante / costo logístico
- **Tabs**: Resumen · Items · Costos · Pagos · Documentos · Timeline
- **Tramos y proveedores logísticos** — 4 forwarders separados, cada uno seleccionable (selector inline)
- **Items destacados** — preview 5 de 22
- **Rail derecho**:
  - Pago a Adopen 42% — schedule 30/12/40/30 con cuota crítica + countdown
  - Costo total estimado (FOB → CIF + impuestos = USD 185.560)
  - Documentos 5/8 cargados

### 7.4 Cargar pedido por PDF con IA (`Pedido - Cargar PDF.html`)
**Split screen** PDF original ↔ tabla parseada editable.

- **Banner IA** en header: "Procesado en 3.2s · 6 líneas extraídas · 4/6 matched · 2 para revisar · cliente reconocido (Aberturas del Centro)"
- **Izquierda**: viewer del PDF original con annotations numeradas (1–6) sobre los items, color-coded (verde match perfecto / amarillo warn / rojo sin match), zoom in/out
- **Derecha · datos del cliente extraídos**: cuenta corriente activa, CUIT, fecha entrega solicitada (en 18 días), forma de pago — todo editable
- **Derecha · tabla parseada** con 4 estados visuales por fila:
  - Verde claro = match perfecto al catálogo
  - Amarillo = warn (SKU sugerido por similitud, o stock crítico)
  - Naranja = error (sin match en catálogo, requiere acción)
- **Issues inline** debajo de cada fila problemática con CTAs específicos (Cambiar SKU / Confirmar igual / Asignar existente / Crear producto nuevo)
- **Cantidades editables** con +/- (recalcula total en vivo)
- **Footer summary**: líneas totales / pendientes de revisión / total USD / botones [Guardar borrador] [Confirmar pedido]

### 7.5 Documentos & comunicación con Adopen (`Importacion - Documentos.html`)
**Vista del expediente completo** de la importación: hilo de emails con el proveedor + biblioteca de archivos versionados. Reemplaza el clásico "tab Documentos" con algo más rico.

**Layout**: dos columnas (1.15fr / 1fr).

**Izquierda — Conversación con Adopen agrupada por etapa**:
- 11 emails organizados en las 7 etapas del proceso (Armado → Cotización → Confirmación → Producción → Embarque → Tránsito → Aduana)
- Cada mensaje: avatar, dirección (↑ enviado / ↓ recibido con badge), asunto, preview 2 líneas, attachments inline
- **Versiones de archivos visibles en su contexto**: el Excel del pedido va v1→v2 (v1 con strike-through como "superseded"); la cotización idem
- Etapas con muchos mensajes se pueden colapsar (ej: "Mostrar 4 mensajes de embarque")
- **Borrador automático destacado al pie**: cuando se detecta próxima acción esperable ("Cuando arribe el barco a BsAs, Adopen suele mandar liquidación final — tenés un email listo para pedir desglose")

**Derecha — Biblioteca de documentos (sticky panel)**:
- 15 archivos agrupados por la misma etapa (sticky stage headers)
- Cada archivo con badge de versión (v1/v2/ref/auto) — la activa en color ámbar/acento, las viejas grises
- Indicador "+1 prev." cuando hay historial
- Filtros: Todos / Enviados / Recibidos / v. activas
- Búsqueda local
- Los archivos pendientes (etapa Aduana aún no llegada) aparecen como placeholders grises con label "pendiente"
- Hover row → aparecen acciones [ver] [descargar]

**Sub-tabs del detalle de importación**:
Resumen · Items · Costos · Pagos · **Documentos** · Conversación · Timeline
*(Documentos = vista híbrida emails+archivos. Conversación = solo hilo plano. Timeline = eventos del estado de la import.)*

**Decisiones de diseño**:
- Mezclar emails + archivos en una sola vista en lugar de tabs separados → ves el contexto del archivo (qué se dijo al mandarlo)
- Versiones viejas visibles tachadas en los emails (para ver que existieron) pero ocultas en la biblioteca por default (sólo la activa)
- Realismo bilingüe: Adopen escribe en inglés, Wintech responde en español
- **Buzón mágico** `imports@wintech.app` — cualquier miembro del equipo puede forwardear emails de proveedores y aparecen automáticamente vinculados a la IMP por matching del código en asunto/cuerpo

### 7.6 Stock & Alertas (`Stock y Alertas.html`)
**Vista única operativa de inventario**: respuesta a "¿de qué tengo, cuánto, y cuánto está realmente disponible?" — con proyección a futuro.

**Estructura**:

- **Strip de 5 KPIs clickeables** (actúan como filtro): Total SKUs (450) · Críticos (5) · Bajos (12) · Saludables (408) · En tránsito (22). Cada uno con dot semántico y subtítulo. KPI activo se marca con stripe verde lateral.
- **Filter bar**: search global por SKU/nombre/color, segmented "Salud / Familia / Línea" para agrupar la tabla, chips de filtros aplicados (familia, proveedor) con remover inline, "+ Filtro" para agregar más.
- **Layout principal split**: tabla a la izquierda (1fr) + drill-down sticky a la derecha (380px).

**Tabla**:
- Agrupada con dividers por estado de salud (Crítico / Bajo / OK / Sobrestock), cada divider con count
- Columnas: Producto (nombre + SKU + línea + color en mono pequeño) · Estado (dot+label) · **Físico** · Reservado (gris) · **Disponible** (resaltado, color por estado) · Salud (mini gauge horizontal con físico verde + reservado ámbar superpuesto + línea roja vertical en el mínimo + % a la derecha) · En tránsito (badge teal `↗ +N · ETA` o em-dash si no hay) · Consumo/sem (cifra + delta vs anterior con flecha up/down)
- Hover row → muestra acciones inline (ver / cargar movimiento)
- Click row → marca selected (background ámbar suave + stripe verde lateral) y actualiza el rail derecho

**Rail derecho · drill-down progresivo (P-03)**:
1. **Header**: SKU mono + badge "Crítico" si aplica + nav anterior/siguiente/abrir-detalle, nombre del producto, familia/línea/color/proveedor
2. **Disponibilidad ahora**: 3 cards Físico / Reservado / Disponible (la última en gradiente cálido si está crítico). Si hay tránsito: card teal con `+N en tránsito · IMP-2026-005 · ETA 10 mar`
3. **Disponibilidad proyectada · próximos 90 días** — gráfico SVG custom con:
   - Línea de stock decreciente al ritmo de consumo
   - Marcador rojo punteado horizontal en el stock mínimo
   - Marcador teal vertical + dot en la fecha de ETA del próximo arribo (sumando el +N en tránsito)
   - Punto rojo donde la curva cruza el mínimo, con label "cruza min · día N"
   - Eje X: hoy / +30d / +60d / +90d
   - Leyenda compacta arriba: actual (verde) + import (teal)
4. **Reposición sugerida** (sólo crítico/bajo): banner ámbar con cantidad calculada (objetivo - físico - tránsito) + costo FOB estimado
5. **Últimos movimientos**: lista compacta con icono direccional (↑ egreso rojo / ↓ ingreso verde / 🛒 reservado ámbar), descripción con link al pedido/import, qty, fecha relativa
6. **Acciones**: stack de 3 CTAs — "Agregar a próxima importación" (primaria verde) / "Cargar movimiento" / "Ver histórico completo"

**Decisiones de diseño**:
- KPIs como filtros: doble función (dashboard + filtro) ahorra una pantalla aparte
- Gauge en cada fila en lugar de una columna numérica más → permite escanear visualmente el estado de cientos de SKUs
- Disponible = físico − reservado, mostrado en columna propia y resaltado: es la cifra más importante (lo que realmente puede vender), no el físico
- Proyección a 90d alineada con el ciclo de importación (que tarda ~90d puerta a puerta)
- Sobrestock como categoría visible (típicamente ignorado en sistemas) — alerta para evitar comprar de más
- Drill-down sticky: el rail no scrollea con la tabla, queda contextual durante toda la navegación

### 7.7 Pendientes de mockear
- **#5 Rentabilidad del mes** — margen bruto vs neto, punto de equilibrio, peor margen

---

## 8. Lógica de negocio crítica

### 8.1 Cálculo de stock disponible
```
disponible = fisico - reservado_en_pedidos_confirmados
disponible_proyectado(fecha) = disponible + suma_de_imports_que_arriban_antes_de(fecha)
```

### 8.2 Sugerencia "armar próxima importación"
Algoritmo (sugerencia de IA / regla determinista):
1. Para cada SKU calcular **consumo promedio últimos 90 días**.
2. **Cantidad sugerida** = (consumo_promedio × 90 días × buffer 20%) − stock_disponible − en_tránsito.
3. Filtrar SKUs con `cantidad_sugerida > 0`.
4. **Priorizar** los que cruzan stock crítico antes de la ETA.
5. Mientras haya holgura en el contenedor (peso < 26.000kg && volumen < 67m³), agregar también top vendidos no críticos.
6. Mostrar en tabs separados: *Sugeridos IA* / *Críticos* / *Top vendidos* / *Catálogo*.

### 8.3 Landed cost por SKU
Al recibir una importación:
```
landed_cost_unitario(sku) = costo_fob_unitario(sku) 
                         + (peso_unitario(sku) / peso_total_import) × costos_logisticos_totales
                         + (peso_unitario(sku) / peso_total_import) × aranceles_totales
```
Se actualiza el campo `landedCostUsd` del producto y se recalcula el margen.

### 8.4 Punto de equilibrio mensual
```
gastos_fijos_mes = alquiler + sueldos + servicios + amortización + ...
margen_promedio_pct = margen_bruto_total / ventas_total
punto_equilibrio_usd = gastos_fijos_mes / margen_promedio_pct
```
Dashboard muestra: facturado_acumulado_mes vs punto_equilibrio_usd como gauge.

### 8.5 Estados de importación (state machine)
```
borrador
  → confirmada           (al enviar PO a Adopen + 30%)
  → embarcada            (BL emitido + 40%)
  → en_transito_maritimo
  → en_puerto            (arribo a BUE/MVD)
  → en_aduana            (despacho iniciado)
  → en_transito_terrestre (post-despacho)
  → recibida             (descarga en depósito + conciliación)
  → cerrada              (landed cost calculado, costos asignados a SKUs)
```

### 8.6 Estados de pedido
```
borrador → confirmado → preparando → entregado → facturado
                     ↘ cancelado (en cualquier punto antes de entregar)
```

---

## 9. Stack técnico recomendado

> Esto es sugerencia, ajustar según preferencias.

- **Frontend**: React 18 + Vite + TypeScript + React Router
- **Estilos**: CSS variables (las del shell) + CSS modules o Tailwind con tokens custom
- **Estado**: TanStack Query para server state + Zustand para UI state
- **Forms**: React Hook Form + Zod
- **Tablas**: TanStack Table
- **Backend**: Node + Fastify/Express + PostgreSQL + Prisma
- **IA para PDFs**: API de Claude (Anthropic) para extracción estructurada → JSON
- **Auth**: una sola cuenta inicial, después multi-user con magic link
- **Hosting**: Vercel (frontend) + Railway/Fly (backend + DB)

### 9.1 Estructura de carpetas sugerida
```
/src
  /components
    /shell          → Sidebar, Topbar, Panel, Pill
    /icons          → componentes Ic*
    /forms
    /tables
  /features
    /dashboard
    /importaciones
      /armar        → wizard de 4 pasos
      /detalle      → IMP-XXXX
    /pedidos
      /cargar-pdf   → split screen IA
    /stock
    /productos
    /proveedores
    /rentabilidad
    /stats
    /gastos
    /auditoria
  /lib
    /api            → cliente HTTP
    /calc           → landed cost, punto equilibrio, sugerencia import
    /pdf            → integración con IA
  /styles
    tokens.css      → equivalente a wintech-shell.css :root
    shell.css
  /routes           → router config
```

---

## 10. Archivos de referencia en este proyecto

| Archivo | Propósito |
|---|---|
| `wintech-shell.css` | **Tokens + shell completo**. Copiar a `tokens.css` + `shell.css`. |
| `wintech-shell.jsx` | Sidebar, Topbar, set completo de íconos. |
| `Arquitectura de Informacion.html` | Documento detallado de IA, módulos, atajos, patrones (v0). |
| `Dashboard v6 Jardin San Jose.html` | Mockup dashboard aprobado. |
| `Importaciones - Armar.html` | Mockup wizard "armar próxima importación". |
| `Importacion - Detalle.html` | Mockup detalle de importación. |

---

## 11. Próximos pasos

1. **Mockups pendientes** (orden recomendado):
   - Cargar pedido por PDF (IA) — split screen
   - Stock & Alertas con disponibilidad futura
   - Rentabilidad del mes
2. **Definir backend**: schema Prisma a partir de §6 + endpoints CRUD básicos.
3. **Integrar IA**: prompt para extracción de PDFs de pedidos (mapear texto → array de `OrderItem`).
4. **Setup base**: monorepo + tokens + shell + routing + auth dummy.
5. **Implementar pantalla por pantalla** en orden de prioridad P1 → P2 → P3.

---

**Owner**: Lucas P. (dueño Wintech AR, Córdoba)  
**Diseño**: Jardín de San José design system, v1.0  
**Última actualización**: este doc se genera a partir del proyecto de mockups en HTML.
