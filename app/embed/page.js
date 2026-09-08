import Link from "next/link";
import { listUpdates } from "../../lib/updates.js";

export const dynamic = "force-dynamic";

export default async function EmbedPage() {
  const updates = await listUpdates();

  return (
    <main>
      <h1>Shipnote</h1>
      {updates.length === 0 ? (
        <p>No updates yet.</p>
      ) : (
        <ul>
          {updates.slice(0, 10).map((update) => (
            <li key={update.id}>
              <Link href={`/u/${update.id}`}>{update.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
