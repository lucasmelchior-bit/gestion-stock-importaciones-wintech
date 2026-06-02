# Gestión de Stock e Importaciones Wintech

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

**Fase 1 — Esqueleto: completada.** Ya hay app: ventana de Electron, base SQLite (vía el módulo
integrado `node:sqlite`) con migraciones, y arranque con `npm run dev`. Ver el avance y las fases
en [`docs/08-roadmap.md`](docs/08-roadmap.md) y el estado/handoff en [`ESTADO.md`](ESTADO.md).

## Puesta en marcha

```powershell
# 1. Instalar Node.js (versión en .nvmrc → 24). En Windows:
winget install OpenJS.NodeJS.LTS

# 2. Instalar dependencias
npm install

# 3. Correr en modo desarrollo (abre la ventana)
npm run dev

# 4. (Opcional) Aplicar/inspeccionar migraciones sin abrir la app
npm run migrate

# 5. Empaquetar la app de escritorio
npm run build
```

El paso 5 deja un ejecutable funcional en `dist/win-unpacked/`. Para generar además el **instalador
`.exe`** (NSIS) hay que tener activado el **Modo de Desarrollador de Windows** (Configuración →
Privacidad y seguridad → Para desarrolladores), porque el empaquetador necesita crear enlaces
simbólicos. El instalador final se pule en la Fase 8.

> El acceso a la base usa el módulo integrado `node:sqlite`, así que **no hace falta** instalar
> compiladores de C++ ni herramientas de build. Ver `docs/adr/0004-sqlite-integrado-node.md`.

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
