import Link from "next/link";
import { notFound } from "next/navigation";
import { getUpdate } from "../../../lib/updates.js";

export const dynamic = "force-dynamic";

export default async function UpdatePage({ params }) {
  const { id } = await params;
  const update = await getUpdate(id);
  if (!update) notFound();

  return (
    <main>
      <p>
        <Link href="/">Shipnote</Link>
      </p>
      <h1>{update.title}</h1>
      <p>{new Date(update.createdAt).toISOString()}</p>
      <p>{update.body}</p>
    </main>
  );
}
