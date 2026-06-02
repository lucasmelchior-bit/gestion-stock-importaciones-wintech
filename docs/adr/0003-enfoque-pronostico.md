# ADR-0003 — Enfoque de pronóstico: EWMA + punto de reposición clásico

- **Estado:** Aceptada
- **Fecha:** 2026-05-29

## Contexto

El núcleo de valor es **no quedarse sin stock** pese a un lead time de importación de ~3,5 meses,
sin sobre-stockearse. Hace falta estimar la demanda futura de cada ítem a partir del historial de
ventas, con un método **entendible, explicable y barato de computar** (no hay científico de datos;
el dueño no es técnico).

## Decisión

- Aprender la velocidad de venta con **EWMA** (promedio móvil exponencialmente ponderado) sobre
  buckets semanales de consumo.
- Calcular **punto de reposición** clásico = demanda durante el lead time + **stock de seguridad**
  (`Z · σ_LT`), con **Z = 1,65** (~95% de nivel de servicio).
- Disparar alerta contra **stock en mano + en tránsito** (evita pedidos duplicados).
- Recomendar cantidad con **order-up-to** que cubre lead time + horizonte `C` (~90 días).
- Toda la fórmula está en [`../05-reglas-negocio.md`](../05-reglas-negocio.md).

## Alternativas consideradas

- **Promedio simple / móvil sin ponderar:** no se adapta a tendencias recientes.
- **Modelos avanzados (ARIMA, Holt-Winters, ML):** sobredimensionados para v1, difíciles de
  explicar y de mantener; requieren más historial del que hoy existe.
- **Croston (demanda intermitente):** mejor para herrajes de venta esporádica; se deja como
  **mejora futura** y por ahora esos ítems se marcan `intermittent` y se apoyan en `min_stock`.

## Consecuencias

- **Positivas:** simple, explicable, se adapta solo, computacionalmente trivial; cada número se
  puede justificar ante el dueño.
- **Negativas / límites v1:** no modela **estacionalidad** fuerte ni promociones; la demanda
  intermitente queda aproximada. Documentado como deuda futura.
- A revisar: si aparece estacionalidad marcada, evaluar un índice estacional (nueva ADR).
