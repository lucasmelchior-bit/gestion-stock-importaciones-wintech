# 04 — Modelo de dominio

Entidades del negocio y cómo se relacionan. El esquema técnico (DDL) está en
[`../db/schema.sql`](../db/schema.sql) y explicado columna por columna en
[`09-diccionario-datos.md`](09-diccionario-datos.md).

> **Pendiente de expansión (Fase 2+):** el diseño "Jardín de San José" (`adr/0005`) introduce
> entidades nuevas que todavía no están modeladas acá: importación enriquecida (timeline de 9
> estados, costos logísticos, capacidad de contenedor), pago, documento de importación (versionado),
> proveedor logístico, gasto operativo y auditoría; y campos nuevos en `product` (familia, línea,
> color, peso, volumen, landed cost, stock objetivo) y vistas derivadas de stock (físico /
> reservado / disponible / en tránsito). Se incorporan con migraciones append-only cuando llegue su
> fase. Ver [`FronEnd_Design/diseno.md`](FronEnd_Design/design_handoff_wintech/diseno.md) §6.

## Entidades

- **supplier (proveedor):** quien le vende a Lucas. Tiene un `default_lead_time_days` (~105).
  Ej.: Adopen.
- **brand (marca):** Wintech, Accado, etc.
- **client (cliente):** el fabricante de aberturas a quien Lucas le vende.
- **product (producto):** el ítem de catálogo. Pertenece a una marca y a un proveedor; tiene una
  unidad de venta, costo, precio, stock mínimo y (opcional) lead time propio.
- **stock_movement (movimiento de stock):** **libro mayor append-only.** Cada fila es una
  entrada (+) o salida (−) de stock con su motivo. **El stock en mano es la suma de los
  movimientos** de un producto. Se mantiene una cache (`product_stock`) para lectura rápida.
- **sales_order / sales_order_line (pedido de venta + líneas):** lo que un cliente le pide a
  Lucas. Al confirmarse/entregarse genera movimientos de salida.
- **purchase_order / purchase_order_line (pedido al proveedor + líneas):** importación. Mientras
  está "pedido/en tránsito" aporta **stock en tránsito**; al recibirse genera movimientos de entrada.
- **demand_history (historial de demanda):** consumo agregado por período (semanal) por producto;
  se deriva de los movimientos de venta.
- **demand_forecast (pronóstico):** estado aprendido por producto (velocidad por día, desvío,
  método, cantidad de datos, última actualización).
- **settings (configuración):** fila única con parámetros globales (Z, período, alpha, etc.).

## Relaciones (texto)

```
supplier 1───* product *───1 brand
client   1───* sales_order 1───* sales_order_line *───1 product
supplier 1───* purchase_order 1───* purchase_order_line *───1 product
product  1───* stock_movement
product  1───* demand_history
product  1───1 demand_forecast
```

- Un **producto** tiene un proveedor y una marca.
- Un **pedido de venta** es de un cliente y tiene varias líneas (cada una un producto + cantidad).
- Un **pedido al proveedor** es a un proveedor y tiene varias líneas.
- Cada **movimiento de stock** referencia (opcionalmente) la línea de venta o de compra que lo originó.

## Unidades de medida (importante)

- **Perfiles (Wintech):** unidad = **barra** (`bar`). Opcionalmente se guarda `bar_length_m`
  (largo de la barra) por si en el futuro se cotiza por metro; en v1 es informativo.
- **Herrajes (Accado) y ruedas:** unidad = **unidad** (`unit`) o **juego** (`set`).
- **Regla:** la velocidad de venta y los cálculos de reposición se hacen **en la unidad propia del
  producto**. Nunca se mezclan unidades entre productos.

## Estados

- **sales_order.status:** `open` → `confirmed` → `delivered` (o `cancelled`).
  El descuento de stock ocurre al `confirmed`/`delivered` (definir en Fase 4; ver `06-arquitectura.md`).
- **purchase_order.status:** `draft` → `placed` → `in_transit` → `received` (o `cancelled`).
  Cuenta como stock en tránsito en `placed`/`in_transit`; suma stock al pasar a `received`.

## Moneda

- **Costo** del producto en **USD** (`last_cost_usd`); **precio de venta** en **ARS**
  (`sale_price_ars`). No se promedian ni mezclan. La matemática de stock es **por cantidad**
  (no depende de la moneda).
