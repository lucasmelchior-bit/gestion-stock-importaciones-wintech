# 05 — Reglas de negocio: pronóstico y reposición

**Fuente de verdad de la matemática.** El código de `src/domain/` debe implementar exactamente
esto. Si cambiás una fórmula, actualizá este documento en el mismo commit. Cada regla tiene un ID
(`BR-n`) que se cita desde el código y los tests.

> **A reconciliar (Fase de importaciones/reposición):** el diseño "Jardín de San José" (`adr/0005`)
> propone una sugerencia de reposición más simple —"consumo promedio de 90 días + 20% de buffer"—
> y menciona un lead time de ~90 días, mientras que acá se usa **EWMA + stock de seguridad (Z)** y
> **105 días**. No se resuelve todavía: lo más probable es que convivan un método simple para la
> sugerencia rápida y el estadístico para el forecast. Además el diseño agrega cálculos nuevos
> (landed cost por SKU, punto de equilibrio mensual) que se formalizarán como `BR-10`, `BR-11`, …
> Ver [`FronEnd_Design/diseno.md`](FronEnd_Design/design_handoff_wintech/diseno.md) §8.

## Parámetros globales (tabla `settings`)

| Parámetro | Símbolo | Default | Significado |
|-----------|---------|---------|-------------|
| Nivel de servicio | `Z` | **1,65** | Factor para ~95% de no quebrar stock. |
| Período de demanda | `P` | **7 días** (semanal) | Tamaño del bucket para medir consumo. |
| Suavizado EWMA | `α` (alpha) | **0,3** | Cuánto pesa el período más reciente. |
| Lead time base | `L` | **105 días** | Demora de importación (override por producto/proveedor). |
| Horizonte de cobertura | `C` | **90 días** | Cuánto stock extra cubrir al pedir (para no pedir muy seguido). |

## BR-1 — Bucketizar el consumo

A partir de los movimientos de stock de tipo venta (`stock_movement.type = 'sale'`), sumar la
cantidad vendida de cada producto por período fijo `P` (semanal). Guardar en `demand_history`
(`qty_sold` por `period_start`). El semanal suaviza el ruido diario sin perder reactividad.

## BR-2 — Aprender la velocidad de venta (EWMA)

Con la serie de consumo por período, se calcula un promedio que pondera más lo reciente
(así "aprende" y se adapta a tendencias):

```
demanda_P(t)   = cantidad vendida en el período t
smoothed(t)    = α · demanda_P(t) + (1 − α) · smoothed(t−1)     // α = 0,3
velocity_per_day = smoothed(t) / P_dias                         // P_dias = 7
```

Inicialización: `smoothed(0) = demanda_P(0)` (primer período con datos).
Se persiste en `demand_forecast`: `velocity_per_day`, el desvío estándar de la demanda diaria
reciente (`velocity_stddev`), `data_points` (cantidad de períodos con datos) y `method`.

## BR-3 — Demanda durante el lead time

```
demandDuringLeadTime = velocity_per_day · L
```
`L` = `product.lead_time_days` si está definido; si no, `supplier.default_lead_time_days` (105).

## BR-4 — Stock de seguridad

Colchón contra la variabilidad de la demanda durante el lead time:

```
sigma_LT    = velocity_stddev_por_dia · √L
safetyStock = Z · sigma_LT
```
Si el producto tiene un `safety_stock` manual cargado, se usa `max(safetyStock_calculado, manual)`.

## BR-5 — Punto de reposición

```
reorderPoint = demandDuringLeadTime + safetyStock
```

## BR-6 — Disponibilidad y alerta (FR-4 / FR-5)

```
available = on_hand + in_transit
```
- `on_hand` = suma de `stock_movement.qty` del producto (o la cache `product_stock`).
- `in_transit` = suma de `(qty_ordered − qty_received)` de las líneas de compra cuyo pedido está
  en estado `placed` o `in_transit`.

**Disparar alerta de reposición cuando:**
```
available ≤ reorderPoint
```
Clave: se compara contra `on_hand + in_transit`, así un pedido ya hecho **evita alertas
duplicadas**, y se avisa **antes** de que la autonomía baje del lead time (para que el nuevo
pedido llegue antes de quebrar stock).

## BR-7 — Cantidad recomendada a pedir (order-up-to)

Cubrir el lead time **más** un horizonte de cobertura `C` (para no pedir demasiado seguido):

```
orderUpToLevel = velocity_per_day · (L + C) + safetyStock
recommendedQty = max(0, orderUpToLevel − available)
```
Redondear hacia arriba a múltiplos de pack/barra del proveedor cuando aplique.

## BR-8 — Autonomía / fecha estimada de quiebre (informativo)

```
projectedStockoutDays = available / velocity_per_day      // ∞ si velocity = 0
```
Sirve para mostrarle a Lucas "te queda stock para ~N días".

## Ejemplo numérico (debe dar estos valores en los tests)

Producto: un perfil Wintech, unidad = barra.
- `velocity_per_day` = 2 barras/día (≈ 14/semana), `velocity_stddev_por_dia` = 0,5, `L` = 105, `C` = 90, `Z` = 1,65.

```
demandDuringLeadTime = 2 · 105                = 210
sigma_LT             = 0,5 · √105 ≈ 0,5·10,25 = 5,12
safetyStock          = 1,65 · 5,12            ≈ 8,45
reorderPoint         = 210 + 8,45             ≈ 218,45   → 218

on_hand = 120, in_transit = 0  →  available = 120
120 ≤ 218  →  SE DISPARA ALERTA

orderUpToLevel = 2 · (105 + 90) + 8,45        ≈ 398,45   → 398
recommendedQty = 398 − 120                    = 278 barras (redondear a pack)
projectedStockoutDays = 120 / 2               = 60 días
```

## BR-9 — Casos borde

- **Producto nuevo sin historial:** `method = 'insufficient_data'`. No se inventa pronóstico:
  se usa el `min_stock` manual y se marca el producto como "necesita estimación manual" hasta
  tener ~3 períodos con ventas.
- **Demanda intermitente** (herrajes que se venden de a saltos): el EWMA semanal puede leer cero
  entre picos. Marcar `method = 'intermittent'`, ampliar el `safetyStock` y apoyarse más en el
  `min_stock`. (Mejora futura: método tipo Croston.)
- **Unidades:** los cálculos se hacen en la unidad del producto (barra vs unidad). Nunca mezclar.
- **Estacionalidad fuerte:** fuera de alcance v1; el EWMA se adapta gradualmente. Ver `adr/0003`.
- **Moneda:** el costo en USD es informativo; la matemática es por cantidad. Se puede mostrar la
  exposición en USD de un pedido sugerido (`Σ qty · unit_cost_usd`) sin meter el tipo de cambio
  en el cálculo de stock.
- **Cancelaciones/devoluciones:** se registran como ajustes de stock; el historial de demanda
  (BR-1) cuenta solo ventas genuinas, no ajustes.
