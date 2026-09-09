import Link from "next/link";
import { listTestimonials } from "../../lib/testimonials.js";

export const dynamic = "force-dynamic";

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

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
              <Link href={`/q/${item.id}`}>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  <span className="avatar" aria-hidden="true">{initials(item.name)}</span>
                  <strong>{item.name}</strong>
                </footer>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
