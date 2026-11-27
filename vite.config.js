import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@inertiajs/react': '@/compat/inertia',
            '@': '/opt/lampp/htdocs/dashboard-gis-clone/resources/js',
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
