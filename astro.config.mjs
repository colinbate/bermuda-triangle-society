// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://bermudatrianglesociety.com",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), svelte(), sitemap()],
});
