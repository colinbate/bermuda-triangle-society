import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const locations = defineCollection({
  loader: glob({ pattern: "**/*.toml", base: "./src/content/locations" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    url: z.string().url(),
  }),
});

const sessions = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/sessions" }),
  schema: z.object({
    title: z.string(),
    status: z.enum(["current", "upcoming", "past"]),
    date: z.date(),
    time: z.string().optional(),
    locationId: z.string().optional(),
    themeTitle: z.string(),
    themeSummary: z.string(),
    tags: z.array(z.string()).optional(),
    starterList: z
      .array(
        z.object({
          title: z.string(),
          author: z.string(),
          format: z.array(z.string()).optional(),
          source: z.string().optional(),
          note: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { locations, sessions };
