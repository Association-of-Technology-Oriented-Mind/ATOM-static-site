import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    // Gzip compression for production
    mode === "production" && compression({
      algorithms: ['gzip'],
      exclude: [/\.(br)$ /, /\.(gz)$/],
    }),
    // Brotli compression for production (better than gzip)
    mode === "production" && compression({
      algorithms: ['brotliCompress'],
      exclude: [/\.(br)$ /, /\.(gz)$/],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        // Strip debug logging but keep console.error/warn, so production
        // failures (registration, uploads, auth) stay diagnosable.
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          // Vendor chunk for stable dependencies
          vendor: ['react', 'react-dom'],
          // UI libraries chunk
          ui: ['framer-motion', 'lucide-react'],
          // Animation libraries
          animations: ['@use-gesture/react', 'gsap'],
          // Email functionality
          email: ['@emailjs/browser'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging in production
    sourcemap: mode === 'development',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      '@use-gesture/react',
      'gsap',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  // CSS optimization
  css: {
    devSourcemap: mode === 'development',
  },
}));
