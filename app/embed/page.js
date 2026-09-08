import Link from "next/link";
import { listUpdates } from "../../lib/updates.js";

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

export default async function EmbedPage() {
  const updates = await listUpdates();

  return (
    <main className="embed">
      <h1>Shipnote</h1>
      {updates.length === 0 ? (
        <p>No updates yet.</p>
      ) : (
        <ul>
          {updates.slice(0, 10).map((update) => (
            <li key={update.id}>
              <Link href={`/u/${update.id}`}>
                <span className="date">{formatDate(update.createdAt)}</span>
                {update.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
