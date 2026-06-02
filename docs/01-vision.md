# 01 — Visión

## El usuario

**Lucas** es **importador y distribuidor en toda Argentina** de insumos para fabricar aberturas
(ventanas y puertas) de PVC. Es el único usuario del sistema (al menos en v1) y **no es técnico**.

## Qué importa y vende

- **Perfiles de PVC marca Wintech** — proveedor **Adopen** (Turquía). Se venden por **barra entera**.
- **Herrajes y accesorios marca Accado** — proveedor **Adopen** (Turquía). Se venden por **unidad/juego**.
- **Ruedas y otros accesorios** — de **otros proveedores y países**. Por **unidad/juego**.

> **Wintech** y **Accado** son **marcas**. **Adopen** es el **proveedor** turco que las produce/envía.

## Quiénes son sus clientes

Los **fabricantes de aberturas de PVC**: empresas/talleres que compran los perfiles y herrajes
para armar las ventanas y puertas que después venden a sus propios clientes.
**Lucas no fabrica aberturas; las provee de insumos.**

## El problema de negocio

La importación desde Turquía **demora ~3 a 4 meses (≈105 días)** desde que Lucas hace el pedido al
proveedor hasta que tiene la mercadería en su depósito. Con ese plazo tan largo:

- Si se queda sin stock de un ítem, **pierde ventas durante meses** hasta que llegue la reposición.
- Si compra de más "por las dudas", **inmoviliza capital** y llena el depósito.

Hoy esto se maneja "a ojo". El objetivo es que un sistema lo calcule con datos.

## Qué resuelve el software

1. Tener el **stock siempre actualizado** y un **ABM** ordenado de todos los productos.
2. Registrar los **pedidos de venta** y descontar stock automáticamente.
3. **Avisar de stock crítico** antes de quedarse sin mercadería.
4. **Aprender la velocidad de venta** de cada ítem y, cruzándola con el lead time y lo que ya
   viene en camino, **recomendar cuándo y cuánto pedir** al proveedor.

## Criterios de éxito (v1)

- Lucas puede cargar y consultar todos sus productos y su stock sin ayuda técnica.
- Al vender, el stock se actualiza solo.
- El sistema le muestra una lista clara de "qué conviene pedir ahora y en qué cantidad".
- No se queda sin stock de los ítems que vende habitualmente, sin sobre-stockearse.
- Todo corre en su PC, offline, como un programa instalado.

## Fuera de alcance (v1)

- Múltiples usuarios / permisos / login.
- Facturación / contabilidad / AFIP.
- Multi-moneda en reportes (el costo en USD es informativo; ver `05-reglas-negocio.md`).
- Estacionalidad avanzada (ver `adr/0003`).
