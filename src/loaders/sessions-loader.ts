import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";

type PublicSession = {
  id: string;
  slug: string;
  title: string;
  date: string | null;
  start: string | null;
  status: "draft" | "current" | "past";
  theme: string | null;
  themeTitle: string | null;
  themeSummary: string | null;
  body: string | null;
  durationMinutes: number | null;
  locationName: string | null;
  isPublic: boolean;
  rsvpSlug: string | null;
  astroPath: string | null;
  createdAt: string;
  updatedAt: string;
};

type Options = {
  url: string;
};

const fallbackLoader = glob({
  pattern: "**/*.mdx",
  base: "./src/content/sessions",
});

function publicRouteId(session: PublicSession) {
  const path = session.astroPath?.trim();
  if (!path) {
    return session.slug;
  }

  const withoutSlashes = path.replace(/^\/+|\/+$/g, "");
  const withoutSessionsPrefix = withoutSlashes.replace(/^sessions\//, "");

  return withoutSessionsPrefix || session.slug;
}

function locationIdFor(locationName: string | null) {
  if (!locationName) {
    return undefined;
  }

  return /bermuda national library/i.test(locationName) ? "bnl" : undefined;
}

function publicStatus(status: PublicSession["status"]) {
  return status === "draft" ? "upcoming" : status;
}

export function sessionsLoader({ url }: Options): Loader {
  return {
    name: "archive-sessions-loader",

    async load(context) {
      const { store, parseData, renderMarkdown, generateDigest, meta, logger } =
        context;
      const previousUrl = meta.get("url");
      const etag = previousUrl === url ? meta.get("etag") : undefined;

      let response: Response;

      try {
        response = await fetch(url, {
          headers: etag ? { "If-None-Match": etag } : {},
        });
      } catch (error) {
        logger.warn(
          `Failed to fetch Archive sessions; using local session files. ${error}`,
        );
        await fallbackLoader.load(context);
        return;
      }

      if (response.status === 304) {
        logger.info("Archive sessions unchanged");
        return;
      }

      if (!response.ok) {
        logger.warn(
          `Archive sessions returned ${response.status}; using local session files.`,
        );
        await fallbackLoader.load(context);
        return;
      }

      const sessions = (await response.json()) as PublicSession[];
      store.clear();

      for (const session of sessions.filter((item) => item.isPublic)) {
        const id = publicRouteId(session);
        const body = session.body ?? "";

        const rawData = {
          archiveId: session.id,
          archiveSlug: session.slug,
          title: session.title,
          status: publicStatus(session.status),
          date: session.date ? new Date(`${session.date}Z`) : null,
          start: session.start
            ? new Date(`2000-01-01T${session.start}Z`)
            : null,
          duration: session.durationMinutes,
          locationId: locationIdFor(session.locationName),
          locationName: session.locationName,
          theme: session.theme,
          themeTitle: session.themeTitle ?? session.title,
          themeSummary: session.themeSummary ?? "",
          signupLink: undefined,
          rsvpSlug: session.rsvpSlug,
          tags: [],
          starterList: undefined,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        };

        const data = await parseData({ id, data: rawData });
        const rendered = await renderMarkdown(body);

        store.set({
          id,
          data,
          body,
          rendered,
          digest: generateDigest({ ...data, body }),
        });
      }

      const nextEtag = response.headers.get("etag");
      if (nextEtag) {
        meta.set("etag", nextEtag);
      }
      meta.set("url", url);
    },
  };
}
