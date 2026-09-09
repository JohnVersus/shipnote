import Link from "next/link";
import CopyPath from "./copy-path.js";
import { listTestimonials } from "../lib/testimonials.js";

export const dynamic = "force-dynamic";

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default async function Home() {
  const items = await listTestimonials();

  return (
    <main>
      <header className="bar">
        <Link className="mark" href="/">Shipnote</Link>
        <Link className="button" href="/submit">Add a testimonial</Link>
      </header>

      <section className="hero">
        <p className="kicker">Public wall</p>
        <h1>What people actually said.</h1>
        <p className="lede">No account. A quote goes on this wall, and the same quotes sit in the embed.</p>
        <CopyPath path="/embed" label="Embed" />
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <p>No testimonials yet.</p>
          <Link className="button" href="/submit">Add a testimonial</Link>
        </section>
      ) : (
        <section className="wall">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <Link className="card-link" href={`/q/${item.id}`}>
                <span className="quote-mark" aria-hidden="true">“</span>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  <span className="avatar" aria-hidden="true">{initials(item.name)}</span>
                  <span>
                    <strong>{item.name}</strong>
                    {item.detail ? <em>{item.detail}</em> : null}
                  </span>
                </footer>
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
