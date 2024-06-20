import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),
    VitePWA({
        registerType: 'autoUpdate',
        workbox: {
            globPatterns: ['**/*.{html,css,js,ico,png,svg,ttf}'],
            runtimeCaching: [{
                handler: 'CacheFirst',
                urlPattern: /.*\.(json|csv|txt)$/,
                options: { cacheName: 'textData' }
            }, {
                handler: 'CacheFirst',
                urlPattern: /.*\.mp3$/,
                options: { cacheName: 'audioData', rangeRequests: true }
            }]
        },
        manifest: {
            id: 'Quran-PWA',
            name: 'Quran PWA',
            short_name: 'Quran',
            description: 'Quran PWA',
            theme_color: '#000000',
            background_color: '#000000',
            display: 'standalone',
            orientation: 'any',
            icons: [
                {
                    src: '/images/quran-rehal.svg',
                    sizes: "32x32 48x48 72x72 96x96 128x128 144x144 256x256 512x512",
                    type: "image/svg+xml",
                    purpose: "any"
                }
            ]
        }
    })],
})
