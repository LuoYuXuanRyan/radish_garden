import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    introText: z.string(),
    author: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
  }),
});

export const collections = {
  'posts': postCollection,
};