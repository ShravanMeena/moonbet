import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      manifest: {
        name: 'MoonBet',
        short_name: 'MoonBet',
        description: 'MoonBet PWA',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0a0a1a',
        theme_color: '#6c63ff',
        categories: ['entertainment', 'games'],
        icons: [
          { src: '/icons/icon-180.png?v=3', sizes: '180x180', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-192.png?v=3', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png?v=3', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  // Dev: proxy API + static asset calls to Node server
  server: {
    proxy: {
      '/vapid-public-key': 'http://localhost:3000',
      '/subscribe':        'http://localhost:3000',
      '/send-notification':'http://localhost:3000',
      '/icons':            'http://localhost:3000',
      '/splash':           'http://localhost:3000'
    }
  }
})
