import { createEvents } from "ics";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const prerender = true;

export async function getStaticPaths() {
  const sessions = await getCollection("sessions");
  return sessions
    .filter(
      (session) =>
        session.data.date &&
        session.data.start &&
        session.data.duration !== null,
    )
    .map((session) => ({
      params: { id: session.id },
      props: { session },
    }));
}

export const GET = (({ params, props }) => {
  const id = params.id;
  const session = props.session.data as CollectionEntry<"sessions">["data"];
  if (!session.date || !session.start || session.duration === null) {
    return new Response("Calendar file unavailable for this session.", {
      status: 404,
    });
  }

  const { error, value } = createEvents([
    {
      title: "Bermuda Triangle Society Meeting",
      start: [
        session.date.getUTCFullYear(),
        session.date.getUTCMonth() + 1,
        session.date.getUTCDate(),
        session.start.getUTCHours(),
        session.start.getUTCMinutes(),
      ],
      duration: { minutes: session.duration },
      description: `Theme: ${session.themeTitle}`,
      location: "Bermuda National Library",
      url: `https://bermudatrianglesociety.com/sessions/${id}`,
      organizer: {
        name: "Colin",
        email: "archivist@bermudatrianglesociety.com",
      },
    },
  ]);

  if (error || !value) {
    return new Response("Failed to generate calendar file.", { status: 500 });
  }

  return new Response(value, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="bermuda-triangle-society-${id}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}) satisfies APIRoute;
