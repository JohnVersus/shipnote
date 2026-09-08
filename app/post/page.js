import { postUpdate } from "./actions.js";

export const dynamic = "force-dynamic";

export default async function PostPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : "";

  return (
    <main>
      <h1>Post an update</h1>
      <form action={postUpdate}>
        <p>
          <label htmlFor="title">Title</label>
          <br />
          <input id="title" name="title" required maxLength={120} />
        </p>
        <p>
          <label htmlFor="body">Body</label>
          <br />
          <textarea id="body" name="body" required rows={8} maxLength={4000} />
        </p>
        <button type="submit">Post</button>
      </form>
      {error ? <p>{error}</p> : null}
    </main>
  );
}
