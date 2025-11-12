import { defineConfig, loadEnv } from 'vite'


export default defineConfig(({ mode }) => {


  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: false,
    },
    build: {
      chunkSizeWarningLimit: 1024, // chunk 大小警告的限制（单位kb）
    },
  }
})
