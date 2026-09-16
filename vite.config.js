import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'dorme-dorme-precioso-capa.png'],
      manifest: {
        name: 'Dorme, Dorme, Precioso',
        short_name: 'Dorme Precioso',
        description: 'Plataforma de acolhimento para mamães que amamentam durante a madrugada.',
        theme_color: '#0E1F38',
        background_color: '#06162B',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'dorme-dorme-precioso-capa.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api/, /\.mp3$/, /\.wav$/, /\.m4a$/, /^https:\/\/.*\.supabase\.co/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin.includes('supabase.co') || url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav') || url.pathname.endsWith('.m4a'),
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  }
});
