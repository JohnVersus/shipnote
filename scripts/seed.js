#!/usr/bin/env bun
/**
 * Seed demo testimonials into Vercel KV.
 * Requires KV_REST_API_URL and KV_REST_API_TOKEN in the environment
 * (e.g. from `vercel env pull` or a local .env).
 *
 * Usage: bun run seed
 *
 * Replaces the testimonials list in KV and pins a starter featured set.
 * Does not upload real short-video files (UploadThing) — seeds use image, YouTube, and X.
 */
import { seedDemoTestimonials } from "../lib/seed.js";

const result = await seedDemoTestimonials();
if (result.error) {
  console.error(result.error);
  process.exit(1);
}

console.log(`Seeded ${result.count} testimonials.`);
console.log(`Featured ${result.featured} for /embed.`);
