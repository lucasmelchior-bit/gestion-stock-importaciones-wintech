// =============================================================================
// Proceso PRELOAD de Electron.
// -----------------------------------------------------------------------------
// Único puente entre el renderer (UI) y el main. Expone, vía contextBridge, una
// API acotada y explícita. SIN lógica de negocio: solo reenvía llamadas IPC.
// Cada canal nuevo se documenta acá.
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Metadatos del entorno y conteos básicos (pantalla de bienvenida).
  getAppInfo: () => ipcRenderer.invoke('app:info'),
});
