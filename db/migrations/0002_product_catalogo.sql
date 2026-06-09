-- =============================================================================
-- Migración 0002 — Catálogo de productos (campos del diseño "Jardín de San José")
-- -----------------------------------------------------------------------------
-- APPEND-ONLY: no editar una vez publicada. Agrega columnas a `product` y
-- `client` para soportar la pantalla de Productos de la Fase 2 (ver adr/0005 y
-- docs/02-glosario.md). Los nombres van en inglés (adr/0002); la UI los muestra
-- en español.
-- =============================================================================

-- Producto: clasificación y atributos del diseño.
ALTER TABLE product ADD COLUMN family            TEXT;            -- 'perfil' | 'herraje' | 'accesorio'
ALTER TABLE product ADD COLUMN line              TEXT;            -- línea/sistema, ej. "Wintech 58"
ALTER TABLE product ADD COLUMN color             TEXT;            -- "Blanco", "Símil madera", ...
ALTER TABLE product ADD COLUMN weight_kg         REAL;            -- peso por unidad de venta (kg)
ALTER TABLE product ADD COLUMN volume_m3         REAL;            -- volumen por unidad de venta (m³)
ALTER TABLE product ADD COLUMN target_margin_pct REAL;            -- margen objetivo (%)
ALTER TABLE product ADD COLUMN landed_cost_usd   REAL;            -- costo desembarcado (se calcula al recibir)
ALTER TABLE product ADD COLUMN target_stock      REAL NOT NULL DEFAULT 0;  -- stock objetivo de reposición

-- Cliente: datos comerciales del diseño.
ALTER TABLE client ADD COLUMN cuit          TEXT;
ALTER TABLE client ADD COLUMN payment_terms TEXT;                 -- 'cuenta_corriente' | 'anticipado' | ...
