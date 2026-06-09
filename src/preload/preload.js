// =============================================================================
// Proceso PRELOAD de Electron.
// -----------------------------------------------------------------------------
// Único puente entre el renderer (UI) y el main. Expone, vía contextBridge, una
// API acotada y explícita. SIN lógica de negocio: solo reenvía llamadas IPC.
// Cada canal nuevo se documenta acá.
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Metadatos del entorno (diagnóstico).
  getAppInfo: () => ipcRenderer.invoke('app:info'),

  // Catálogo de productos (FR-1).
  catalog: {
    refData: () => ipcRenderer.invoke('catalog:refData'),
  },
  // Imágenes de producto.
  images: {
    pick: () => ipcRenderer.invoke('images:pick'),
  },
  products: {
    list: () => ipcRenderer.invoke('products:list'),
    get: (id) => ipcRenderer.invoke('products:get', id),
    create: (input) => ipcRenderer.invoke('products:create', input),
    update: (id, input) => ipcRenderer.invoke('products:update', id, input),
    toggleActive: (id) => ipcRenderer.invoke('products:toggleActive', id),
  },
});
