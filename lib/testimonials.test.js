import { describe, expect, test } from "bun:test";
import { parseTestimonials, validateTestimonial } from "./testimonials.js";

describe("validateTestimonial", () => {
  test("accepts a name and quote", () => {
    expect(validateTestimonial({ name: " Ada ", quote: " It works " })).toEqual({
      name: "Ada",
      quote: "It works",
      detail: "",
    });
  });

  test("rejects an empty name", () => {
    expect(validateTestimonial({ name: " ", quote: "Yes" }).error).toBe("Name is required.");
  });

  test("rejects an empty quote", () => {
    expect(validateTestimonial({ name: "Ada", quote: "" }).error).toBe("Quote is required.");
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
