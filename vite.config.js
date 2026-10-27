import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    process.env.ANALYZE ? visualizer({ filename: 'stats.html', open: false, gzipSize: true }) : null
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    modulePreload: {
      resolveDependencies: (filename, deps) => {
        // Don't preload heavy vendor chunks — they are loaded on demand
        return deps.filter(dep =>
          !dep.includes('vendor-supabase') &&
          !dep.includes('vendor-three') &&
          !dep.includes('vendor-gsap') &&
          !dep.includes('vendor-scroll')
        );
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep three.js / react-three out of the main bundle (unused in prod but still in deps)
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('locomotive-scroll') || id.includes('lenis')) {
              return 'vendor-scroll';
            }
            if (id.includes('gsap')) {
              // GSAP is now dynamically imported by LoadingScreen — keeps it out of entry
              return 'vendor-gsap';
            }
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('scheduler') ||
              id.includes('vite') ||
              id.includes('rolldown') ||
              id.includes('tslib')
            ) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
})
