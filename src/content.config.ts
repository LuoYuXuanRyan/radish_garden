import { z, defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()),
        description: z.string(),
        introText: z.string(),
        author: z.string(),
        publishDate: z.coerce.date(),
    }),
});

export const collections = { posts };
