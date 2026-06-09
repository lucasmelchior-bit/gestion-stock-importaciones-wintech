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
const fs = require('node:fs');
const crypto = require('node:crypto');
const { app, BrowserWindow, ipcMain, session, dialog, protocol } = require('electron');
const { openDatabase, runMigrations } = require('./db');

// El esquema interno app-image:// (sirve las imágenes de producto desde la
// carpeta de datos) debe declararse privilegiado ANTES de que la app esté lista.
protocol.registerSchemesAsPrivileged([
  { scheme: 'app-image', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

const IMAGE_MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

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

/** Carpeta donde se guardan las imágenes de producto (datos del usuario). */
function imagesDir() {
  return path.join(app.getPath('userData'), 'product-images');
}

/** Registra el protocolo app-image:// para servir miniaturas/imágenes locales. */
function installImageProtocol() {
  protocol.handle('app-image', async (request) => {
    try {
      const url = new URL(request.url);
      // basename evita path traversal (../). Solo se sirve desde imagesDir.
      const name = path.basename(decodeURIComponent(url.pathname));
      const file = path.join(imagesDir(), name);
      const data = await fs.promises.readFile(file);
      const mime = IMAGE_MIME[path.extname(name).toLowerCase()] || 'application/octet-stream';
      return new Response(data, { headers: { 'Content-Type': mime } });
    } catch {
      return new Response('', { status: 404 });
    }
  });
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
      "style-src 'self' 'unsafe-inline'; img-src 'self' data: app-image:; font-src 'self' data:; " +
      "connect-src 'self' http://localhost:5173 ws://localhost:5173 ws://127.0.0.1:5173"
    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: app-image:; font-src 'self' data:; connect-src 'self'";

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

// --- Catálogo: productos (FR-1) ---------------------------------------------
// Sin lógica de negocio (eso vive en src/domain); esto solo lee/escribe la base.

const PRODUCT_SELECT = `
  SELECT p.*, b.name AS brand_name, s.name AS supplier_name
  FROM product p
  LEFT JOIN brand b ON b.id = p.brand_id
  LEFT JOIN supplier s ON s.id = p.supplier_id
`;

/** Datos de referencia para los selectores del formulario. */
ipcMain.handle('catalog:refData', () => ({
  brands: db.prepare('SELECT id, name FROM brand ORDER BY name').all(),
  suppliers: db.prepare('SELECT id, name FROM supplier ORDER BY name').all(),
}));

/**
 * Abre el selector de archivos para elegir una imagen, la copia a la carpeta de
 * imágenes con un nombre único y devuelve ese nombre (o null si se cancela).
 */
ipcMain.handle('images:pick', async () => {
  const res = await dialog.showOpenDialog({
    title: 'Elegir imagen del producto',
    properties: ['openFile'],
    filters: [{ name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'] }],
  });
  if (res.canceled || res.filePaths.length === 0) return null;
  const src = res.filePaths[0];
  const ext = path.extname(src).toLowerCase();
  const filename = `${crypto.randomUUID()}${ext}`;
  fs.mkdirSync(imagesDir(), { recursive: true });
  fs.copyFileSync(src, path.join(imagesDir(), filename));
  return { filename };
});

ipcMain.handle('products:list', () => {
  return db.prepare(`${PRODUCT_SELECT} ORDER BY p.name`).all();
});

ipcMain.handle('products:get', (_e, id) => {
  return db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(id);
});

/** Normaliza y valida la entrada del formulario de producto. */
function cleanProductInput(p) {
  const sku = (p.sku ?? '').trim();
  const name = (p.name ?? '').trim();
  if (!sku) throw new Error('El SKU es obligatorio.');
  if (!name) throw new Error('El nombre es obligatorio.');
  const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
  const family = p.family ?? null;
  return {
    sku,
    name,
    family,
    category: family ?? 'accessory', // satisface el NOT NULL legacy de category
    line: p.line ?? null,
    color: p.color ?? null,
    brand_id: p.brand_id ?? null,
    supplier_id: p.supplier_id ?? null,
    unit: p.unit ?? 'unit',
    bar_length_m: num(p.bar_length_m),
    weight_kg: num(p.weight_kg),
    volume_m3: num(p.volume_m3),
    last_cost_usd: num(p.last_cost_usd),
    sale_price_ars: num(p.sale_price_ars),
    target_margin_pct: num(p.target_margin_pct),
    min_stock: num(p.min_stock) ?? 0,
    safety_stock: num(p.safety_stock) ?? 0,
    target_stock: num(p.target_stock) ?? 0,
    lead_time_days: num(p.lead_time_days),
    image_filename: p.image_filename ?? null,
    active: p.active ? 1 : 0,
  };
}

/** Traduce el error de UNIQUE(sku) en un mensaje claro. */
function runProductWrite(fn) {
  try {
    return fn();
  } catch (err) {
    if (String(err.message).includes('UNIQUE') && String(err.message).includes('sku')) {
      throw new Error('Ya existe un producto con ese SKU.');
    }
    throw err;
  }
}

ipcMain.handle('products:create', (_e, input) => {
  const p = cleanProductInput(input);
  const now = new Date().toISOString();
  return runProductWrite(() => {
    const info = db
      .prepare(
        `INSERT INTO product
           (sku, name, family, category, line, color, brand_id, supplier_id, unit,
            bar_length_m, weight_kg, volume_m3, last_cost_usd, sale_price_ars,
            target_margin_pct, min_stock, safety_stock, target_stock, lead_time_days,
            image_filename, active, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .run(
        p.sku, p.name, p.family, p.category, p.line, p.color, p.brand_id, p.supplier_id,
        p.unit, p.bar_length_m, p.weight_kg, p.volume_m3, p.last_cost_usd, p.sale_price_ars,
        p.target_margin_pct, p.min_stock, p.safety_stock, p.target_stock, p.lead_time_days,
        p.image_filename, p.active, now, now,
      );
    return db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(Number(info.lastInsertRowid));
  });
});

ipcMain.handle('products:update', (_e, id, input) => {
  const p = cleanProductInput(input);
  const now = new Date().toISOString();
  return runProductWrite(() => {
    db.prepare(
      `UPDATE product SET
         sku=?, name=?, family=?, category=?, line=?, color=?, brand_id=?, supplier_id=?,
         unit=?, bar_length_m=?, weight_kg=?, volume_m3=?, last_cost_usd=?, sale_price_ars=?,
         target_margin_pct=?, min_stock=?, safety_stock=?, target_stock=?, lead_time_days=?,
         image_filename=?, active=?, updated_at=?
       WHERE id=?`,
    ).run(
      p.sku, p.name, p.family, p.category, p.line, p.color, p.brand_id, p.supplier_id,
      p.unit, p.bar_length_m, p.weight_kg, p.volume_m3, p.last_cost_usd, p.sale_price_ars,
      p.target_margin_pct, p.min_stock, p.safety_stock, p.target_stock, p.lead_time_days,
      p.image_filename, p.active, now, id,
    );
    return db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(id);
  });
});

ipcMain.handle('products:toggleActive', (_e, id) => {
  db.prepare('UPDATE product SET active = 1 - active, updated_at = ? WHERE id = ?').run(
    new Date().toISOString(),
    id,
  );
  return db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(id);
});

// --- Ciclo de vida -----------------------------------------------------------

app.whenReady().then(() => {
  initDatabase();
  installCsp();
  installImageProtocol();
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
