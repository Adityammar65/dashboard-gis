import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const resourcesJs = fileURLToPath(new URL('./resources/js', import.meta.url));
const inertiaCompat = fileURLToPath(new URL('./resources/js/compat/inertia.jsx', import.meta.url));

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@inertiajs/react': inertiaCompat,
            '@': resourcesJs,
        },
    },
    build: {
        outDir: 'dist',
        chunkSizeWarningLimit: 600,
        assetsInlineLimit: 4096,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                    leaflet: ['leaflet', 'react-leaflet'],
                    icons: ['react-icons'],
                },
            },
        },
    },
});
