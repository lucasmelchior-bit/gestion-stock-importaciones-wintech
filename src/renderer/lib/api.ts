// Tipos de la API que el preload expone en `window.api` (única superficie IPC).
// Se amplía a medida que se agregan canales.

export type AppInfo = {
  appVersion: string;
  electronVersion: string;
  nodeVersion: string;
  sqliteVersion: string;
  dbPath: string;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  family: string | null;
  category: string;
  line: string | null;
  color: string | null;
  brand_id: number | null;
  supplier_id: number | null;
  unit: string;
  bar_length_m: number | null;
  weight_kg: number | null;
  volume_m3: number | null;
  last_cost_usd: number | null;
  sale_price_ars: number | null;
  target_margin_pct: number | null;
  min_stock: number;
  safety_stock: number;
  target_stock: number;
  lead_time_days: number | null;
  active: number;
  created_at: string | null;
  updated_at: string | null;
  brand_name: string | null;
  supplier_name: string | null;
};

/** Lo que envía el formulario (campos numéricos pueden venir como string). */
export type ProductInput = {
  sku: string;
  name: string;
  family?: string | null;
  line?: string | null;
  color?: string | null;
  brand_id?: number | null;
  supplier_id?: number | null;
  unit?: string;
  bar_length_m?: number | string | null;
  weight_kg?: number | string | null;
  volume_m3?: number | string | null;
  last_cost_usd?: number | string | null;
  sale_price_ars?: number | string | null;
  target_margin_pct?: number | string | null;
  min_stock?: number | string | null;
  safety_stock?: number | string | null;
  target_stock?: number | string | null;
  lead_time_days?: number | string | null;
  active?: boolean | number;
};

export type RefItem = { id: number; name: string };
export type RefData = { brands: RefItem[]; suppliers: RefItem[] };

export type WintechApi = {
  getAppInfo: () => Promise<AppInfo>;
  catalog: {
    refData: () => Promise<RefData>;
  };
  products: {
    list: () => Promise<Product[]>;
    get: (id: number) => Promise<Product | undefined>;
    create: (input: ProductInput) => Promise<Product>;
    update: (id: number, input: ProductInput) => Promise<Product>;
    toggleActive: (id: number) => Promise<Product>;
  };
};

declare global {
  interface Window {
    api: WintechApi;
  }
}

export const api: WintechApi = window.api;
