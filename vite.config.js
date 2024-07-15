import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vitePluginRequire from "vite-plugin-require";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 让vite支持require语法
    vitePluginRequire.default()
  ],
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
  base: './', // 资源定位可更改为相对路径，如 ./
  server: {
    port: 8888,
    host: '0.0.0.0',
    proxy: {
      "/ath-oil-web/": {
        target: "http://192.168.xx.xx:8082/",
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ath-oil-web/, "ath-oil-web"),
      },
    },
  },
})
