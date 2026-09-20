import { cookies } from "next/headers";

export const MANAGE_COOKIE = "shipnote_manage";

export function manageTokenConfigured() {
  return Boolean(String(process.env.MANAGE_TOKEN || "").trim());
}

export function expectedManageToken() {
  return String(process.env.MANAGE_TOKEN || "").trim();
}

export function tokensMatch(provided) {
  const expected = expectedManageToken();
  if (!expected) return false;
  return String(provided || "") === expected;
}

export async function isManageAuthenticated() {
  if (!manageTokenConfigured()) return false;
  const jar = await cookies();
  return tokensMatch(jar.get(MANAGE_COOKIE)?.value);
}
