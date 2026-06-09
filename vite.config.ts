import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuracion del renderer (React) de la app Electron.
// - root: el codigo del renderer vive en src/renderer.
// - base './': rutas relativas para que el build cargue con file:// en produccion.
// - build.outDir: build/renderer (lo carga main.js cuando la app esta empaquetada).
export default defineConfig({
  root: 'src/renderer',
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: '../../build/renderer',
    emptyOutDir: true,
  },
});
