# src/main — Proceso principal de Electron

Responsabilidad (se llena desde la **Fase 1**):

- Ciclo de vida de la app y creación de la ventana.
- **Conexión a SQLite** (es el único proceso que toca la base y el sistema de archivos).
- Ejecución de migraciones (`db/migrations/`).
- Registro de **handlers IPC**: recibe pedidos del renderer, consulta la base, llama a
  `src/domain` para los cálculos, y devuelve resultados.

**No** debe contener UI ni reglas de negocio (esas van en `src/domain`).
Ver [`../../docs/06-arquitectura.md`](../../docs/06-arquitectura.md).
