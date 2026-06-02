# src/domain — Lógica de negocio pura

Responsabilidad (se llena desde la **Fase 3/7**):

- **Lógica de negocio pura**: cálculo de stock, pronóstico de demanda (EWMA) y reposición
  (punto de reposición, stock de seguridad, cantidad order-up-to).
- **Sin dependencias de Electron, SQL ni UI.** Recibe datos como parámetros y devuelve resultados.
- **Debe implementar exactamente** [`../../docs/05-reglas-negocio.md`](../../docs/05-reglas-negocio.md)
  (IDs `BR-n`). Si cambia la matemática, se actualiza ese documento en el mismo commit.
- Es la capa **testeable**: los tests de `test/` validan el ejemplo numérico de `docs/05`.

Ver [`../../docs/06-arquitectura.md`](../../docs/06-arquitectura.md).
