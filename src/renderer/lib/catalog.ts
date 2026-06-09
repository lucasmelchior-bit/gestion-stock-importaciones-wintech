// Constantes y helpers del catálogo (familias, unidades, formato).

export const FAMILIES = [
  { value: 'perfil', label: 'Perfil' },
  { value: 'herraje', label: 'Herraje' },
  { value: 'accesorio', label: 'Accesorio' },
] as const;

export const UNITS = [
  { value: 'bar', label: 'Barra' },
  { value: 'unit', label: 'Unidad' },
  { value: 'set', label: 'Juego' },
  { value: 'meter', label: 'Metro' },
] as const;

export function familyLabel(v: string | null): string {
  return FAMILIES.find((f) => f.value === v)?.label ?? '—';
}

export function unitLabel(v: string | null): string {
  return UNITS.find((u) => u.value === v)?.label ?? v ?? '—';
}

/** Formatea un número (es-AR) o devuelve em-dash si es nulo. */
export function fmtNum(v: number | null, opts?: Intl.NumberFormatOptions): string {
  if (v === null || v === undefined) return '—';
  return v.toLocaleString('es-AR', opts);
}
