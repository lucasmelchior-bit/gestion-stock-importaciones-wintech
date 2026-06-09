// Tipos de la API que el preload expone en `window.api` (única superficie IPC).
// Se amplía a medida que se agregan canales (productos, stock, …).

export type AppInfo = {
  appVersion: string;
  electronVersion: string;
  nodeVersion: string;
  sqliteVersion: string;
  dbPath: string;
};

export type WintechApi = {
  getAppInfo: () => Promise<AppInfo>;
};

declare global {
  interface Window {
    api: WintechApi;
  }
}

export const api: WintechApi = window.api;
