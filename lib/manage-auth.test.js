import { describe, expect, test } from "bun:test";
import {
  DEMO_MODE,
  expectedManageToken,
  isManageAuthenticated,
  manageTokenConfigured,
  tokensMatch,
} from "./manage-auth.js";

describe("manage-auth", () => {
  test("DEMO_MODE is active by default for hackathon judging", () => {
    expect(DEMO_MODE).toBe(true);
  });

  test("manageTokenConfigured returns true in demo mode", () => {
    expect(manageTokenConfigured()).toBe(true);
  });

  test("tokensMatch returns true in demo mode", () => {
    expect(tokensMatch("anything")).toBe(true);
    expect(tokensMatch("")).toBe(true);
  });

  test("isManageAuthenticated returns true in demo mode without cookie lookup", async () => {
    const authed = await isManageAuthenticated();
    expect(authed).toBe(true);
  });
});
