import Link from "next/link";
import SubmitForm from "./submit-form.js";

export const dynamic = "force-dynamic";

export default async function SubmitPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : "";

  return (
    <main>
      <header className="bar">
        <Link className="mark" href="/">Shipnote</Link>
        <Link className="text-link" href="/">Back to the wall</Link>
      </header>
      <SubmitForm error={error} />
    </main>
  );
}
