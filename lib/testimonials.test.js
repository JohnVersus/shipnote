import { describe, expect, test } from "bun:test";
import {
  buildEmbedList,
  EMBED_LIMIT,
  normalizeFeaturedIds,
  parseFeaturedIds,
  parseTestimonials,
  validateTestimonial,
} from "./testimonials.js";

describe("validateTestimonial", () => {
  test("accepts a name and quote", () => {
    expect(validateTestimonial({ name: " Ada ", quote: " It works " })).toEqual({
      name: "Ada",
      quote: "It works",
      detail: "",
      imageUrl: "",
      videoUrl: "",
      youtubeUrl: "",
      twitterUrl: "",
    });
  });

  test("accepts optional https media and social urls", () => {
    expect(
      validateTestimonial({
        name: "Ada",
        quote: "Yes",
        imageUrl: "https://example.com/a.jpg",
        videoUrl: "https://example.com/a.mp4",
        youtubeUrl: "https://youtu.be/dQw4w9WgXcQ",
        twitterUrl: "https://twitter.com/jack/status/20",
      }),
    ).toEqual({
      name: "Ada",
      quote: "Yes",
      detail: "",
      imageUrl: "https://example.com/a.jpg",
      videoUrl: "https://example.com/a.mp4",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      twitterUrl: "https://x.com/jack/status/20",
    });
  });

  test("rejects an empty name", () => {
    expect(validateTestimonial({ name: " ", quote: "Yes" }).error).toBe("Name is required.");
  });

  test("rejects an empty quote", () => {
    expect(validateTestimonial({ name: "Ada", quote: "" }).error).toBe("Quote is required.");
  });

  test("rejects a non-https image", () => {
    expect(
      validateTestimonial({
        name: "Ada",
        quote: "Yes",
        imageUrl: "http://example.com/a.jpg",
      }).error,
    ).toBe("Image must be an https URL.");
  });

  test("rejects a bad youtube url", () => {
    expect(
      validateTestimonial({
        name: "Ada",
        quote: "Yes",
        youtubeUrl: "https://example.com/watch?v=nope",
      }).error,
    ).toBe("YouTube URL must be a public watch, short, or youtu.be link.");
  });

  test("rejects a bad twitter url", () => {
    expect(
      validateTestimonial({
        name: "Ada",
        quote: "Yes",
        twitterUrl: "https://x.com/jack",
      }).error,
    ).toBe("X or Twitter URL must be a public post link.");
  });
});

describe("parseTestimonials", () => {
  test("returns an empty list for missing or bad data", () => {
    expect(parseTestimonials(null)).toEqual([]);
    expect(parseTestimonials("nope")).toEqual([]);
  });

  test("keeps items with an id, name, and quote", () => {
    const raw = JSON.stringify([
      { id: "a", name: "Ada", quote: "Yes" },
      { name: "No id", quote: "No" },
    ]);
    expect(parseTestimonials(raw)).toEqual([{ id: "a", name: "Ada", quote: "Yes" }]);
  });
});

describe("parseFeaturedIds", () => {
  test("returns empty for missing or bad data", () => {
    expect(parseFeaturedIds(null)).toEqual([]);
    expect(parseFeaturedIds("nope")).toEqual([]);
  });

  test("dedupes and caps at embed limit", () => {
    const ids = Array.from({ length: 15 }, (_, i) => `id-${i}`);
    ids.splice(2, 0, "id-1");
    expect(parseFeaturedIds(JSON.stringify(ids))).toEqual(
      Array.from({ length: EMBED_LIMIT }, (_, i) => `id-${i}`),
    );
  });
});

describe("buildEmbedList", () => {
  const items = [
    { id: "n1", name: "New", quote: "newest" },
    { id: "n2", name: "Also", quote: "second" },
    { id: "a", name: "Ada", quote: "Yes" },
    { id: "b", name: "Bea", quote: "Yep" },
  ];

  test("puts featured first then fills with newest", () => {
    expect(buildEmbedList(items, ["b", "a"], 3).map((i) => i.id)).toEqual(["b", "a", "n1"]);
  });

  test("skips missing featured ids", () => {
    expect(buildEmbedList(items, ["missing", "a"], 2).map((i) => i.id)).toEqual(["a", "n1"]);
  });

  test("returns up to ten items", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      id: `i${i}`,
      name: "N",
      quote: "Q",
    }));
    expect(buildEmbedList(many, ["i5", "i3"], EMBED_LIMIT)).toHaveLength(10);
    expect(buildEmbedList(many, ["i5", "i3"], EMBED_LIMIT).map((i) => i.id).slice(0, 2)).toEqual([
      "i5",
      "i3",
    ]);
  });
});

describe("normalizeFeaturedIds", () => {
  test("keeps only known unique ids up to the limit", () => {
    expect(normalizeFeaturedIds(["a", "x", "a", "b"], ["a", "b", "c"])).toEqual(["a", "b"]);
  });
});
