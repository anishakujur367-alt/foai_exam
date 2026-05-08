import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars from .env so we can use them in the dev proxy
  const env = loadEnv(mode, process.cwd())
  const apiKey = env.VITE_NEWS_API_KEY

  return {
    plugins: [react()],
    server: {
      proxy: {
        // On localhost: /api/news → NewsAPI (server-side, no CORS)
        '/api/news': {
          target: 'https://newsapi.org',
          changeOrigin: true,
          rewrite: () =>
            `/v2/top-headlines?language=en&pageSize=30&apiKey=${apiKey}`,
        },
      },
    },
  }
})
