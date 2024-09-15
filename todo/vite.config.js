import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    reactStrictMode: true,

    optimizeDeps: {
        exclude: ['js-big-decimal']
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            onwarn(warning, defaultHandler) {
                if (warning.code === 'SOURCEMAP_ERROR') {
                    return
                }

                defaultHandler(warning)
            },
        },
    }
});
