import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({ reactivityTransform: true }),
    Components({ dts: 'src/components.d.ts' }),
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    UnoCSS({
      shortcuts: {
        'icon-btn': 'op30 hover:(op100 text-primary)',
      },
      theme: {
        fontFamily: {
          self: 'CMU Sans Serif',
        },
        colors: {
          primary: '#377BB5',
        },
      },
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons(),
      ],
    }),
  ],
})
