import { useState } from 'react';
import type { Product, ProductInput, RefData } from '../lib/api';
import { FAMILIES, UNITS } from '../lib/catalog';
import { labels } from '../labels';

const L = labels.products;

type FormState = Record<string, string | boolean>;

function toForm(p?: Product): FormState {
  const s = (v: unknown) => (v === null || v === undefined ? '' : String(v));
  return {
    sku: s(p?.sku),
    name: s(p?.name),
    family: p?.family ?? 'perfil',
    line: s(p?.line),
    color: s(p?.color),
    brand_id: s(p?.brand_id),
    supplier_id: s(p?.supplier_id),
    unit: p?.unit ?? 'unit',
    bar_length_m: s(p?.bar_length_m),
    weight_kg: s(p?.weight_kg),
    volume_m3: s(p?.volume_m3),
    last_cost_usd: s(p?.last_cost_usd),
    sale_price_ars: s(p?.sale_price_ars),
    target_margin_pct: s(p?.target_margin_pct),
    min_stock: s(p?.min_stock),
    safety_stock: s(p?.safety_stock),
    target_stock: s(p?.target_stock),
    lead_time_days: s(p?.lead_time_days),
    active: p ? p.active === 1 : true,
  };
}

type Props = {
  product?: Product;
  refData: RefData;
  onSubmit: (input: ProductInput) => void;
  formId: string;
};

/** Formulario de alta/edición de producto. El submit lo dispara el footer del modal. */
export function ProductForm({ product, refData, onSubmit, formId }: Props) {
  const [form, setForm] = useState<FormState>(() => toForm(product));
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const str = (k: string) => form[k] as string;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const input: ProductInput = {
      sku: str('sku'),
      name: str('name'),
      family: str('family'),
      line: str('line') || null,
      color: str('color') || null,
      brand_id: str('brand_id') === '' ? null : Number(str('brand_id')),
      supplier_id: str('supplier_id') === '' ? null : Number(str('supplier_id')),
      unit: str('unit'),
      bar_length_m: str('bar_length_m'),
      weight_kg: str('weight_kg'),
      volume_m3: str('volume_m3'),
      last_cost_usd: str('last_cost_usd'),
      sale_price_ars: str('sale_price_ars'),
      target_margin_pct: str('target_margin_pct'),
      min_stock: str('min_stock'),
      safety_stock: str('safety_stock'),
      target_stock: str('target_stock'),
      lead_time_days: str('lead_time_days'),
      active: form.active as boolean,
    };
    onSubmit(input);
  }

  return (
    <form id={formId} className="form-grid" onSubmit={submit}>
      <div className="field">
        <label>{L.fSku} *</label>
        <input value={str('sku')} onChange={(e) => set('sku', e.target.value)} required />
      </div>
      <div className="field">
        <label>{L.fNombre} *</label>
        <input value={str('name')} onChange={(e) => set('name', e.target.value)} required />
      </div>

      <div className="form-section">{L.secClasificacion}</div>
      <div className="field">
        <label>{L.fFamilia}</label>
        <select value={str('family')} onChange={(e) => set('family', e.target.value)}>
          {FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>{L.fUnidad}</label>
        <select value={str('unit')} onChange={(e) => set('unit', e.target.value)}>
          {UNITS.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>{L.fLinea}</label>
        <input value={str('line')} onChange={(e) => set('line', e.target.value)} />
      </div>
      <div className="field">
        <label>{L.fColor}</label>
        <input value={str('color')} onChange={(e) => set('color', e.target.value)} />
      </div>
      <div className="field">
        <label>{L.fMarca}</label>
        <select value={str('brand_id')} onChange={(e) => set('brand_id', e.target.value)}>
          <option value="">{L.optSinMarca}</option>
          {refData.brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>{L.fProveedor}</label>
        <select value={str('supplier_id')} onChange={(e) => set('supplier_id', e.target.value)}>
          <option value="">{L.optSinProveedor}</option>
          {refData.suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>{L.fLargoBarra}</label>
        <input
          type="number"
          step="0.01"
          value={str('bar_length_m')}
          onChange={(e) => set('bar_length_m', e.target.value)}
        />
      </div>
      <div className="field">
        <label>{L.fPeso}</label>
        <input
          type="number"
          step="0.001"
          value={str('weight_kg')}
          onChange={(e) => set('weight_kg', e.target.value)}
        />
      </div>
      <div className="field">
        <label>{L.fVolumen}</label>
        <input
          type="number"
          step="0.0001"
          value={str('volume_m3')}
          onChange={(e) => set('volume_m3', e.target.value)}
        />
      </div>

      <div className="form-section">{L.secComercial}</div>
      <div className="field">
        <label>{L.fCosto}</label>
        <input
          type="number"
          step="0.01"
          value={str('last_cost_usd')}
          onChange={(e) => set('last_cost_usd', e.target.value)}
        />
      </div>
      <div className="field">
        <label>{L.fPrecio}</label>
        <input
          type="number"
          step="0.01"
          value={str('sale_price_ars')}
          onChange={(e) => set('sale_price_ars', e.target.value)}
        />
      </div>
      <div className="field">
        <label>{L.fMargen}</label>
        <input
          type="number"
          step="0.1"
          value={str('target_margin_pct')}
          onChange={(e) => set('target_margin_pct', e.target.value)}
        />
      </div>

      <div className="form-section">{L.secStock}</div>
      <div className="field">
        <label>{L.fMinimo}</label>
        <input
          type="number"
          step="1"
          value={str('min_stock')}
          onChange={(e) => set('min_stock', e.target.value)}
        />
      </div>
      <div className="field">
        <label>{L.fSeguridad}</label>
        <input
          type="number"
          step="1"
          value={str('safety_stock')}
          onChange={(e) => set('safety_stock', e.target.value)}
        />
      </div>
      <div className="field">
        <label>{L.fObjetivo}</label>
        <input
          type="number"
          step="1"
          value={str('target_stock')}
          onChange={(e) => set('target_stock', e.target.value)}
        />
      </div>
      <div className="field">
        <label>{L.fLeadTime}</label>
        <input
          type="number"
          step="1"
          value={str('lead_time_days')}
          onChange={(e) => set('lead_time_days', e.target.value)}
        />
      </div>

      <div className="field col-2" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input
          id="active"
          type="checkbox"
          checked={form.active as boolean}
          onChange={(e) => set('active', e.target.checked)}
          style={{ width: 'auto' }}
        />
        <label htmlFor="active" style={{ textTransform: 'none' }}>
          {L.fActivo}
        </label>
      </div>
    </form>
  );
}
