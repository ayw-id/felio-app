import { fileURLToPath, URL } from 'node:url'
import typescript2 from 'rollup-plugin-typescript2'
import vuetify from 'vite-plugin-vuetify'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    typescript2({
      check: false,
      include: ['src/components/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true
        }
      },
      exclude: ['vite.config.ts']
    }),
    vuetify({
      autoImport: true
    })
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './src/BasePlugin.ts',
      formats: ['es', 'cjs'],
      name: 'BasePlugin',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      external: ['vue'], // IMPORTANT !!
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
