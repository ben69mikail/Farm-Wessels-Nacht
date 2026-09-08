// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Nach dem Verbinden der neuen Netlify-Site hier die endgültige URL eintragen.
export const SITE = 'https://wesselsfarm.netlify.app';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'de', locales: { de: 'de-DE', en: 'en-GB' } } })],
  image: { responsiveStyles: true },
  build: { inlineStylesheets: 'auto' },
  vite: { build: { cssMinify: true } },
});
