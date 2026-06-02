-- =============================================================================
-- Datos de ejemplo (seed) — OPCIONAL
-- -----------------------------------------------------------------------------
-- Carga datos realistas de muestra para ver la app poblada en desarrollo.
-- NO usar en la base real del usuario. Ejecutar sobre una base creada con la
-- migración 0001_init.sql.
-- =============================================================================

PRAGMA foreign_keys = ON;

-- Proveedores
INSERT INTO supplier (id, name, country, default_lead_time_days) VALUES
    (1, 'Adopen', 'Turquía', 105),
    (2, 'Proveedor Ruedas SA', 'China', 75);

-- Marcas
INSERT INTO brand (id, name) VALUES
    (1, 'Wintech'),
    (2, 'Accado'),
    (3, 'Genérica');

-- Clientes (fabricantes de aberturas)
INSERT INTO client (id, name, contact, active) VALUES
    (1, 'Aberturas del Sur', 'ventas@abesur.com', 1),
    (2, 'PVC Norte SRL', '11-5555-1234', 1);

-- Productos
INSERT INTO product (id, sku, name, category, brand_id, supplier_id, unit, bar_length_m, last_cost_usd, sale_price_ars, min_stock, lead_time_days, active, created_at, updated_at) VALUES
    (1, 'WT-MARCO-60', 'Perfil marco línea 60', 'profile', 1, 1, 'bar', 6.0, 18.50, 42000, 50, 105, 1, '2026-05-29', '2026-05-29'),
    (2, 'WT-HOJA-60',  'Perfil hoja línea 60',  'profile', 1, 1, 'bar', 6.0, 17.20, 39000, 50, 105, 1, '2026-05-29', '2026-05-29'),
    (3, 'AC-CREMONA',  'Cremona herraje oscilobatiente', 'hardware', 2, 1, 'unit', NULL, 9.80, 21000, 30, 105, 1, '2026-05-29', '2026-05-29'),
    (4, 'RD-CORR-80',  'Rueda corrediza 80kg', 'wheel', 3, 2, 'unit', NULL, 2.40, 5200, 40, 75, 1, '2026-05-29', '2026-05-29');

-- Carga inicial de stock (movimientos 'initial' + cache)
INSERT INTO stock_movement (product_id, qty, type, moved_at, note) VALUES
    (1, 120, 'initial', '2026-05-29', 'Carga inicial'),
    (2, 200, 'initial', '2026-05-29', 'Carga inicial'),
    (3,  45, 'initial', '2026-05-29', 'Carga inicial'),
    (4,  60, 'initial', '2026-05-29', 'Carga inicial');

INSERT INTO product_stock (product_id, on_hand, updated_at) VALUES
    (1, 120, '2026-05-29'),
    (2, 200, '2026-05-29'),
    (3,  45, '2026-05-29'),
    (4,  60, '2026-05-29');
