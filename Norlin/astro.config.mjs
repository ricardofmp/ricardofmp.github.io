// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from "astro-icon";
import remarkDirective from 'remark-directive';
import remarkWideImage from './src/plugins/remark-wide-image';
import remarkGallery from './src/plugins/remark-gallery';
import { remarkCallout } from './src/plugins/remark-callout.mjs';
import { settings } from './src/data/settings';

const site = process.env.SITE || settings.site.url;
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 700, 900],
      styles: ['normal'],
    }
  ],
  markdown: {
    remarkPlugins: [remarkDirective, remarkWideImage, remarkGallery, remarkCallout],
  },
  integrations: [sitemap(), icon(), mdx()],
  vite: {
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
