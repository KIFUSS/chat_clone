import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // или @vitejs/plugin-react в зависимости от вашего шаблона
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})