import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ProductForm } from '../components/ProductForm';
import { IcPlus, IcSrch } from '../shell/icons';
import { api, type Product, type ProductInput, type RefData } from '../lib/api';
import { familyLabel, unitLabel, fmtNum } from '../lib/catalog';
import { labels } from '../labels';

const L = labels.products;
type FamFilter = 'todas' | 'perfil' | 'herraje' | 'accesorio';

const FAM_TABS: { v: FamFilter; label: string }[] = [
  { v: 'todas', label: L.famTodas },
  { v: 'perfil', label: L.famPerfil },
  { v: 'herraje', label: L.famHerraje },
  { v: 'accesorio', label: L.famAccesorio },
];

export function Productos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refData, setRefData] = useState<RefData>({ brands: [], suppliers: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [fam, setFam] = useState<FamFilter>('todas');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    setProducts(await api.products.list());
  }

  useEffect(() => {
    Promise.all([api.products.list(), api.catalog.refData()])
      .then(([list, rd]) => {
        setProducts(list);
        setRefData(rd);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (fam !== 'todas' && p.family !== fam) return false;
      if (!q) return true;
      return p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    });
  }, [products, query, fam]);

  async function handleSubmit(input: ProductInput) {
    setSaving(true);
    setError(null);
    try {
      if (editing === 'new') await api.products.create(input);
      else if (editing) await api.products.update(editing.id, input);
      await reload();
      setEditing(null);
    } catch (e) {
      setError((e as Error).message ?? 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function toggle(p: Product) {
    await api.products.toggleActive(p.id);
    await reload();
  }

  return (
    <>
      <PageHeader
        title={L.title}
        lede={L.lede}
        actions={
          <button
            className="tb-btn primary"
            onClick={() => {
              setError(null);
              setEditing('new');
            }}
          >
            <IcPlus size={14} /> {L.nuevo}
          </button>
        }
      />

      <div className="filter-bar">
        <div className="search">
          <IcSrch size={14} />
          <input
            placeholder={L.buscar}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="segmented">
          {FAM_TABS.map((t) => (
            <button
              key={t.v}
              className={fam === t.v ? 'active' : ''}
              onClick={() => setFam(t.v)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-h">
          <h3>{L.title}</h3>
          <span className="sub">
            {filtered.length} de {products.length}
          </span>
        </div>

        {loading ? (
          <div className="empty">
            <p>Cargando…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty">
            <h3>{L.vacioTitulo}</h3>
            <p>{L.vacioBody}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <p>{L.sinResultados}</p>
          </div>
        ) : (
          <table className="dtable">
            <thead>
              <tr>
                <th>{L.colProducto}</th>
                <th>{L.colFamilia}</th>
                <th>{L.colMarca}</th>
                <th>{L.colProveedor}</th>
                <th>{L.colUnidad}</th>
                <th className="num">{L.colCosto}</th>
                <th className="num">{L.colPrecio}</th>
                <th className="num">{L.colMinimo}</th>
                <th>{L.colEstado}</th>
                <th aria-label={L.colAcciones} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={p.active ? '' : 'inactive'}>
                  <td>
                    <div className="name">{p.name}</div>
                    <div className="meta">
                      {p.sku}
                      {p.line ? ` · ${p.line}` : ''}
                      {p.color ? ` · ${p.color}` : ''}
                    </div>
                  </td>
                  <td>
                    <span className={`fam ${p.family ?? ''}`}>
                      <span className="d" />
                      {familyLabel(p.family)}
                    </span>
                  </td>
                  <td>{p.brand_name ?? '—'}</td>
                  <td>{p.supplier_name ?? '—'}</td>
                  <td>{unitLabel(p.unit)}</td>
                  <td className="num">
                    {fmtNum(p.last_cost_usd, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="num">{fmtNum(p.sale_price_ars, { maximumFractionDigits: 0 })}</td>
                  <td className="num">{fmtNum(p.min_stock)}</td>
                  <td>
                    <span className={`estado ${p.active ? 'on' : 'off'}`}>
                      <span className="d" />
                      {p.active ? L.activo : L.inactivo}
                    </span>
                  </td>
                  <td>
                    <div className="row-act">
                      <button
                        onClick={() => {
                          setError(null);
                          setEditing(p);
                        }}
                      >
                        {L.editar}
                      </button>
                      <button onClick={() => toggle(p)}>
                        {p.active ? L.desactivar : L.activar}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <Modal
          title={editing === 'new' ? L.nuevoTitulo : L.editarTitulo}
          onClose={() => setEditing(null)}
          footer={
            <>
              {error && <span className="modal-err">{error}</span>}
              <div className="grow" />
              <button className="tb-btn" onClick={() => setEditing(null)}>
                {L.cancelar}
              </button>
              <button className="tb-btn primary" type="submit" form="product-form" disabled={saving}>
                {L.guardar}
              </button>
            </>
          }
        >
          <ProductForm
            product={editing === 'new' ? undefined : editing}
            refData={refData}
            onSubmit={handleSubmit}
            formId="product-form"
          />
        </Modal>
      )}
    </>
  );
}
