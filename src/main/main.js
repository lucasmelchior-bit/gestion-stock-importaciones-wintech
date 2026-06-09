// =============================================================================
// Proceso MAIN de Electron.
// -----------------------------------------------------------------------------
// Responsabilidad: ciclo de vida de la app, creación de la ventana, apertura de
// la base SQLite (con migraciones) y registro de los handlers IPC. Es el único
// proceso que toca la base y el sistema de archivos. La lógica de negocio vive
// en src/domain/; acá solo se orquesta.
//
// El renderer es React + Vite (ver adr/0006): en desarrollo se carga el dev
// server de Vite (HMR); empaquetado, el build estático de build/renderer.
// =============================================================================

const path = require('node:path');
const { app, BrowserWindow, ipcMain, session } = require('electron');
const { openDatabase, runMigrations } = require('./db');

/** @type {import('node:sqlite').DatabaseSync | null} */
let db = null;

const DEV_SERVER_URL = 'http://localhost:5173';
const isDev = !app.isPackaged;

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

/** Content-Security-Policy: estricta empaquetada; en dev habilita el HMR de Vite. */
function installCsp() {
  const csp = isDev
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; " +
      "connect-src 'self' http://localhost:5173 ws://localhost:5173 ws://127.0.0.1:5173"
    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data:; font-src 'self' data:; connect-src 'self'";

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp],
      },
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    title: 'Gestion de Stock Wintech',
    backgroundColor: '#F6F2E0',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL(DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(app.getAppPath(), 'build', 'renderer', 'index.html'));
  }
}

// --- Handlers IPC (superficie mínima; se amplía en fases siguientes) ---------

/** Devuelve metadatos del entorno para diagnóstico. */
ipcMain.handle('app:info', () => {
  return {
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    sqliteVersion: db.prepare('SELECT sqlite_version() AS v').get().v,
    dbPath: resolveDbPath(),
  };
});

// --- Ciclo de vida -----------------------------------------------------------

app.whenReady().then(() => {
  initDatabase();
  installCsp();
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
