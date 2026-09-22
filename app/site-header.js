import Link from "next/link";
import { listTestimonials } from "../lib/testimonials.js";

export default async function SiteHeader() {
  const items = await listTestimonials();
  const sampleId = items[0]?.id;

  return (
    <header className="bar">
      <Link className="mark" href="/">Shipnote</Link>
      <nav className="site-nav" aria-label="Judge links">
        <Link href="/">Wall</Link>
        <Link href="/submit">Submit</Link>
        <Link href="/embed">Embed</Link>
        {sampleId ? <Link href={`/q/${sampleId}`}>Sample</Link> : null}
        <Link className="site-nav-manage" href="/manage">Manage</Link>
      </nav>
    </header>
  );
}
