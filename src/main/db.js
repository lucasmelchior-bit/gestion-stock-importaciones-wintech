// =============================================================================
// Capa de acceso a SQLite (proceso main).
// -----------------------------------------------------------------------------
// Responsabilidad: abrir el archivo de base de datos y aplicar las migraciones
// append-only de db/migrations/ de forma idempotente. NO contiene lógica de
// negocio (esa vive en src/domain/). Es agnóstica de Electron: recibe las rutas
// por parámetro para poder probarse en Node puro (ver scripts/migrate.js).
//
// Usa el módulo integrado `node:sqlite` (DatabaseSync) — sin dependencias
// nativas ni compilación. Ver docs/adr/0004-sqlite-integrado-node.md.
// =============================================================================

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

/**
 * Abre (o crea) la base SQLite en `dbPath`, activa claves foráneas y modo WAL.
 * @param {string} dbPath Ruta absoluta al archivo .sqlite.
 * @returns {import('node:sqlite').DatabaseSync}
 */
function openDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

/**
 * Aplica, en orden, las migraciones .sql que todavía no se corrieron.
 * Lleva el registro en la tabla `schema_migrations`. Cada migración corre
 * dentro de una transacción; si falla, se revierte y se corta.
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {string} migrationsDir Carpeta con los archivos NNNN_*.sql.
 * @returns {string[]} Nombres de las migraciones aplicadas en esta corrida.
 */
function runMigrations(db, migrationsDir) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename    TEXT PRIMARY KEY,
      applied_at  TEXT NOT NULL
    );
  `);

  const applied = new Set(
    db.prepare('SELECT filename FROM schema_migrations').all().map((r) => r.filename),
  );

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const justApplied = [];
  const record = db.prepare(
    'INSERT INTO schema_migrations (filename, applied_at) VALUES (?, ?)',
  );

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    db.exec('BEGIN');
    try {
      db.exec(sql);
      record.run(file, new Date().toISOString());
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
    justApplied.push(file);
  }

  return justApplied;
}

module.exports = { openDatabase, runMigrations };
