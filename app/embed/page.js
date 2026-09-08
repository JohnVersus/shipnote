import Link from "next/link";
import { listTestimonials } from "../../lib/testimonials.js";

export const dynamic = "force-dynamic";

export default async function EmbedPage() {
  const items = await listTestimonials();

  return (
    <main className="widget">
      <header>
        <span>Shipnote</span>
        <Link href="/">Wall</Link>
      </header>
      {items.length === 0 ? (
        <p className="widget-empty">No testimonials yet.</p>
      ) : (
        <ol>
          {items.slice(0, 8).map((item) => (
            <li key={item.id}>
              <blockquote>{item.quote}</blockquote>
              <strong>{item.name}</strong>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
