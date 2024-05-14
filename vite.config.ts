import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../dist/view',
  },
  experimental: {
    renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
      console.log(hostId, hostType, type, '???---', filename)
      if(hostType === 'css') return `../${filename}`
      return `./${filename}`;
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: './src/auto-imports.d.ts', 
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: './src/components.d.ts',
    }),
  ],
})
