import { describe, expect, test } from "bun:test";
import { EMBED_LAYOUTS } from "../app/embed-share.js";

describe("embed layouts", () => {
  test("defines all four layouts: masonry, stack, row, grid", () => {
    const ids = EMBED_LAYOUTS.map((l) => l.id);
    expect(ids).toContain("masonry");
    expect(ids).toContain("stack");
    expect(ids).toContain("row");
    expect(ids).toContain("grid");
  });

  test("masonry is the primary freestyle layout matching the landing page", () => {
    const masonry = EMBED_LAYOUTS.find((l) => l.id === "masonry");
    expect(masonry).toBeDefined();
    expect(masonry?.path).toBe("/embed?layout=masonry");
    expect(masonry?.label).toBe("Freestyle Wall");
  });

  test("row layout is configured for horizontal scrolling", () => {
    const row = EMBED_LAYOUTS.find((l) => l.id === "row");
    expect(row).toBeDefined();
    expect(row?.path).toBe("/embed?layout=row");
    expect(row?.height).toBe("270px");
  });

  test("stack layout is configured for vertical feed", () => {
    const stack = EMBED_LAYOUTS.find((l) => l.id === "stack");
    expect(stack).toBeDefined();
    expect(stack?.path).toBe("/embed?layout=stack");
    expect(stack?.maxWidth).toBe("380px");
  });
});
