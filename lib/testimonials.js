import { twitterStatusUrl, youtubeEmbedUrl } from "./media.js";

const KEY = "shipnote:testimonials";
const FEATURED_KEY = "shipnote:featuredIds";
const MAX_ITEMS = 100;
export const EMBED_LIMIT = 10;

export function createId() {
  return crypto.randomUUID();
}

function cleanOptionalUrl(value, label) {
  const url = String(value ?? "").trim();
  if (!url) return { url: "" };
  if (!/^https:\/\//i.test(url)) return { error: `${label} must be an https URL.` };
  if (url.length > 500) return { error: `${label} is too long.` };
  return { url };
}

export function validateTestimonial({
  name,
  quote,
  detail,
  imageUrl,
  videoUrl,
  youtubeUrl,
  twitterUrl,
}) {
  const cleanName = String(name ?? "").trim();
  const cleanQuote = String(quote ?? "").trim();
  const cleanDetail = String(detail ?? "").trim();
  const image = cleanOptionalUrl(imageUrl, "Image");
  const video = cleanOptionalUrl(videoUrl, "Video");
  const youtubeRaw = String(youtubeUrl ?? "").trim();
  const twitterRaw = String(twitterUrl ?? "").trim();
  const youtube = youtubeRaw ? youtubeEmbedUrl(youtubeRaw) : "";
  const twitter = twitterRaw ? twitterStatusUrl(twitterRaw) : "";

  if (!cleanName) return { error: "Name is required." };
  if (cleanName.length > 80) return { error: "Name must be 80 characters or fewer." };
  if (!cleanQuote) return { error: "Quote is required." };
  if (cleanQuote.length > 800) return { error: "Quote must be 800 characters or fewer." };
  if (cleanDetail.length > 80) return { error: "Detail must be 80 characters or fewer." };
  if (image.error) return { error: image.error };
  if (video.error) return { error: video.error };
  if (youtubeRaw && !youtube) {
    return { error: "YouTube URL must be a public watch, short, or youtu.be link." };
  }
  if (twitterRaw && !twitter) {
    return { error: "X or Twitter URL must be a public post link." };
  }

  return {
    name: cleanName,
    quote: cleanQuote,
    detail: cleanDetail,
    imageUrl: image.url,
    videoUrl: video.url,
    youtubeUrl: youtube,
    twitterUrl: twitter,
  };
}

export function parseTestimonials(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.id && item.name && item.quote);
  } catch {
    return [];
  }
}

export function parseFeaturedIds(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set();
    const ids = [];
    for (const value of parsed) {
      const id = String(value ?? "").trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      ids.push(id);
      if (ids.length >= EMBED_LIMIT) break;
    }
    return ids;
  } catch {
    return [];
  }
}

/** Featured first (in stored order), then newest non-featured, up to limit. */
export function buildEmbedList(items, featuredIds, limit = EMBED_LIMIT) {
  const list = Array.isArray(items) ? items : [];
  const byId = new Map(list.map((item) => [item.id, item]));
  const featured = [];
  const featuredSet = new Set();
  for (const id of featuredIds || []) {
    const item = byId.get(id);
    if (!item || featuredSet.has(id)) continue;
    featured.push(item);
    featuredSet.add(id);
    if (featured.length >= limit) return featured;
  }
  const fillers = list.filter((item) => !featuredSet.has(item.id));
  return [...featured, ...fillers].slice(0, limit);
}

export function normalizeFeaturedIds(ids, knownIds) {
  const known = new Set(knownIds || []);
  const seen = new Set();
  const next = [];
  for (const value of ids || []) {
    const id = String(value ?? "").trim();
    if (!id || seen.has(id) || !known.has(id)) continue;
    seen.add(id);
    next.push(id);
    if (next.length >= EMBED_LIMIT) break;
  }
  return next;
}

export function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kv(command) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("KV is not configured.");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`KV request failed (${response.status}).`);
  const data = await response.json();
  if (data.error) throw new Error(String(data.error));
  return data.result;
}

export async function listTestimonials() {
  if (!kvConfigured()) return [];
  const raw = await kv(["GET", KEY]);
  return parseTestimonials(raw);
}

export async function saveTestimonials(items) {
  if (!kvConfigured()) throw new Error("KV is not configured.");
  const next = (Array.isArray(items) ? items : []).slice(0, MAX_ITEMS);
  await kv(["SET", KEY, JSON.stringify(next)]);
  return next;
}

export async function getFeaturedIds() {
  if (!kvConfigured()) return [];
  const raw = await kv(["GET", FEATURED_KEY]);
  return parseFeaturedIds(raw);
}

export async function setFeaturedIds(ids) {
  if (!kvConfigured()) return { error: "KV is not configured." };
  const items = await listTestimonials();
  const next = normalizeFeaturedIds(ids, items.map((item) => item.id));
  await kv(["SET", FEATURED_KEY, JSON.stringify(next)]);
  return { ids: next };
}

export async function listEmbedTestimonials() {
  const [items, featuredIds] = await Promise.all([listTestimonials(), getFeaturedIds()]);
  return buildEmbedList(items, featuredIds, EMBED_LIMIT);
}

export async function createTestimonial(input) {
  const validated = validateTestimonial(input);
  if (validated.error) return validated;
  if (!kvConfigured()) return { error: "KV is not configured." };

  const item = {
    id: createId(),
    name: validated.name,
    quote: validated.quote,
    detail: validated.detail,
    imageUrl: validated.imageUrl || undefined,
    videoUrl: validated.videoUrl || undefined,
    youtubeUrl: validated.youtubeUrl || undefined,
    twitterUrl: validated.twitterUrl || undefined,
    createdAt: new Date().toISOString(),
  };

  const items = await listTestimonials();
  const next = [item, ...items].slice(0, MAX_ITEMS);
  await kv(["SET", KEY, JSON.stringify(next)]);
  return { item };
}

export async function getTestimonial(id) {
  const items = await listTestimonials();
  return items.find((item) => item.id === id) ?? null;
}
