// =============================================================================
// Proceso MAIN de Electron.
// -----------------------------------------------------------------------------
// Responsabilidad: ciclo de vida de la app, creación de la ventana, apertura de
// la base SQLite (con migraciones) y registro de los handlers IPC. Es el único
// proceso que toca la base y el sistema de archivos. La lógica de negocio vive
// en src/domain/; acá solo se orquesta.
// =============================================================================

const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { openDatabase, runMigrations } = require('./db');

/** @type {import('node:sqlite').DatabaseSync | null} */
let db = null;

/** Ruta del archivo de datos del usuario (fuera del install, respaldable). */
function resolveDbPath() {
  return path.join(app.getPath('userData'), 'gestion-stock.sqlite');
}

/** Carpeta de migraciones, relativa a la raíz del proyecto/app empaquetada. */
function resolveMigrationsDir() {
  return path.join(app.getAppPath(), 'db', 'migrations');
}

function initDatabase() {
  db = openDatabase(resolveDbPath());
  const applied = runMigrations(db, resolveMigrationsDir());
  if (applied.length > 0) {
    console.log(`[db] Migraciones aplicadas: ${applied.join(', ')}`);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    title: 'Gestion de Stock Wintech',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
}

// --- Handlers IPC (superficie mínima; se amplía en fases siguientes) ---------

/** Devuelve metadatos del entorno para que el renderer muestre estado real. */
ipcMain.handle('app:info', () => {
  const counts = {};
  for (const t of ['product', 'supplier', 'client']) {
    counts[t] = db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
  }
  return {
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    sqliteVersion: db.prepare('SELECT sqlite_version() AS v').get().v,
    dbPath: resolveDbPath(),
    counts,
  };
});

// --- Ciclo de vida -----------------------------------------------------------

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  if (db) db.close();
});
