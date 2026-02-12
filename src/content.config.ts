import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const themes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/themes' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['current', 'upcoming', 'past']),
    meetingDate: z.string().optional(),
    voteDate: z.string().optional(),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
    starterList: z.array(z.object({
      title: z.string(),
      author: z.string(),
      format: z.array(z.string()).optional(),
      source: z.string().optional(),
      note: z.string().optional(),
    })).optional(),
  }),
});

const meetings = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/meetings' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    time: z.string().optional(),
    location: z.string().optional(),
    themeSlug: z.string().optional(),
    agenda: z.array(z.string()).optional(),
  }),
});

export const collections = { themes, meetings };
