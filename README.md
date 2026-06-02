# Software-IA-Lucas

Programa de escritorio para Windows que gestiona el **stock y los pedidos** de un importador/
distribuidor de insumos para aberturas de PVC, y **recomienda cuándo y cuánto importar** según
la velocidad de venta de cada producto y la demora de importación (~3,5 meses).

> 🤖 **¿Sos una IA o desarrollador/a que recién llega?** Empezá por **[`AGENTS.md`](AGENTS.md)**.
> El mapa de toda la documentación está en [`docs/00-INDICE.md`](docs/00-INDICE.md).

## Qué hace (resumen)

- ABM de productos (perfiles, herrajes, ruedas y accesorios).
- Control de stock vivo por ítem.
- Pedidos de venta a clientes (fabricantes de aberturas) que descuentan stock.
- Alertas de stock crítico.
- **Pronóstico de demanda + recomendación de reposición** considerando el stock en tránsito y el
  lead time de importación, para no quedarse sin stock.

## Stack

- **Electron** (app de escritorio instalable en Windows)
- **SQLite** (base de datos en un archivo local)
- **HTML / CSS / JavaScript** (interfaz)
- Un solo usuario, funciona offline, sin login.

## Estado del proyecto

**Fase 0 — Arnés (documentación y estructura).** Todavía no hay código de la aplicación.
Ver el avance y las fases en [`docs/08-roadmap.md`](docs/08-roadmap.md) y el estado/handoff en
[`ESTADO.md`](ESTADO.md).

## Puesta en marcha (a partir de la Fase 1, cuando exista código)

> Estos pasos aún no aplican porque el código se agrega en la Fase 1. Quedan documentados para
> cuando corresponda.

```powershell
# 1. Instalar Node.js (versión en .nvmrc). En Windows, por ejemplo:
winget install OpenJS.NodeJS.LTS

# 2. Instalar dependencias
npm install

# 3. Correr en modo desarrollo
npm run dev

# 4. Generar el instalador .exe
npm run build
```

## Estructura del repositorio

```
AGENTS.md / CLAUDE.md / README.md   Entradas (IA / Claude / humano)
docs/                               Documentación: visión, glosario, requerimientos, reglas, etc.
db/                                 schema.sql + migrations/ (SQLite)
src/                                Código (main / preload / renderer / domain) — se llena desde Fase 1
test/                               Tests (sobre todo de src/domain)
seed/                               Datos de ejemplo
```

## Licencia

Privado / uso interno. (Definir si corresponde.)
