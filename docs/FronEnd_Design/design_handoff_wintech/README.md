# Handoff: Wintech AR — Sistema de Stock & Importaciones

## Overview

Sistema interno (single-tenant, single-user) para **Wintech Argentina** — importador-distribuidor B2B de perfilería de PVC (Adopen TR) y herrajes (Roto NT). Lo opera **una sola persona** (Lucas P., dueño, Córdoba). Hace 4–6 importaciones/año desde Estambul, ~450 SKUs, ciclo puerta-a-puerta de ~90 días.

El sistema cubre 7 pantallas:

1. **Dashboard** — vista de comando con KPIs, alertas, próxima importación, feed de actividad
2. **Importaciones · Armar** — wizard para construir el próximo contenedor (sugerencias por consumo + simulador de llenado)
3. **Importación · Detalle** — timeline de ETA + plan de pagos + items + costos desembarcados
4. **Importación · Documentos** — repositorio de docs (factura, BL, despacho, etc.)
5. **Pedidos · Cargar PDF** — extracción asistida por IA de pedidos de cliente
6. **Stock & Alertas** — tabla de inventario con drill-down + proyección a 90 días
7. **Rentabilidad del mes** — punto de equilibrio + bridge bruto→neto + alerta de venta a pérdida

Hay además un mockup **"Arquitectura de Información"** y un canvas **"Dashboard – 3 opciones"** con tres exploraciones del dashboard antes de decidir la dirección final (v6 Jardín de San José).

---

## ⚠ Sobre los archivos de diseño

Los HTML en este bundle son **referencias visuales y de comportamiento**, no código de producción. Están construidos con React + Babel inline + CSS hand-rolled para iterar rápido en mockups, **no para desplegar**.

La tarea es **recrear estos diseños en el stack del codebase destino** (React + TS, Next, Vue, lo que sea) usando los patrones, librerías de UI, sistema de estado y backend ya establecidos. Si no hay codebase aún, elegí el stack más apropiado para un MVP B2B interno (sugerencia: **Next.js + TypeScript + Tailwind + tRPC + Prisma + Postgres**, con NextAuth para login).

**No copies el HTML tal cual.** Usá los mockups para entender:
- la jerarquía visual y la decisión de layout
- el copywriting exacto (es deliberado, en español rioplatense, conciso)
- los tokens de color/tipografía/espaciado
- el comportamiento de cada componente

---

## Fidelity

**Hi-fi.** Los mockups son pixel-perfect: colores finales, tipografía final (Inter + JetBrains Mono), espaciado final, microcopy final. Implementar respetando los valores exactos del design system descritos abajo.

Los datos son ficticios pero **realistas para el dominio** (USD 414k de venta mensual, contenedor de 67m³, plan 30/40/30, ETA 90 días puerta a puerta). Mantener esa escala de números al cargar fixtures de desarrollo.

---

## Documentación canónica

📖 **`diseno.md`** es el documento maestro. Tiene 700+ líneas con:
- Contexto de negocio + pain points + restricciones operativas (sección 1)
- Decisiones de arquitectura de información (sección 2-4)
- Sistema visual completo (Jardín de San José: paleta, tipografía, componentes) (sección 5-6)
- **Spec detallado de cada pantalla** con layout, componentes, copy, comportamiento (sección 7)

**Leelo entero antes de empezar a codear.** El README sintetiza pero `diseno.md` es la fuente de verdad.

---

## Stack del mockup (no replicar, solo entender)

- React 18 vía CDN (`react@18.3.1`)
- Babel standalone para JSX inline
- CSS plano en `wintech-shell.css` (variables CSS, no Tailwind)
- Componentes compartidos en `wintech-shell.jsx` (sidebar, topbar, iconos SVG inline)
- `design-canvas.jsx` solo para presentar variantes lado a lado en el mockup — no es parte del producto
- `tweaks-panel.jsx` solo para alternar variantes durante diseño — no es parte del producto

---

## Design system: Jardín de San José

Paleta inspirada en jardín de hierbas mediterráneas. Definida en `wintech-shell.css` líneas 1–35.

### Colores
```css
--ink:       #29261B   /* texto principal — marrón oscuro, no negro */
--ink-2:     #5E5A33   /* texto secundario */
--ink-3:     #8C8867   /* texto terciario / labels */
--paper:     #F6F4EF   /* fondo página — papel */
--paper-2:   #EFECE3   /* fondo paneles secundarios */
--line:      #C8C2A8   /* bordes fuertes */
--line-soft: #E5E0CC   /* bordes suaves */

--primary:      #1F3818   /* verde olivo oscuro — color de marca */
--primary-2:    #2E4D24   /* verde olivo medio */
--primary-soft: #DCE6CC   /* verde olivo lavado */
--teal:         #8AA63E   /* verde lima — acento */
--teal-soft:    #E8F0CF
--accent:       #F5C842   /* amarillo mostaza — highlight */
--accent-2:     #F4A93A   /* naranja mostaza */
--accent-soft:  #FCEFB4
--lily:         #FFFFFE   /* blanco lirio */

--eq-from: #93B041     /* gradiente "punto de equilibrio" */
--eq-to:   #6E8530

--ok:   #5C8A1E        /* verde bandera — estados positivos */
--warn: #D89020        /* ámbar — atención */
--crit: #C03A1F        /* rojo terracota — crítico */
```

**Reglas:**
- Nunca usar negro puro. El texto va en `--ink` (#29261B).
- Verde olivo oscuro (`--primary`) = sidebar, botones primarios, headers de marca.
- Amarillo mostaza (`--accent`) = highlights ocasionales, acento en hero, marcador de stripe activo.
- Rojo terracota (`--crit`) solo para alertas reales (stock crítico, venta a pérdida). No para errores de form (esos van en `--warn`).

### Tipografía
- **Inter** (400/500/600/700) — todo el texto general
- **JetBrains Mono** (400/500/600) — números, SKUs, fechas, valores monetarios, códigos, anything tabular

```css
--mono: 'JetBrains Mono', monospace;
```

**Escala (de mockups, ajustar a tu sistema):**
- H1 página: 22px / 600 / -0.02em
- H2 hero: 30px / 600 / -0.015em
- H3 panel: 13.5px / 600
- Body: 13px / 400 / 1.5
- Lede: 13px / 400 / 1.45 con `<b>` en 600 para enfatizar números clave
- KPI valor: 24-26px / 600 mono
- Label uppercase: 10.5px / 600 / 0.05em letter-spacing

### Espaciado
Usado en mockups: 6, 8, 10, 12, 14, 16, 18, 22, 28, 32. No es una escala estricta — usá tu spacing system pero respetá la **densidad alta** (es una herramienta operacional, no un sitio público).

### Bordes y sombras
```css
border-radius: 6px (botones), 7px (inputs), 8-12px (paneles), 14px (heroes)
border: 1px solid var(--line-soft)  /* default panel border */
shadow: 0 1px 0 rgba(94,90,51,0.03)  /* shadow plano sutil */
```

Sombras dramáticas = NO. Estética flat-papel.

### Iconografía
Iconos SVG inline, stroke 1.5px, viewBox 24x24, redondeados. Definidos en `wintech-shell.jsx` líneas 1–45. Si usás librería en prod: **Lucide** es la más cercana (mismo lenguaje visual).

---

## Arquitectura de información

### Sidebar (248px fijo izq) — 3 grupos + sistema
- **Operación**: Dashboard · Importaciones · Pedidos · Stock & Alertas
- **Catálogo**: Productos · Proveedores Adopen · Proveedores logísticos
- **Análisis**: Rentabilidad · Estadísticas · Gastos operativos
- **Sistema**: Ajustes · Auditoría

Sidebar tiene un stripe horizontal en el top (verde→amarillo→verde) como marca visual sutil. Item activo: fondo `--primary-soft`, color `--primary`, font-weight 600, stripe izquierdo de 2px en `--accent`.

### Topbar contextual
- Breadcrumbs izquierda (separador `›`)
- Búsqueda global en el medio (placeholder "Buscar o ejecutar…", `⌘K`)
- Acciones primarias derecha (cambian por pantalla)
- Bell de notificaciones + avatar al final

### Atajo global ⌘K
Es la **columna vertebral**. Abre paleta de comandos con:
- Búsqueda de productos / importaciones / clientes
- Acciones ejecutables ("Nueva importación", "Cargar pedido por PDF", "Ir a stock crítico")
- Drag-and-drop de PDF en cualquier lado del sistema → abre el flujo de "Cargar pedido por PDF"

(En el mockup el ⌘K es indicativo, no funcional — implementarlo de verdad es prioridad.)

---

## Pantallas — resumen ejecutivo

> Detalle completo en `diseno.md` § 7. Acá los highlights para que el dev entienda intent.

### 01 Dashboard (`Dashboard v6 Jardin San Jose.html`)
**Pregunta que responde**: "¿Qué pasa hoy en el negocio?"
- Hero: próxima importación con timeline de hitos (confirmado → embarcado → en tránsito → arribado → despachado)
- 4 KPIs: ventas mes, margen bruto, stock crítico, próxima importación ETA
- Panel "Necesita tu atención": lista priorizada de acciones (stock crítico, pago pendiente Adopen, pedido sin confirmar)
- Feed de actividad lateral (últimos eventos)

Hay 3 versiones exploradas en `00 Dashboard - 3 opciones`. Solo implementar la **v6 Jardín de San José**.

### 02 Importaciones · Armar (`02 Importaciones - Armar.html`)
**Pregunta**: "¿Qué meto en el próximo contenedor?"
- Sugerencias automáticas por velocidad de consumo (qué SKUs se van a quedar sin stock antes de los 90d de la próxima)
- Carrito lateral con simulador de llenado: ocupación m³, peso kg, valor FOB, ambos vs límite del 40' HC
- Buscador de catálogo + "agregar a la importación"
- Plan de pagos preview (30/40/30) con fechas estimadas

### 03 Importación · Detalle (`03 Importacion - Detalle.html`)
**Pregunta**: "¿Cómo viene la importación que ya armé?"
- Timeline horizontal con 5 hitos + porcentaje de avance
- Plan de pagos con cuotas, montos USD, fechas, estado (pagado/vence/atrasado)
- Tabla de items con cantidad, FOB unitario, FOB total, peso, m³
- Sidebar con landed cost estimado vs real (cuando llegue el despacho)

### 04 Importación · Documentos (`04 Importacion - Documentos.html`)
Repositorio de PDFs adjuntos a la importación (factura proforma, BL, póliza seguro, despacho de aduana, etc.) con drag-drop.

### 05 Pedidos · Cargar PDF (`05 Pedidos - Cargar PDF.html`)
**Pregunta**: "¿Cómo cargo este pedido sin retipear?"
- Panel izq: PDF original del cliente (preview)
- Panel der: tabla extraída por IA (SKU detectado, descripción, cantidad, confianza)
- Cells con baja confianza marcadas en ámbar para revisión manual
- Botón "Confirmar pedido" → genera Pedido de cliente

### 06 Stock & Alertas (`06 Stock y Alertas.html`)
**Pregunta**: "¿Qué SKU se está por quedar sin stock?"
- 5 KPIs clickeables como filtro (total / críticos / bajos / saludables / en tránsito)
- Tabla con mini-gauge horizontal por fila (físico verde + reservado ámbar + línea roja en mínimo)
- Columna "Disponible" (físico − reservado) destacada
- Drill-down sticky derecho con 3 cards (físico/reservado/disponible) + proyección a 90d + reposición sugerida

### 07 Rentabilidad del mes (`07 Rentabilidad.html`)
**Pregunta**: "¿Cuándo cubrí mis gastos del mes?"
- Hero: punto de equilibrio en formato fecha ("Cubriste el equilibrio el 22 abr") + gauge horizontal con marcador en break-even
- 4 KPIs: ventas, margen bruto, margen neto, utilidad neta — todos con delta vs mes anterior
- Alerta de SKUs vendiéndose a pérdida (bajo landed cost)
- Bridge bruto→neto en barras horizontales descontando costos directos y gastos fijos
- Mix donut por familia + trend chart de 12 meses + tablas peor margen / mejor margen

---

## Modelo de dominio (sugerencia)

```
Producto (SKU, familia, descripción, peso_unitario_kg, volumen_unitario_m3, fob_actual_usd, stock_minimo)
Importacion (id, proveedor, fob_total, fecha_confirmacion, eta_estimada, estado)
ImportacionItem (importacion_id, sku, cantidad, fob_unitario)
Pago (importacion_id, porcentaje, monto_usd, fecha_vencimiento, fecha_pago, estado)
Documento (importacion_id, tipo, archivo, fecha)
Pedido (id, cliente, fecha, estado, archivo_pdf_original)
PedidoItem (pedido_id, sku, cantidad, precio_unitario)
StockMovimiento (sku, cantidad, tipo: entrada/salida/reserva, fecha, ref)
Cliente (id, razon_social, cuit, condicion_pago)
GastoOperativo (mes, categoria, monto_ars, monto_usd_equivalente)
```

Restricción operativa clave para el dominio: **contenedor 40' HC = 26.000 kg / 67 m³ utilizable**. Hardcodear como constante o tabla `tipo_contenedor`.

---

## Interacciones críticas

1. **⌘K en cualquier pantalla** abre paleta global.
2. **Drop de PDF en cualquier pantalla** → modal "¿Cargar como pedido de cliente?" → flujo 05.
3. **Click en KPI del dashboard** → navega a la pantalla del módulo (Stock crítico → Stock & Alertas filtrado por críticos).
4. **Click en fila de stock** → abre drill-down sticky derecho (no nueva página).
5. **Punto de equilibrio del mes** se recalcula con cada venta cargada — si el dev backend no tiene esto resuelto, calcular: `gastos_fijos_mes / margen_bruto_promedio_pct = facturacion_break_even`, después interpolar la fecha en el calendario.

---

## Lo que NO está diseñado todavía (próximos sprints)

- Catálogo de productos (CRUD)
- Detalle de cliente / cuenta corriente
- Vista de proveedores logísticos (despachantes, freight forwarders)
- Estadísticas (dashboard analítico extendido)
- Gastos operativos (carga manual mensual)
- Ajustes / configuración
- Auditoría
- Login / multi-usuario (por ahora single-user)

Cuando llegue el momento, pedir más mockups antes de improvisar.

---

## Archivos del bundle

| Archivo | Qué es |
|---|---|
| `README.md` | Este documento |
| `diseno.md` | **Spec maestro — leer entero** |
| `Arquitectura de Informacion.html` | Mockup de la IA con razonamiento de decisiones |
| `00 Dashboard - 3 opciones exploradas.html` | Canvas con v4/v5/v6 lado a lado (referencia, no implementar v4 ni v5) |
| `01 Dashboard.html` | Dashboard final (v6) |
| `02 Importaciones - Armar.html` | Wizard armar contenedor |
| `03 Importacion - Detalle.html` | Detalle/timeline importación |
| `04 Importacion - Documentos.html` | Documentos adjuntos |
| `05 Pedidos - Cargar PDF.html` | Cargar pedido por PDF con IA |
| `06 Stock y Alertas.html` | Inventario + drill-down |
| `07 Rentabilidad.html` | Punto de equilibrio + bridge |
| `wintech-shell.css` | Tokens + estilos del shell (sidebar, topbar) — **fuente de verdad de paleta** |
| `wintech-shell.jsx` | Componentes compartidos del shell + iconos |
| `design-canvas.jsx` | Canvas de exploración (no implementar) |
| `tweaks-panel.jsx` | Panel de tweaks de diseño (no implementar) |

---

## Cómo recrear los HTML localmente

Cada HTML es self-contained excepto por los `<link>` y `<script>` a `wintech-shell.css` / `wintech-shell.jsx`. Para verlos:

```bash
cd design_handoff_wintech
python3 -m http.server 8000
# abrir http://localhost:8000/01%20Dashboard.html
```

(No abrir directamente con `file://` — Babel necesita HTTP por CORS.)
