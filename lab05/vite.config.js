import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Без этого Vite слушал только IPv6 (::1), и браузер,
  // резолвящий localhost в 127.0.0.1, получал «не удалось получить доступ».
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
