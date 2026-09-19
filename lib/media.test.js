import { describe, expect, test } from "bun:test";
import { twitterStatusUrl, youtubeEmbedUrl } from "./media.js";

describe("youtubeEmbedUrl", () => {
  test("parses watch, short, and youtu.be links", () => {
    expect(youtubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
    expect(youtubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
    expect(youtubeEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });

  test("rejects non-youtube urls", () => {
    expect(youtubeEmbedUrl("https://example.com/watch?v=dQw4w9WgXcQ")).toBe("");
  });
});

describe("twitterStatusUrl", () => {
  test("normalizes x and twitter status urls", () => {
    expect(twitterStatusUrl("https://twitter.com/jack/status/20")).toBe(
      "https://x.com/jack/status/20",
    );
    expect(twitterStatusUrl("https://x.com/jack/status/20?s=20")).toBe(
      "https://x.com/jack/status/20",
    );
  });

  test("rejects non-status urls", () => {
    expect(twitterStatusUrl("https://x.com/jack")).toBe("");
  });
});
