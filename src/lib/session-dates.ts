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
