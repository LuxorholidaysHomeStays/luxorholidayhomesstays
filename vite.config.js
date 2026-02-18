import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    splitVendorChunkPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'styled-components', '@headlessui/react', '@heroicons/react'],
          'date-vendor': ['react-date-range', 'react-datepicker'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'animation-vendor': ['aos', 'react-intersection-observer', 'react-countup'],
          'icons-vendor': ['react-icons', 'lucide-react'],
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
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})

