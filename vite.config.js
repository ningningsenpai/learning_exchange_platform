import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },


  // 添加代理配置
  server: {
    host: '0.0.0.0',
    port: 5173, 
    proxy: {
      '/api': {
        target: 'http://10.244.193.207:8080',
        // target: 'http://192.168.43.23:8080',
        // target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
