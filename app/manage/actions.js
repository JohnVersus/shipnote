"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { seedDemoTestimonials } from "../../lib/seed.js";
import {
  getFeaturedIds,
  listTestimonials,
  setFeaturedIds,
} from "../../lib/testimonials.js";
import {
  DEMO_MODE,
  isManageAuthenticated,
  MANAGE_COOKIE,
  manageTokenConfigured,
  tokensMatch,
} from "../../lib/manage-auth.js";

async function requireManage() {
  if (DEMO_MODE) return { ok: true };
  if (!manageTokenConfigured()) {
    return { error: "MANAGE_TOKEN is not set on the host." };
  }
  if (!(await isManageAuthenticated())) {
    return { error: "Sign in with MANAGE_TOKEN first." };
  }
  return { ok: true };
}

export async function unlockManage(formData) {
  if (!manageTokenConfigured()) {
    redirect("/manage?error=" + encodeURIComponent("Set MANAGE_TOKEN on the host first."));
  }
  const token = String(formData.get("token") || "");
  if (!tokensMatch(token)) {
    redirect("/manage?error=" + encodeURIComponent("Wrong token."));
  }
  const jar = await cookies();
  jar.set(MANAGE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/manage");
}

export async function lockManage() {
  const jar = await cookies();
  jar.delete(MANAGE_COOKIE);
  redirect("/manage");
}

export async function pinTestimonial(formData) {
  const gate = await requireManage();
  if (gate.error) redirect(`/manage?error=${encodeURIComponent(gate.error)}`);
  const id = String(formData.get("id") || "");
  const featured = await getFeaturedIds();
  if (!featured.includes(id)) {
    await setFeaturedIds([...featured, id]);
  }
  redirect("/manage");
}

export async function unpinTestimonial(formData) {
  const gate = await requireManage();
  if (gate.error) redirect(`/manage?error=${encodeURIComponent(gate.error)}`);
  const id = String(formData.get("id") || "");
  const featured = await getFeaturedIds();
  await setFeaturedIds(featured.filter((value) => value !== id));
  redirect("/manage");
}

export async function moveFeatured(formData) {
  const gate = await requireManage();
  if (gate.error) redirect(`/manage?error=${encodeURIComponent(gate.error)}`);
  const id = String(formData.get("id") || "");
  const direction = String(formData.get("direction") || "");
  const featured = await getFeaturedIds();
  const index = featured.indexOf(id);
  if (index < 0) redirect("/manage");
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= featured.length) redirect("/manage");
  const next = featured.slice();
  [next[index], next[swapWith]] = [next[swapWith], next[index]];
  await setFeaturedIds(next);
  redirect("/manage");
}

export async function seedManageDemo() {
  const gate = await requireManage();
  if (gate.error) redirect(`/manage?error=${encodeURIComponent(gate.error)}`);
  const result = await seedDemoTestimonials();
  if (result.error) {
    redirect(`/manage?error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/manage?seeded=${result.count}`);
}

