import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/book': 'http://localhost:3000',
      '/stripe': 'http://localhost:3000',
    },
  },
});
