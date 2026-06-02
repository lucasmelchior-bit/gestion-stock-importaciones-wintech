# 02 — Glosario (jerga del rubro ↔ código)

La "piedra Rosetta" del proyecto. La **UI y los documentos están en español**, pero los
**identificadores de código están en inglés**. Esta tabla es el puente: úsala para nombrar
variables, tablas y funciones de forma consistente, y para entender el dominio.

## Términos del negocio

| Español (negocio / UI) | Identificador en código (inglés) | Qué es |
|------------------------|----------------------------------|--------|
| abertura | (no se modela) | Ventana/puerta de PVC: el **producto final que fabrica el cliente**, no algo que Lucas venda. |
| perfil | `profile` | Barra de PVC para fabricar aberturas. Marca **Wintech**. Se vende por barra. |
| herraje | `hardware` | Accesorio metálico/mecánico para armar la abertura. Marca **Accado**. Por unidad/juego. |
| rueda | `wheel` | Rueda para aberturas corredizas. Otros proveedores. Por unidad/juego. |
| accesorio | `accessory` | Otros insumos varios. |
| producto / ítem | `product` | Cualquier cosa que Lucas tiene en catálogo y vende. |
| marca | `brand` | Wintech, Accado, etc. (la marca del producto). |
| proveedor | `supplier` | Quien le vende a Lucas. **Adopen** (Turquía) es el principal. |
| cliente | `client` | El **fabricante de aberturas** a quien Lucas le vende. |
| fabricante de aberturas | (= `client`) | Sinónimo de cliente en este negocio. |
| pedido de venta | `salesOrder` | Pedido que un cliente le hace a Lucas; descuenta stock. |
| pedido al proveedor / orden de importación | `purchaseOrder` | Pedido que Lucas le hace a su proveedor (importación). |
| stock / existencias | `stock` / `onHand` | Cantidad disponible en el depósito ahora. |
| stock en tránsito | `inTransitStock` | Mercadería ya pedida al proveedor que todavía no llegó. |
| stock crítico / mínimo | `minStock` | Nivel por debajo del cual se dispara una alerta. |
| punto de reposición | `reorderPoint` | Nivel de disponible que dispara la recomendación de pedir. |
| stock de seguridad | `safetyStock` | Colchón extra para cubrir variabilidad de la demanda. |
| demora de importación / lead time | `leadTimeDays` | Días desde que se pide al proveedor hasta tenerlo en depósito (~105). |
| velocidad de venta | `velocityPerDay` | Cuánto se vende por día de un ítem (aprendido del historial). |
| movimiento de stock | `stockMovement` | Cada entrada/salida/ajuste de stock (libro mayor). |
| barra | `bar` | Unidad de venta de los perfiles. |
| unidad / juego | `unit` / `set` | Unidad de venta de herrajes/ruedas. |

## Términos técnicos / del cálculo

| Término | Significado |
|---------|-------------|
| EWMA | *Exponentially Weighted Moving Average*: promedio que pondera más lo reciente; con eso se "aprende" la velocidad de venta. Ver `05-reglas-negocio.md`. |
| order-up-to level | Nivel objetivo de stock al que se quiere llegar al hacer un pedido. |
| nivel de servicio | Probabilidad objetivo de **no** quedarse sin stock (v1: ~95%, factor Z = 1,65). |
| ADR | *Architecture Decision Record*: registro de una decisión de diseño (carpeta `adr/`). |

## Relaciones que se confunden seguido (memorizar)

- **Wintech / Accado = marcas.** **Adopen = proveedor.** No son lo mismo.
- **Cliente = fabricante de aberturas** (le compra a Lucas). **Lucas no fabrica aberturas.**
- **Lucas le compra al proveedor (purchaseOrder)** y **le vende al cliente (salesOrder)**.
