import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), VueDevTools({ launchEditor: 'C:\\Program Files\\JetBrains\\WebStorm 2025.3.3\\bin\\webstorm64.exe' })],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  }
})
