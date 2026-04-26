import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { sessionsLoader } from "./loaders/sessions-loader";

const archiveBaseUrl =
  process.env.PUBLIC_ARCHIVE_BASEURL ||
  "https://archive.bermudatrianglesociety.com";

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
  loader: sessionsLoader({
    url: new URL("/api/v1/sessions", archiveBaseUrl).toString(),
  }),
  schema: z.object({
    archiveId: z.string().optional(),
    archiveSlug: z.string().optional(),
    title: z.string(),
    status: z.enum(["current", "upcoming", "past"]),
    date: z.date().nullable(),
    start: z.date().nullable(),
    startsAt: z.string().nullable().optional(),
    duration: z.number().nullable(),
    locationId: z.string().optional(),
    locationName: z.string().nullable().optional(),
    theme: z.string().nullable().optional(),
    themeTitle: z.string(),
    themeSummary: z.string(),
    signupLink: z.string().optional(),
    rsvpSlug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    starterList: z
      .array(
        z.object({
          title: z.string(),
          author: z.string(),
          format: z.array(z.string()).optional(),
          source: z.string().optional(),
          note: z.string().optional(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { locations, sessions };
