import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      cache: true,
      cacheLocation: './node_modules/.cache/vite-plugin-image-optimizer',
      webp: { quality: 80 },
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
    }),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'chart.js',
      'react-chartjs-2',
      'react-datepicker',
      '@floating-ui/react',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              /node_modules\/(?:react|react-dom|react-router-dom|react-chartjs-2)(?:\/|$)/.test(id)
            ) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/react-icons/') || id.includes('node_modules/lucide-react/')) {
              return 'icons-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 5174,
    open: true,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-datepicker', '@floating-ui/react'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
