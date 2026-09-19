export function youtubeEmbedUrl(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    let id = "";
    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (url.pathname.startsWith("/watch")) id = url.searchParams.get("v") || "";
      else if (url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] || "";
      else if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] || "";
      else if (url.pathname.startsWith("/live/")) id = url.pathname.split("/")[2] || "";
    }
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return "";
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return "";
  }
}

export function twitterStatusUrl(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "twitter.com" && host !== "x.com" && host !== "mobile.twitter.com") {
      return "";
    }
    const parts = url.pathname.split("/").filter(Boolean);
    const statusIndex = parts.findIndex((part) => part === "status");
    if (statusIndex < 0 || !parts[statusIndex + 1]) return "";
    const id = parts[statusIndex + 1].replace(/[^0-9]/g, "");
    const user = parts[0];
    if (!id || !user) return "";
    return `https://x.com/${user}/status/${id}`;
  } catch {
    return "";
  }
}
