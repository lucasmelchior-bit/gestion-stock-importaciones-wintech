# ADR-0002 — Política de idioma: UI/docs en español, código en inglés

- **Estado:** Aceptada
- **Fecha:** 2026-05-29

## Contexto

El usuario y eventuales colaboradores son argentinos; la documentación debe poder validarla el
dueño (no técnico). A la vez, el proyecto debe ser **interpretable por cualquier IA o
desarrollador**, y las librerías, SQL y el corpus de entrenamiento de las IAs son
mayoritariamente en inglés.

## Decisión

- **UI en español**, con textos centralizados en un mapa `labels` (la UI es dato, no literales sueltos).
- **Documentación en español.**
- **Identificadores de código (variables, funciones, tablas, columnas) en inglés**, según el
  [glosario](../02-glosario.md).
- **Sin acentos en identificadores ni nombres de archivo.**

## Alternativas consideradas

- **Todo en español (también el código):** genera nombres mixtos con keywords inglesas
  (`crearSalesOrder`), peor para herramientas e IAs, y riesgo de encoding por acentos.
- **Todo en inglés (también la UI/docs):** el dueño no técnico no podría validar requerimientos.

## Consecuencias

- **Positivas:** lo mejor de ambos mundos; el glosario hace de puente y elimina la ambigüedad
  español↔inglés; portable si se suma un dev.
- **Negativas:** exige mantener el glosario al día (es obligatorio).
- A revisar: si se internacionaliza la UI, el mapa `labels` ya deja preparado el camino.
