import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://openapi.twse.com.tw/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  base: './',
  plugins: [vue()],
  define: {
    'process.env.APP_VERSION': JSON.stringify(version),
  }
});
