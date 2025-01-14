import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add fast refresh options
      fastRefresh: true,
      // Ensure single React instance
      jsxRuntime: 'automatic',
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [
      'axios',
      '@headlessui/react',
      'framer-motion',
      '@tanstack/react-query'
    ],
    force: true,
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'animation': ['framer-motion', 'react-intersection-observer'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, 
    strictPort: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
