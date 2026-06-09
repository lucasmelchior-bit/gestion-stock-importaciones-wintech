# 03 — Requerimientos funcionales

**Fuente de verdad del QUÉ.** Cada requerimiento tiene un ID estable (`FR-n`) que se cita desde
el código y los commits. Si algo cambia, se actualiza acá primero.

> **Pendiente de expansión (Fase 2+):** al adoptar el diseño "Jardín de San José" como norte
> (`adr/0005`), el alcance crece con requerimientos aún no formalizados acá: importaciones con
> timeline y costos logísticos, plan de pagos 30/40/30, carga de pedidos por PDF con IA, costo
> desembarcado (landed cost), rentabilidad / punto de equilibrio y auditoría. Se irán agregando
> como `FR-9`, `FR-10`, … a medida que cada fase los implemente. La fuente visual/funcional
> mientras tanto es [`FronEnd_Design/`](FronEnd_Design/design_handoff_wintech/diseno.md).

## FR-1 — ABM de productos

El usuario puede dar de **alta, baja (lógica) y modificación** de productos. Cada producto tiene:
código (SKU), nombre, categoría (perfil/herraje/rueda/accesorio), marca, proveedor, unidad de
venta (barra/unidad/juego), costo (USD), precio de venta (ARS), stock mínimo, lead time propio
(opcional; si no, usa el del proveedor) y estado activo/inactivo.

## FR-2 — Stock vivo por ítem

El sistema mantiene el **stock actual** de cada producto. El stock surge de un **libro mayor de
movimientos** (entradas, salidas, ajustes). El usuario puede:
- Ver el stock actual de todos los ítems.
- Hacer una **carga inicial** de stock.
- Registrar **ajustes manuales** (con motivo).

## FR-3 — Pedidos de venta

El usuario puede registrar **pedidos de venta** a un cliente, con varios productos y cantidades.
Al **confirmar/entregar** el pedido, el stock de cada ítem se **descuenta automáticamente**
(genera movimientos de salida). Estos movimientos alimentan el historial de demanda (FR-6).

## FR-4 — Alertas de stock crítico

Cada producto tiene un **stock crítico/mínimo**. El sistema **alerta** cuando el disponible
(stock en mano + en tránsito) cae a o por debajo del **punto de reposición**, para incluir ese
ítem en el próximo pedido al proveedor. Ver la matemática en `05-reglas-negocio.md` (BR-5/BR-6).

## FR-5 — Pedidos al proveedor (importaciones) y stock en tránsito

El usuario puede registrar **pedidos al proveedor** (importaciones), con su fecha de pedido y
fecha estimada de llegada (fecha de pedido + lead time). Mientras no llegan, esas cantidades
cuentan como **stock en tránsito** (para no pedir de más). Al **recibir**, se suma al stock real.

## FR-6 — Aprendizaje de demanda y recomendación de reposición

El sistema **aprende la velocidad de venta** de cada ítem a partir del historial de ventas
(FR-3) y, combinándola con el **lead time** (~105 días) y el **stock en tránsito** (FR-5),
recomienda **qué pedir, cuándo y en qué cantidad** para no quedarse sin stock, sin
sobre-stockearse. Toda la matemática está en `05-reglas-negocio.md`.

## FR-7 — Datos maestros de soporte

ABM de **proveedores** (con lead time por defecto), **marcas** y **clientes**.

## FR-8 — Configuración

Parámetros globales ajustables: nivel de servicio (Z), período de cálculo de demanda, factor de
suavizado EWMA (alpha), horizonte de cobertura (C). Valores por defecto en `05-reglas-negocio.md`.

## Requerimientos no funcionales

- **NFR-1 — Plataforma:** programa de escritorio instalable en **Windows**.
- **NFR-2 — Un solo usuario**, sin login (v1).
- **NFR-3 — Offline:** funciona sin internet; datos en un archivo SQLite local.
- **NFR-4 — Idioma:** interfaz en **español**.
- **NFR-5 — Respaldo:** debe poder respaldarse/exportarse el archivo de datos (Fase 8).
- **NFR-6 — Usabilidad:** apto para un usuario no técnico.
