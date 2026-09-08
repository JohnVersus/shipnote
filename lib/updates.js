const KEY = "shipnote:updates";
const MAX_UPDATES = 100;

export function createId() {
  return crypto.randomUUID();
}

export function validateUpdate({ title, body }) {
  const cleanTitle = String(title ?? "").trim();
  const cleanBody = String(body ?? "").trim();

  if (!cleanTitle) return { error: "Title is required." };
  if (cleanTitle.length > 120) return { error: "Title must be 120 characters or fewer." };
  if (!cleanBody) return { error: "Body is required." };
  if (cleanBody.length > 4000) return { error: "Body must be 4000 characters or fewer." };

  return { title: cleanTitle, body: cleanBody };
}

export function parseUpdates(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.id && item.title);
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
  if (!url || !token) {
    throw new Error("KV is not configured.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`KV request failed (${response.status}).`);
  }

  const data = await response.json();
  if (data.error) throw new Error(String(data.error));
  return data.result;
}

export async function listUpdates() {
  if (!kvConfigured()) return [];
  const raw = await kv(["GET", KEY]);
  return parseUpdates(raw);
}

export async function getUpdate(id) {
  const updates = await listUpdates();
  return updates.find((item) => item.id === id) ?? null;
}

export async function createUpdate(input) {
  const validated = validateUpdate(input);
  if (validated.error) return validated;
  if (!kvConfigured()) return { error: "KV is not configured." };

  const update = {
    id: createId(),
    title: validated.title,
    body: validated.body,
    createdAt: new Date().toISOString(),
  };

  const updates = await listUpdates();
  const next = [update, ...updates].slice(0, MAX_UPDATES);
  await kv(["SET", KEY, JSON.stringify(next)]);
  return { update };
}
