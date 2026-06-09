-- =============================================================================
-- Gestión de Stock e Importaciones Wintech — Esquema canónico de la base de datos (SQLite)
-- -----------------------------------------------------------------------------
-- Fuente de verdad del esquema. Explicación en prosa: docs/09-diccionario-datos.md
-- Reglas de negocio (matemática): docs/05-reglas-negocio.md
-- Los cambios se aplican via migraciones append-only en db/migrations/.
-- Este archivo refleja el estado acumulado del esquema.
-- =============================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Datos maestros / referencia
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS supplier (
    id                     INTEGER PRIMARY KEY,
    name                   TEXT    NOT NULL,
    country                TEXT,
    default_lead_time_days INTEGER NOT NULL DEFAULT 105   -- ~3,5 meses
);

CREATE TABLE IF NOT EXISTS brand (
    id   INTEGER PRIMARY KEY,
    name TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS client (
    id            INTEGER PRIMARY KEY,
    name          TEXT    NOT NULL,
    contact       TEXT,
    notes         TEXT,
    active        INTEGER NOT NULL DEFAULT 1,
    cuit          TEXT,                          -- agregado en migración 0002
    payment_terms TEXT                           -- 'cuenta_corriente' | 'anticipado' | ... (0002)
);

CREATE TABLE IF NOT EXISTS product (
    id             INTEGER PRIMARY KEY,
    sku            TEXT    NOT NULL UNIQUE,
    name           TEXT    NOT NULL,
    category       TEXT    NOT NULL,            -- 'profile' | 'hardware' | 'wheel' | 'accessory'
    brand_id       INTEGER REFERENCES brand(id),
    supplier_id    INTEGER REFERENCES supplier(id),
    unit           TEXT    NOT NULL DEFAULT 'unit', -- 'bar' | 'unit' | 'set' | 'meter'
    bar_length_m   REAL,                         -- solo perfiles; informativo en v1
    last_cost_usd  REAL,
    sale_price_ars REAL,
    min_stock      REAL    NOT NULL DEFAULT 0,   -- stock critico/minimo (FR-4)
    safety_stock   REAL    NOT NULL DEFAULT 0,   -- manual; se usa max(calculado, manual)
    lead_time_days INTEGER,                      -- NULL -> usa supplier.default_lead_time_days
    active         INTEGER NOT NULL DEFAULT 1,
    created_at     TEXT,
    updated_at     TEXT,
    -- Agregados en migración 0002 (diseño "Jardín de San José"):
    family            TEXT,                      -- 'perfil' | 'herraje' | 'accesorio'
    line              TEXT,                      -- línea/sistema, ej. "Wintech 58"
    color             TEXT,
    weight_kg         REAL,                      -- peso por unidad de venta (kg)
    volume_m3         REAL,                      -- volumen por unidad de venta (m³)
    target_margin_pct REAL,                      -- margen objetivo (%)
    landed_cost_usd   REAL,                      -- costo desembarcado (al recibir importación)
    target_stock      REAL NOT NULL DEFAULT 0,   -- stock objetivo de reposición
    image_filename    TEXT                       -- nombre del archivo en userData/product-images/ (0003)
);

-- ---------------------------------------------------------------------------
-- Stock como libro mayor (fuente de verdad del stock en mano)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS stock_movement (
    id         INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id),
    qty        REAL    NOT NULL,                 -- con signo: + entra, - sale
    type       TEXT    NOT NULL,                 -- 'sale' | 'purchase_receipt' | 'adjustment' | 'initial'
    ref_table  TEXT,                             -- 'sales_order_line' | 'purchase_order_line'
    ref_id     INTEGER,
    moved_at   TEXT    NOT NULL,                 -- fecha del movimiento (alimenta demanda)
    note       TEXT
);
CREATE INDEX IF NOT EXISTS idx_stock_movement_product ON stock_movement(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movement_moved_at ON stock_movement(moved_at);

-- Cache de stock en mano para lectura rapida (se actualiza en la misma transaccion).
CREATE TABLE IF NOT EXISTS product_stock (
    product_id INTEGER PRIMARY KEY REFERENCES product(id),
    on_hand    REAL NOT NULL DEFAULT 0,
    updated_at TEXT
);

-- ---------------------------------------------------------------------------
-- Pedidos de venta (descuentan stock)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sales_order (
    id           INTEGER PRIMARY KEY,
    client_id    INTEGER NOT NULL REFERENCES client(id),
    status       TEXT    NOT NULL DEFAULT 'open', -- open|confirmed|delivered|cancelled
    ordered_at   TEXT    NOT NULL,
    delivered_at TEXT,
    notes        TEXT
);

CREATE TABLE IF NOT EXISTS sales_order_line (
    id             INTEGER PRIMARY KEY,
    sales_order_id INTEGER NOT NULL REFERENCES sales_order(id),
    product_id     INTEGER NOT NULL REFERENCES product(id),
    qty            REAL    NOT NULL,
    unit_price_ars REAL
);
CREATE INDEX IF NOT EXISTS idx_sales_line_order ON sales_order_line(sales_order_id);
CREATE INDEX IF NOT EXISTS idx_sales_line_product ON sales_order_line(product_id);

-- ---------------------------------------------------------------------------
-- Pedidos al proveedor / importaciones (aportan stock en transito)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS purchase_order (
    id          INTEGER PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES supplier(id),
    status      TEXT    NOT NULL DEFAULT 'draft', -- draft|placed|in_transit|received|cancelled
    placed_at   TEXT,                             -- arranca el reloj del lead time
    expected_at TEXT,                             -- placed_at + lead time
    received_at TEXT,
    currency    TEXT    DEFAULT 'USD',
    notes       TEXT
);

CREATE TABLE IF NOT EXISTS purchase_order_line (
    id                INTEGER PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_order(id),
    product_id        INTEGER NOT NULL REFERENCES product(id),
    qty_ordered       REAL    NOT NULL,
    qty_received      REAL    NOT NULL DEFAULT 0,
    unit_cost_usd     REAL
);
CREATE INDEX IF NOT EXISTS idx_purchase_line_order ON purchase_order_line(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_line_product ON purchase_order_line(product_id);

-- ---------------------------------------------------------------------------
-- Pronostico de demanda (velocidad aprendida)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS demand_history (
    id           INTEGER PRIMARY KEY,
    product_id   INTEGER NOT NULL REFERENCES product(id),
    period_start TEXT    NOT NULL,               -- inicio de semana/mes
    qty_sold     REAL    NOT NULL,
    UNIQUE(product_id, period_start)
);

CREATE TABLE IF NOT EXISTS demand_forecast (
    product_id       INTEGER PRIMARY KEY REFERENCES product(id),
    velocity_per_day REAL,                        -- BR-2
    velocity_stddev  REAL,                        -- alimenta safety stock (BR-4)
    method           TEXT,                        -- EWMA|naive|manual|insufficient_data|intermittent
    data_points      INTEGER NOT NULL DEFAULT 0,
    last_computed_at TEXT
);

-- ---------------------------------------------------------------------------
-- Configuracion (fila unica)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS settings (
    id                   INTEGER PRIMARY KEY CHECK (id = 1),
    service_level_z      REAL    NOT NULL DEFAULT 1.65,  -- Z (~95%)
    forecast_period_days INTEGER NOT NULL DEFAULT 7,     -- P
    ewma_alpha           REAL    NOT NULL DEFAULT 0.3,   -- alpha
    coverage_days        INTEGER NOT NULL DEFAULT 90     -- C
);
