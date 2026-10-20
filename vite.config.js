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
    target: 'es2020',
    cssCodeSplit: true,
    modulePreload: {
      resolveDependencies: (filename, deps) => {
        return deps.filter(dep => !dep.includes('vendor-supabase') && !dep.includes('vendor-three'));
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vite') || id.includes('rolldown') || id.includes('tslib')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('locomotive-scroll') || id.includes('lenis')) {
              return 'vendor-scroll';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('scheduler')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
})
