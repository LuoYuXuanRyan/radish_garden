// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind()],
    markdown: {
        shikiConfig: {
            theme: 'one-dark-pro',
        },
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeMathjax],
    },
    image: {
        service: passthroughImageService(),
    },
    site: "https://luoyuxuanryan.pages.dev"
});
