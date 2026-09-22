import Link from "next/link";
import { listEmbedTestimonials } from "../../lib/testimonials.js";
import { TwitterEmbed, YoutubeEmbed } from "../media-embeds.js";

export const dynamic = "force-dynamic";

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default async function EmbedPage({ searchParams }) {
  const params = await searchParams;
  const rawLayout = String(params?.layout || "stack").toLowerCase();
  const validLayouts = ["stack", "masonry", "row", "grid"];
  const layout = validLayouts.includes(rawLayout) ? rawLayout : "stack";

  const items = await listEmbedTestimonials();

  const layoutLabels = {
    stack: "Feed",
    masonry: "Wall",
    row: "Strip",
    grid: "Grid",
  };

  return (
    <main className={`widget widget-${layout}`} data-layout={layout}>
      <header>
        <span>Shipnote · {layoutLabels[layout] || "Feed"}</span>
        <Link href="/">Wall</Link>
      </header>
      {items.length === 0 ? (
        <p className="widget-empty">No testimonials yet.</p>
      ) : (
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/q/${item.id}`}>
                <blockquote>{item.quote}</blockquote>
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
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
