import Link from "next/link";
import { postUpdate } from "./actions.js";

export const dynamic = "force-dynamic";

export default async function PostPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : "";

  return (
    <main className="shell">
      <header className="top">
        <div>
          <Link className="brand" href="/">Shipnote</Link>
          <p className="lede">No account. This update gets a public link.</p>
        </div>
      </header>
      <form className="panel" action={postUpdate}>
        <h1>Post an update</h1>
        <p>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required maxLength={120} />
        </p>
        <p>
          <label htmlFor="body">Body</label>
          <textarea id="body" name="body" required rows={8} maxLength={4000} />
        </p>
        <button type="submit">Post</button>
        {error ? <p className="error">{error}</p> : null}
      </form>
    </main>
  );
}
