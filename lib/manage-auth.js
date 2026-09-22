export const MANAGE_COOKIE = "shipnote_manage";

// Set DEMO_MODE to true to disable password gating for hackathon judging.
// Change to false to re-enable token protection via MANAGE_TOKEN.
export const DEMO_MODE = true;

export function manageTokenConfigured() {
  if (DEMO_MODE) return true;
  return Boolean(String(process.env.MANAGE_TOKEN || "").trim());
}

export function expectedManageToken() {
  return String(process.env.MANAGE_TOKEN || "").trim();
}

export function tokensMatch(provided) {
  if (DEMO_MODE) return true;
  const expected = expectedManageToken();
  if (!expected) return false;
  return String(provided || "") === expected;
}

export async function isManageAuthenticated() {
  if (DEMO_MODE) return true;
  if (!manageTokenConfigured()) return false;
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  return tokensMatch(jar.get(MANAGE_COOKIE)?.value);
}
