import { describe, expect, test } from "bun:test";
import { parseUpdates, validateUpdate } from "./updates.js";

describe("validateUpdate", () => {
  test("accepts a title and body", () => {
    expect(validateUpdate({ title: " Shipped ", body: " Notes " })).toEqual({
      title: "Shipped",
      body: "Notes",
    });
  });

  test("rejects an empty title", () => {
    expect(validateUpdate({ title: "  ", body: "Notes" }).error).toBe("Title is required.");
  });

  test("rejects an empty body", () => {
    expect(validateUpdate({ title: "Shipped", body: "" }).error).toBe("Body is required.");
  });
});

describe("parseUpdates", () => {
  test("returns an empty list for missing or bad data", () => {
    expect(parseUpdates(null)).toEqual([]);
    expect(parseUpdates("not-json")).toEqual([]);
  });

  test("keeps stored updates that have an id and title", () => {
    const raw = JSON.stringify([
      { id: "a", title: "One", body: "First" },
      { title: "No id" },
    ]);
    expect(parseUpdates(raw)).toEqual([{ id: "a", title: "One", body: "First" }]);
  });
});
