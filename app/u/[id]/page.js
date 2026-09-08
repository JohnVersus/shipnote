import Link from "next/link";
import { notFound } from "next/navigation";
import { getUpdate } from "../../../lib/updates.js";

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

export default async function UpdatePage({ params }) {
  const { id } = await params;
  const update = await getUpdate(id);
  if (!update) notFound();

  return (
    <main className="shell">
      <header className="top">
        <div>
          <Link className="brand" href="/">Shipnote</Link>
        </div>
      </header>
      <article className="note card">
        <span className="date">{formatDate(update.createdAt)}</span>
        <h1>{update.title}</h1>
        <p className="body">{update.body}</p>
      </article>
    </main>
  );
}
