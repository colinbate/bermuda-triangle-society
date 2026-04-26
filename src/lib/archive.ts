export const ARCHIVE_BASE_URL =
  import.meta.env.PUBLIC_ARCHIVE_BASEURL ||
  "https://archive.bermudatrianglesociety.com";

export function archiveApiUrl(path: string, baseUrl = ARCHIVE_BASE_URL) {
  return new URL(path, baseUrl).toString();
}
