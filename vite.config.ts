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
    // No build-time compression: Firebase Hosting gzips/brotlis on the fly,
    // so emitting .gz/.br files just adds 54 redundant uploads per deploy.
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
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          animations: ['@use-gesture/react', 'gsap'],
          // Firebase is only needed by the admin and registration routes;
          // keeping it separate keeps it out of the landing page's critical path.
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
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
