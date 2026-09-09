import Link from "next/link";
import { notFound } from "next/navigation";
import CopyPath from "../../copy-path.js";
import { getTestimonial } from "../../../lib/testimonials.js";

export const dynamic = "force-dynamic";

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default async function QuotePage({ params }) {
  const { id } = await params;
  const item = await getTestimonial(id);
  if (!item) notFound();

  return (
    <main>
      <header className="bar">
        <Link className="mark" href="/">Shipnote</Link>
        <Link className="text-link" href="/">Wall</Link>
      </header>
      <article className="composer quote-page">
        <p className="kicker">Testimonial</p>
        <blockquote>{item.quote}</blockquote>
        <footer className="who-line">
          <span className="avatar" aria-hidden="true">{initials(item.name)}</span>
          <span>
            <strong>{item.name}</strong>
            {item.detail ? <em>{item.detail}</em> : null}
          </span>
        </footer>
        <CopyPath path={`/q/${item.id}`} label="Public link" />
      </article>
    </main>
  );
}
