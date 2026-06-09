// =============================================================================
// Carga de datos de ejemplo (Node puro, sin Electron). Idempotente: no duplica.
// -----------------------------------------------------------------------------
// Inserta proveedor (Adopen), marcas (Wintech, Accado) y productos de muestra
// (perfiles Wintech, herrajes Accado, accesorios). Apunta por defecto a la base
// de datos de la app (carpeta userData de Electron); se puede pasar otra ruta:
//   node scripts/seed.js [rutaDb]
// =============================================================================

const os = require('node:os');
const path = require('node:path');
const { openDatabase, runMigrations } = require('../src/main/db');

const APP_NAME = 'gestion-stock-importaciones-wintech';
const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const dbPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(appData, APP_NAME, 'gestion-stock.sqlite');
const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');

const db = openDatabase(dbPath);
runMigrations(db, migrationsDir);

function getOrCreateByName(table, name, extra = {}) {
  const found = db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(name);
  if (found) return found.id;
  const cols = ['name', ...Object.keys(extra)];
  const placeholders = cols.map(() => '?').join(', ');
  const info = db
    .prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`)
    .run(name, ...Object.values(extra));
  return Number(info.lastInsertRowid);
}

const adopenId = getOrCreateByName('supplier', 'Adopen', {
  country: 'Turquía',
  default_lead_time_days: 105,
});
const wintechId = getOrCreateByName('brand', 'Wintech');
const accadoId = getOrCreateByName('brand', 'Accado');

// sku, name, family, line, color, unit, brand, supplier, bar_length_m, weight_kg,
// volume_m3, last_cost_usd, sale_price_ars, target_margin_pct, min_stock, target_stock
const PRODUCTS = [
  ['WT-58-MARCO-BL', 'Marco Wintech 58 Blanco', 'perfil', 'Wintech 58', 'Blanco', 'bar', wintechId, adopenId, 6, 2.1, 0.012, 18.4, 32000, 35, 120, 600],
  ['WT-58-HOJA-BL', 'Hoja Wintech 58 Blanco', 'perfil', 'Wintech 58', 'Blanco', 'bar', wintechId, adopenId, 6, 2.0, 0.011, 17.9, 31000, 35, 120, 600],
  ['WT-58-CONTRA-BL', 'Contravidrio Wintech 58 Blanco', 'perfil', 'Wintech 58', 'Blanco', 'bar', wintechId, adopenId, 6, 0.7, 0.004, 6.2, 11500, 40, 150, 700],
  ['WT-70-MARCO-BL', 'Marco Wintech 70 Blanco', 'perfil', 'Wintech 70', 'Blanco', 'bar', wintechId, adopenId, 6, 2.6, 0.015, 22.1, 39000, 35, 90, 450],
  ['WT-70-MARCO-SM', 'Marco Wintech 70 Símil Madera', 'perfil', 'Wintech 70', 'Símil madera', 'bar', wintechId, adopenId, 6, 2.6, 0.015, 27.5, 48000, 38, 60, 300],
  ['AC-CREM-100', 'Cremona Accado 100', 'herraje', 'Accado', null, 'unit', accadoId, adopenId, null, 0.32, 0.0008, 3.8, 7200, 45, 200, 900],
  ['AC-BISA-STD', 'Bisagra Accado estándar', 'herraje', 'Accado', null, 'unit', accadoId, adopenId, null, 0.18, 0.0004, 1.9, 3600, 50, 300, 1400],
  ['AC-RODA-PAR', 'Rueda corrediza Accado (par)', 'accesorio', 'Accado', null, 'set', accadoId, adopenId, null, 0.12, 0.0003, 2.4, 4500, 48, 150, 700],
  ['AX-FELP-NEG', 'Felpa de cepillo negra', 'accesorio', null, 'Negro', 'meter', null, adopenId, null, 0.01, 0.00002, 0.15, 320, 55, 500, 3000],
  ['AX-JUNTA-GRIS', 'Junta de acristalamiento gris', 'accesorio', null, 'Gris', 'meter', null, adopenId, null, 0.02, 0.00003, 0.22, 460, 55, 500, 3000],
];

const now = new Date().toISOString();
const insert = db.prepare(
  `INSERT OR IGNORE INTO product
     (sku, name, family, category, line, color, unit, brand_id, supplier_id,
      bar_length_m, weight_kg, volume_m3, last_cost_usd, sale_price_ars,
      target_margin_pct, min_stock, target_stock, active, created_at, updated_at)
   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)`,
);

let inserted = 0;
for (const p of PRODUCTS) {
  const [sku, name, family, line, color, unit, brand, supplier, bar, weight, vol, cost, price, margin, min, target] = p;
  const info = insert.run(
    sku, name, family, family, line, color, unit, brand, supplier,
    bar, weight, vol, cost, price, margin, min, target, now, now,
  );
  inserted += info.changes;
}

console.log(`Base: ${dbPath}`);
console.log(`Proveedor Adopen (id ${adopenId}), marcas Wintech (${wintechId}) y Accado (${accadoId}).`);
console.log(`Productos insertados en esta corrida: ${inserted} (de ${PRODUCTS.length} de muestra).`);
const total = db.prepare('SELECT COUNT(*) AS n FROM product').get().n;
console.log(`Total de productos en la base: ${total}.`);

db.close();
