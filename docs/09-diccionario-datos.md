# 09 — Diccionario de datos

Explicación en prosa de cada tabla y columna. El DDL canónico está en
[`../db/schema.sql`](../db/schema.sql). Si hay diferencia, **gana `schema.sql`** (y se corrige acá).

> **Pendiente de expansión (Fase 2+):** este diccionario describe el esquema de la Fase 0. La
> Fase 2 agrega columnas a `product` (`family`, `line`, `color`, `weight_kg`, `volume_m3`,
> `target_margin_pct`, `landed_cost_usd`, `target_stock`) vía la migración `0002`, y fases
> siguientes sumarán tablas nuevas del diseño (importaciones, pagos, documentos, etc.). Cada cambio
> se refleja acá junto con su migración. Ver `adr/0005`.

## supplier — proveedores
| Columna | Tipo | Significado |
|---------|------|-------------|
| id | INTEGER PK | Identificador. |
| name | TEXT | Nombre (ej.: "Adopen"). |
| country | TEXT | País (ej.: "Turquía"). |
| default_lead_time_days | INTEGER | Lead time por defecto en días (≈105). |

## brand — marcas
| id | INTEGER PK | Identificador. |
| name | TEXT | Marca (Wintech, Accado, etc.). |

## client — clientes (fabricantes de aberturas)
| id | INTEGER PK | Identificador. |
| name | TEXT | Nombre del cliente. |
| contact | TEXT | Contacto (tel/mail). |
| notes | TEXT | Notas libres. |
| active | INTEGER (0/1) | Activo. |

## product — productos
| Columna | Tipo | Significado |
|---------|------|-------------|
| id | INTEGER PK | Identificador. |
| sku | TEXT UNIQUE | Código único del producto. |
| name | TEXT | Nombre/descripción. |
| category | TEXT | `profile` / `hardware` / `wheel` / `accessory`. |
| brand_id | INTEGER FK→brand | Marca. |
| supplier_id | INTEGER FK→supplier | Proveedor. |
| unit | TEXT | Unidad de venta: `bar` / `unit` / `set` / `meter`. |
| bar_length_m | REAL NULL | Largo de barra (solo perfiles; informativo en v1). |
| last_cost_usd | REAL NULL | Último costo de importación en USD. |
| sale_price_ars | REAL NULL | Precio de venta en ARS. |
| min_stock | REAL | Stock crítico/mínimo manual (alerta y fallback sin historial). |
| safety_stock | REAL | Stock de seguridad manual (se usa el máximo vs. el calculado). |
| lead_time_days | INTEGER NULL | Lead time propio; si NULL usa el del proveedor. |
| active | INTEGER (0/1) | Activo (baja lógica). |
| created_at / updated_at | TEXT | Timestamps ISO. |

## stock_movement — libro mayor de stock (append-only)
| id | INTEGER PK | Identificador. |
| product_id | INTEGER FK→product | Producto. |
| qty | REAL | **Con signo:** + entrada/ajuste-suma, − venta/ajuste-resta. |
| type | TEXT | `sale` / `purchase_receipt` / `adjustment` / `initial`. |
| ref_table | TEXT NULL | Tabla de origen (`sales_order_line` / `purchase_order_line`). |
| ref_id | INTEGER NULL | Id de la fila de origen. |
| moved_at | TEXT | Fecha del movimiento (alimenta el historial de demanda). |
| note | TEXT NULL | Motivo/observación. |
> **on_hand(producto) = SUMA(qty) del producto.**

## product_stock — cache de stock en mano (lectura rápida)
| product_id | INTEGER PK FK→product | Producto. |
| on_hand | REAL | Suma de movimientos; se actualiza en la misma transacción que el movimiento. |
| updated_at | TEXT | Última actualización. |

## sales_order / sales_order_line — pedidos de venta
**sales_order:** id, client_id (FK), status (`open`/`confirmed`/`delivered`/`cancelled`),
ordered_at, delivered_at, notes.
**sales_order_line:** id, sales_order_id (FK), product_id (FK), qty, unit_price_ars.
> Al confirmar/entregar se generan movimientos `sale` (qty negativa).

## purchase_order / purchase_order_line — pedidos al proveedor (importaciones)
**purchase_order:** id, supplier_id (FK), status (`draft`/`placed`/`in_transit`/`received`/`cancelled`),
placed_at (arranca el reloj del lead time), expected_at (= placed_at + lead time), received_at,
currency (default USD), notes.
**purchase_order_line:** id, purchase_order_id (FK), product_id (FK), qty_ordered, qty_received, unit_cost_usd.
> **in_transit(producto) = SUMA(qty_ordered − qty_received)** sobre líneas con pedido en `placed`/`in_transit`.

## demand_history — consumo por período
| id | INTEGER PK | Identificador. |
| product_id | INTEGER FK→product | Producto. |
| period_start | TEXT | Inicio del período (semana ISO o mes). |
| qty_sold | REAL | Cantidad vendida en el período. |
| UNIQUE(product_id, period_start) | | Un registro por producto y período. |

## demand_forecast — estado aprendido por producto
| product_id | INTEGER PK FK→product | Producto (1 fila por producto). |
| velocity_per_day | REAL | Velocidad de venta suavizada (BR-2). |
| velocity_stddev | REAL | Desvío de la demanda diaria (alimenta el safety stock). |
| method | TEXT | `EWMA` / `naive` / `manual` / `insufficient_data` / `intermittent`. |
| data_points | INTEGER | Cantidad de períodos con datos (confianza). |
| last_computed_at | TEXT | Última vez que se recalculó. |

## settings — configuración (fila única, id = 1)
| service_level_z | REAL | Z (default 1,65). |
| forecast_period_days | INTEGER | P (default 7). |
| ewma_alpha | REAL | α (default 0,3). |
| coverage_days | INTEGER | C (default 90). |
