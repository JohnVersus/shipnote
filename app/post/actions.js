"use server";

import { redirect } from "next/navigation";
import { createUpdate } from "../../lib/updates.js";

export async function postUpdate(formData) {
  const result = await createUpdate({
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (result.error) return { error: result.error };
  redirect(`/u/${result.update.id}`);
}
