import Link from "next/link";
import { submitTestimonial } from "./actions.js";

export const dynamic = "force-dynamic";

export default async function SubmitPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : "";

  return (
    <main className="shell">
      <header className="mast compact">
        <div>
          <p className="kicker">Testimonials</p>
          <Link className="wordmark" href="/">Shipnote</Link>
        </div>
      </header>

      <form className="composer" action={submitTestimonial}>
        <p className="composer-hint">No account. This goes on the public wall.</p>
        <label className="sr" htmlFor="quote">Quote</label>
        <textarea
          id="quote"
          name="quote"
          required
          rows={8}
          maxLength={800}
          placeholder="What would you tell someone who hasn’t tried it?"
        />
        <div className="who">
          <label className="sr" htmlFor="name">Name</label>
          <input id="name" name="name" required maxLength={80} placeholder="Name" />
          <label className="sr" htmlFor="detail">Detail</label>
          <input id="detail" name="detail" maxLength={80} placeholder="Role, optional" />
        </div>
        <div className="composer-bar">
          <span>Quote and name. Nothing else.</span>
          <button type="submit">Add a testimonial</button>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </form>
    </main>
  );
}
