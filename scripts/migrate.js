// =============================================================================
// Runner de migraciones standalone (Node puro, sin Electron).
// -----------------------------------------------------------------------------
// Aplica las migraciones de db/migrations/ sobre un archivo SQLite y reporta el
// resultado. Sirve como smoke test de la capa de datos y para inspeccionar la
// base en desarrollo. Uso:
//   node scripts/migrate.js [rutaDb]
// Por defecto usa ./data/dev.sqlite (ignorado por git).
// =============================================================================

const path = require('node:path');
const { openDatabase, runMigrations } = require('../src/main/db');

const projectRoot = path.join(__dirname, '..');
const dbPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(projectRoot, 'data', 'dev.sqlite');
const migrationsDir = path.join(projectRoot, 'db', 'migrations');

const db = openDatabase(dbPath);
const applied = runMigrations(db, migrationsDir);

console.log(`Base: ${dbPath}`);
console.log(
  applied.length
    ? `Migraciones aplicadas en esta corrida: ${applied.join(', ')}`
    : 'Sin migraciones pendientes (base al dia).',
);

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .all()
  .map((r) => r.name);
console.log(`Tablas (${tables.length}): ${tables.join(', ')}`);
console.log(`SQLite ${db.prepare('SELECT sqlite_version() AS v').get().v}`);

db.close();
