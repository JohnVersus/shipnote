"use server";

import { redirect } from "next/navigation";
import { createTestimonial } from "../../lib/testimonials.js";

export async function submitTestimonial(formData) {
  const result = await createTestimonial({
    name: formData.get("name"),
    quote: formData.get("quote"),
    detail: formData.get("detail"),
  });

  if (result.error) {
    redirect(`/submit?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/");
}
