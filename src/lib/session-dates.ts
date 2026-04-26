const BERMUDA_TIME_ZONE = "Atlantic/Bermuda";

type DateTimePart = "year" | "month" | "day" | "hour" | "minute";

function getBermudaParts(value: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BERMUDA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(value)
      .filter((part) =>
        ["year", "month", "day", "hour", "minute"].includes(part.type),
      )
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<DateTimePart, number>;

  return parts;
}

export function toDisplaySessionDates(startsAt: string | null) {
  if (!startsAt) {
    return { date: null, start: null };
  }

  const actualStart = new Date(startsAt);
  if (Number.isNaN(actualStart.getTime())) {
    return { date: null, start: null };
  }

  const parts = getBermudaParts(actualStart);

  return {
    date: new Date(Date.UTC(parts.year, parts.month - 1, parts.day)),
    start: new Date(
      Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
      ),
    ),
  };
}

export function formatSessionDate(date: Date | null) {
  if (!date) {
    return "Date TBA";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "utc",
  });
}

export function isPastSession(date: Date | null) {
  return date ? date < new Date() : false;
}
