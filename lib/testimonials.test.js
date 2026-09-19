import { describe, expect, test } from "bun:test";
import { parseTestimonials, validateTestimonial } from "./testimonials.js";

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
