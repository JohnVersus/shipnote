import Link from "next/link";
import { listTestimonials } from "../lib/testimonials.js";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await listTestimonials();

  return (
    <main className="shell">
      <header className="mast">
        <div>
          <p className="kicker">Testimonials</p>
          <Link className="wordmark" href="/">Shipnote</Link>
          <p className="lede">Collect a testimonial. Show the wall. Embed it.</p>
        </div>
        <Link className="button" href="/submit">Add a testimonial</Link>
      </header>

      {items.length === 0 ? (
        <section className="empty-state">
          <p>No testimonials yet.</p>
          <Link className="button" href="/submit">Add a testimonial</Link>
        </section>
      ) : (
        <section className="wall">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <blockquote>{item.quote}</blockquote>
              <footer>
                <strong>{item.name}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
