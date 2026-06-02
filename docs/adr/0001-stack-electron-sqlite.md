# ADR-0001 — Stack: Electron + SQLite + HTML/CSS/JS

- **Estado:** Aceptada
- **Fecha:** 2026-05-29

## Contexto

Se necesita un **programa de escritorio instalable en Windows**, para **un solo usuario**, que
funcione **offline**, centrado en datos (tablas de productos, stock, pedidos, alertas) y con
lógica de pronóstico. El usuario no es técnico y la PC parte **sin entorno de desarrollo** instalado.

## Decisión

Construir la app con **Electron** (empaqueta a `.exe` instalable con `electron-builder`),
**SQLite** como base de datos en un archivo local, e interfaz en **HTML/CSS/JavaScript**.

## Alternativas consideradas

- **.NET / WPF (C#):** nativo y liviano, pero UI más verbosa (XAML) y menos flexible para iterar rápido.
- **Python + GUI (PyQt/Tkinter):** válido, pero empaquetado a `.exe` más engorroso y UI menos pulida.
- **App web en la nube:** descartada: el usuario eligió explícitamente un programa instalable y de un solo usuario.

## Consecuencias

- **Positivas:** instalador `.exe` real con ícono; UI moderna y fácil de iterar; SQLite simple,
  confiable y respaldable (un archivo); todo offline; ecosistema JS amplio.
- **Negativas:** el instalador de Electron es pesado (~150 MB) — aceptable para una herramienta
  de escritorio de un usuario.
- A revisar: motor de acceso a SQLite (`better-sqlite3` es el candidato) se confirma en Fase 1.
