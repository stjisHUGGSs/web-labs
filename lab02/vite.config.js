import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Явный host: иначе Vite слушает только IPv6 (::1),
  // а браузер резолвит localhost в 127.0.0.1 и не открывает страницу.
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
