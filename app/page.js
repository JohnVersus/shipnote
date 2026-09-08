import Link from "next/link";
import { listUpdates } from "../lib/updates.js";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function excerpt(body) {
  const text = String(body ?? "").trim();
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).trim()}…`;
}

export default async function Home() {
  const updates = await listUpdates();

  return (
    <main className="shell">
      <header className="top">
        <div>
          <Link className="brand" href="/">Shipnote</Link>
          <p className="lede">A public changelog. Post an update, then share the link.</p>
        </div>
        <Link className="button" href="/post">Post an update</Link>
      </header>
      {updates.length === 0 ? (
        <p className="empty">No updates yet.</p>
      ) : (
        <ul className="list">
          {updates.map((update) => (
            <li key={update.id}>
              <Link className="card" href={`/u/${update.id}`}>
                <span className="date">{formatDate(update.createdAt)}</span>
                <h2>{update.title}</h2>
                {update.body ? <p className="excerpt">{excerpt(update.body)}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
