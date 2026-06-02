// =============================================================================
// Renderer (UI). No accede a la base directamente: pide datos por IPC a traves
// de `window.api` (definido en el preload). Pinta la pantalla de bienvenida con
// el estado real del entorno y los conteos, confirmando que el puente
// renderer -> preload -> main -> SQLite funciona de punta a punta.
// =============================================================================

import { labels } from './labels.js';

function text(id, value) {
  document.getElementById(id).textContent = value;
}

/** Llena un <dl> con pares clave/valor a partir de un mapa de etiquetas. */
function fillKeyValues(containerId, labelMap, dataMap) {
  const dl = document.getElementById(containerId);
  dl.replaceChildren();
  for (const [key, label] of Object.entries(labelMap)) {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = dataMap[key] ?? '—';
    dl.append(dt, dd);
  }
}

function paintStaticText() {
  text('app-title', labels.appTitle);
  text('tagline', labels.tagline);
  text('phase-badge', labels.phaseBadge);
  text('env-heading', labels.envHeading);
  text('data-heading', labels.dataHeading);
  text('next-step', labels.nextStep);
}

async function load() {
  paintStaticText();
  try {
    const info = await window.api.getAppInfo();
    fillKeyValues('env-list', labels.fields, {
      appVersion: info.appVersion,
      electronVersion: info.electronVersion,
      nodeVersion: info.nodeVersion,
      sqliteVersion: info.sqliteVersion,
      dbPath: info.dbPath,
    });
    fillKeyValues('data-list', labels.counts, info.counts);
  } catch (err) {
    console.error(err);
    text('env-heading', labels.error);
  }
}

load();
