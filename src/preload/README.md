# src/preload — Puente seguro (preload de Electron)

Responsabilidad (se llena desde la **Fase 1**):

- Exponer al renderer una API acotada mediante `contextBridge` (única superficie IPC).
- **Documentar cada canal IPC** (qué pide, qué devuelve).

**No** debe contener lógica de negocio ni acceso directo a la base.
Ver [`../../docs/06-arquitectura.md`](../../docs/06-arquitectura.md).
