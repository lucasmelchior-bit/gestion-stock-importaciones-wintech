-- =============================================================================
-- Migración 0001 — Esquema inicial
-- -----------------------------------------------------------------------------
-- APPEND-ONLY: esta migración NO se edita una vez publicada. Para cambios al
-- esquema, agregar una nueva migración (0002_*.sql, ...).
-- Corresponde al estado de db/schema.sql al 2026-05-29.
-- =============================================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS supplier (
    id                     INTEGER PRIMARY KEY,
    name                   TEXT    NOT NULL,
    country                TEXT,
    default_lead_time_days INTEGER NOT NULL DEFAULT 105
);

CREATE TABLE IF NOT EXISTS brand (
    id   INTEGER PRIMARY KEY,
    name TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS client (
    id      INTEGER PRIMARY KEY,
    name    TEXT    NOT NULL,
    contact TEXT,
    notes   TEXT,
    active  INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS product (
    id             INTEGER PRIMARY KEY,
    sku            TEXT    NOT NULL UNIQUE,
    name           TEXT    NOT NULL,
    category       TEXT    NOT NULL,
    brand_id       INTEGER REFERENCES brand(id),
    supplier_id    INTEGER REFERENCES supplier(id),
    unit           TEXT    NOT NULL DEFAULT 'unit',
    bar_length_m   REAL,
    last_cost_usd  REAL,
    sale_price_ars REAL,
    min_stock      REAL    NOT NULL DEFAULT 0,
    safety_stock   REAL    NOT NULL DEFAULT 0,
    lead_time_days INTEGER,
    active         INTEGER NOT NULL DEFAULT 1,
    created_at     TEXT,
    updated_at     TEXT
);

CREATE TABLE IF NOT EXISTS stock_movement (
    id         INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id),
    qty        REAL    NOT NULL,
    type       TEXT    NOT NULL,
    ref_table  TEXT,
    ref_id     INTEGER,
    moved_at   TEXT    NOT NULL,
    note       TEXT
);
CREATE INDEX IF NOT EXISTS idx_stock_movement_product ON stock_movement(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movement_moved_at ON stock_movement(moved_at);

CREATE TABLE IF NOT EXISTS product_stock (
    product_id INTEGER PRIMARY KEY REFERENCES product(id),
    on_hand    REAL NOT NULL DEFAULT 0,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS sales_order (
    id           INTEGER PRIMARY KEY,
    client_id    INTEGER NOT NULL REFERENCES client(id),
    status       TEXT    NOT NULL DEFAULT 'open',
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

CREATE TABLE IF NOT EXISTS purchase_order (
    id          INTEGER PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES supplier(id),
    status      TEXT    NOT NULL DEFAULT 'draft',
    placed_at   TEXT,
    expected_at TEXT,
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

CREATE TABLE IF NOT EXISTS demand_history (
    id           INTEGER PRIMARY KEY,
    product_id   INTEGER NOT NULL REFERENCES product(id),
    period_start TEXT    NOT NULL,
    qty_sold     REAL    NOT NULL,
    UNIQUE(product_id, period_start)
);

CREATE TABLE IF NOT EXISTS demand_forecast (
    product_id       INTEGER PRIMARY KEY REFERENCES product(id),
    velocity_per_day REAL,
    velocity_stddev  REAL,
    method           TEXT,
    data_points      INTEGER NOT NULL DEFAULT 0,
    last_computed_at TEXT
);

CREATE TABLE IF NOT EXISTS settings (
    id                   INTEGER PRIMARY KEY CHECK (id = 1),
    service_level_z      REAL    NOT NULL DEFAULT 1.65,
    forecast_period_days INTEGER NOT NULL DEFAULT 7,
    ewma_alpha           REAL    NOT NULL DEFAULT 0.3,
    coverage_days        INTEGER NOT NULL DEFAULT 90
);

-- Fila única de configuración por defecto.
INSERT OR IGNORE INTO settings (id) VALUES (1);
