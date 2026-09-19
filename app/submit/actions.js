"use server";

import { redirect } from "next/navigation";
import { createTestimonial } from "../../lib/testimonials.js";

export async function submitTestimonial(formData) {
  const result = await createTestimonial({
    name: formData.get("name"),
    quote: formData.get("quote"),
    detail: formData.get("detail"),
    imageUrl: formData.get("imageUrl"),
    videoUrl: formData.get("videoUrl"),
    youtubeUrl: formData.get("youtubeUrl"),
    twitterUrl: formData.get("twitterUrl"),
  });

  if (result.error) {
    redirect(`/submit?error=${encodeURIComponent(result.error)}`);
  }

  redirect(`/q/${result.item.id}`);
}
