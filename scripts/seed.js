#!/usr/bin/env bun
/**
 * Seed demo testimonials into Vercel KV.
 * Requires KV_REST_API_URL and KV_REST_API_TOKEN in the environment
 * (e.g. from `vercel env pull` or a local .env).
 *
 * Usage: bun run seed
 */
import {
  createId,
  kvConfigured,
  saveTestimonials,
  setFeaturedIds,
  validateTestimonial,
} from "../lib/testimonials.js";

const seeds = [
  {
    name: "Maya Chen",
    detail: "Founder, Northline",
    quote: "We swapped a bloated testimonial tool for Shipnote in an afternoon. The wall just works.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
  },
  {
    name: "Jordan Blake",
    detail: "Indie hacker",
    quote: "No login wall. Customers drop a quote, I paste the iframe. That is the whole product.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    name: "Priya Nair",
    detail: "Head of Growth",
    quote: "Our launch page went from empty social proof to a living wall overnight.",
  },
  {
    name: "Chris Ortega",
    detail: "Designer",
    quote: "The embed looks intentional on a marketing site — not like a leftover widget.",
    twitterUrl: "https://x.com/jack/status/20",
  },
  {
    name: "Sam Okonkwo",
    detail: "Solo founder",
    quote: "I needed quotes with optional video. Shipnote took the YouTube link and moved on.",
    youtubeUrl: "https://youtu.be/jNQXAC9IVRw",
  },
  {
    name: "Elena Rossi",
    detail: "PM, Harbor",
    quote: "Pinning the best three for the embed without changing the iframe snippet is exactly right.",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
  },
  {
    name: "Nate Feldman",
    detail: "Consultant",
    quote: "Clients send me a public link. I do not babysit accounts or seats.",
  },
  {
    name: "Aisha Rahman",
    detail: "Maker",
    quote: "Warm wall, sharp quote page, embed that does not fight my CSS. Rare combo.",
  },
  {
    name: "Leo Park",
    detail: "Engineer",
    quote: "KV plus a free upload slot is enough. I did not want another SaaS invoice.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  {
    name: "Hannah Brooks",
    detail: "Marketer",
    quote: "We keep the iframe forever and curate featured quotes from /manage.",
  },
  {
    name: "Omar Diaz",
    detail: "Agency lead",
    quote: "Shipnote is the first testimonial wall I can hand a client without a training doc.",
  },
  {
    name: "Riley Quinn",
    detail: "Builder",
    quote: "Quote and name required. Everything else optional. That constraint is a feature.",
    twitterUrl: "https://twitter.com/Twitter/status/20",
  },
];

if (!kvConfigured()) {
  console.error("KV is not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN.");
  process.exit(1);
}

const now = Date.now();
const items = [];
for (let i = 0; i < seeds.length; i++) {
  const seed = seeds[i];
  const validated = validateTestimonial(seed);
  if (validated.error) {
    console.error(`Seed ${i} invalid:`, validated.error);
    process.exit(1);
  }
  items.push({
    id: createId(),
    name: validated.name,
    quote: validated.quote,
    detail: validated.detail,
    imageUrl: validated.imageUrl || undefined,
    videoUrl: validated.videoUrl || undefined,
    youtubeUrl: validated.youtubeUrl || undefined,
    twitterUrl: validated.twitterUrl || undefined,
    createdAt: new Date(now - i * 60_000).toISOString(),
  });
}

await saveTestimonials(items);
// Pin a varied subset so /embed is curated out of the box.
const featured = [items[1].id, items[3].id, items[5].id, items[0].id];
const result = await setFeaturedIds(featured);
if (result.error) {
  console.error(result.error);
  process.exit(1);
}

console.log(`Seeded ${items.length} testimonials.`);
console.log(`Featured ${result.ids.length} for /embed.`);
