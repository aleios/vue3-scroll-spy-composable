import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
    plugins: [
        Vue(),
    ],
    test: {
        globals: true,
        environment: 'happy-dom',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '~/': fileURLToPath(new URL('./src/', import.meta.url))
        }
    },
})