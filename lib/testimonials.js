const KEY = "shipnote:testimonials";
const MAX_ITEMS = 100;

export function createId() {
  return crypto.randomUUID();
}

export function validateTestimonial({ name, quote, detail }) {
  const cleanName = String(name ?? "").trim();
  const cleanQuote = String(quote ?? "").trim();
  const cleanDetail = String(detail ?? "").trim();

  if (!cleanName) return { error: "Name is required." };
  if (cleanName.length > 80) return { error: "Name must be 80 characters or fewer." };
  if (!cleanQuote) return { error: "Quote is required." };
  if (cleanQuote.length > 800) return { error: "Quote must be 800 characters or fewer." };
  if (cleanDetail.length > 80) return { error: "Detail must be 80 characters or fewer." };

  return { name: cleanName, quote: cleanQuote, detail: cleanDetail };
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

export async function createTestimonial(input) {
  const validated = validateTestimonial(input);
  if (validated.error) return validated;
  if (!kvConfigured()) return { error: "KV is not configured." };

  const item = {
    id: createId(),
    name: validated.name,
    quote: validated.quote,
    detail: validated.detail,
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
