import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  minify: true, // 是否压缩代码
  build: {
    rollupOptions: {
      output: {
        // 修改静态资源路径
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'static/assets/js/[name]-[hash].js',
        assetFileNames: 'static/assets/[ext]/[name]-[hash].[ext]',
      }
    }
  },
  base: './', // 资源定位更改为相对路径
  server: {
    port: 8888,
    host: '0.0.0.0',
    proxy: {
      "/ath-oil-web": {
        target: "http://192.168.0.1:8080/", // 后端ip
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ath-oil-web/, "ath-oil-web"),
      },
    },
  },
})
