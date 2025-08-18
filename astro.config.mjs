import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [react()],
    adapter: netlify(),
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: false
        }
    }
});
