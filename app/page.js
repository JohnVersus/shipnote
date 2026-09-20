import Link from "next/link";
import EmbedShare from "./embed-share.js";
import { listTestimonials } from "../lib/testimonials.js";
import { TwitterEmbed, YoutubeEmbed } from "./media-embeds.js";

export const dynamic = "force-dynamic";

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function mediaChips(item) {
  const chips = [];
  if (item.imageUrl) chips.push({ key: "img", label: "Image", className: "media-chip" });
  if (item.videoUrl) chips.push({ key: "vid", label: "Video", className: "media-chip vid" });
  if (item.youtubeUrl) chips.push({ key: "yt", label: "YouTube", className: "media-chip yt" });
  if (item.twitterUrl) chips.push({ key: "x", label: "X", className: "media-chip x" });
  return chips;
}

export default async function Home() {
  const items = await listTestimonials();
  const withMedia = items.filter(
    (item) => item.imageUrl || item.videoUrl || item.youtubeUrl || item.twitterUrl,
  ).length;

  return (
    <main>
      <header className="bar">
        <Link className="mark" href="/">Shipnote</Link>
        <Link className="button" href="/submit">Add a testimonial</Link>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Public wall</p>
          <h1>What people actually said.</h1>
          <p className="lede">
            No account. A quote goes on this wall, and the same quotes sit in the embed.
          </p>
        </div>
        <aside className="hero-aside" aria-label="Wall snapshot">
          <div className="stat">
            <strong>{items.length}</strong>
            <em>on the wall</em>
          </div>
          <div className="stat">
            <strong>{withMedia}</strong>
            <em>with media</em>
          </div>
          <div className="stat">
            <strong>10</strong>
            <em>max in embed</em>
          </div>
        </aside>
        <EmbedShare path="/embed" />
      </section>

      {items.length === 0 ? (
        <section className="empty-state">
          <p>No testimonials yet.</p>
          <Link className="button" href="/submit">Add a testimonial</Link>
        </section>
      ) : (
        <section className="wall" aria-label="Testimonials">
          {items.map((item) => {
            const chips = mediaChips(item);
            return (
              <article className="card" key={item.id}>
                <Link className="card-link" href={`/q/${item.id}`}>
                  <span className="quote-mark" aria-hidden="true">“</span>
                  <blockquote>{item.quote}</blockquote>
                  {chips.length > 0 ? (
                    <div className="media-chips" aria-label="Attached media">
                      {chips.map((chip) => (
                        <span className={chip.className} key={chip.key}>{chip.label}</span>
                      ))}
                    </div>
                  ) : null}
                  {item.imageUrl ? (
                    <img className="media-image" src={item.imageUrl} alt="" />
                  ) : null}
                  {item.videoUrl ? (
                    <video className="media-video" src={item.videoUrl} controls playsInline preload="metadata" />
                  ) : null}
                  <YoutubeEmbed url={item.youtubeUrl} />
                  <TwitterEmbed url={item.twitterUrl} />
                  <footer>
                    <span className="avatar" aria-hidden="true">{initials(item.name)}</span>
                    <span>
                      <strong>{item.name}</strong>
                      {item.detail ? <em>{item.detail}</em> : null}
                    </span>
                  </footer>
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
