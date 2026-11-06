import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚠️ IMPORTANTE para GitHub Pages:
// Esta ruta debe coincidir con el nombre de tu repositorio.
// Si tu repo se llama distinto a "huellitas-a-salvo", cambia la línea de abajo
// por:  base: '/<nombre-de-tu-repo>/'
export default defineConfig({
  base: '/huellitas-a-salvo/',
  plugins: [react()],
});
