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
  server: {
    proxy: {
      // Proxy /api/wave requests to https://api.wave.com
      '/api/wave': {
        target: 'https://api.wave.com',
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api\/wave/, ''), // Remove /api/wave from the request path
        secure: false, // If the target API uses a self-signed SSL certificate
        configure: (proxy, options) => {
          // You can configure the proxy server here if needed
          // For example, to add custom headers to the proxied request
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Example: console.log('Proxying request:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Example: console.log('Received response from target:', proxyRes.statusCode);
          });
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
        }
      }
    }
  }
})
