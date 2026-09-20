import { describe, expect, test } from "bun:test";
import { SEED_FEATURED_INDEXES, SEED_TESTIMONIALS, buildSeedItems } from "./seed.js";

describe("buildSeedItems", () => {
  test("builds twelve valid items covering image, youtube, and x", () => {
    const { items, error } = buildSeedItems(1_700_000_000_000);
    expect(error).toBeUndefined();
    expect(items).toHaveLength(12);
    expect(items.some((item) => item.imageUrl)).toBe(true);
    expect(items.some((item) => item.youtubeUrl)).toBe(true);
    expect(items.some((item) => item.twitterUrl)).toBe(true);
    expect(items.every((item) => !item.videoUrl)).toBe(true);
    expect(SEED_FEATURED_INDEXES.every((i) => i >= 0 && i < SEED_TESTIMONIALS.length)).toBe(true);
    expect(items[0].createdAt).toBe(new Date(1_700_000_000_000).toISOString());
  });
});
