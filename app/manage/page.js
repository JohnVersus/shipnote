import Link from "next/link";
import { getFeaturedIds, listTestimonials } from "../../lib/testimonials.js";
import {
  isManageAuthenticated,
  manageTokenConfigured,
} from "../../lib/manage-auth.js";
import {
  lockManage,
  moveFeatured,
  pinTestimonial,
  unlockManage,
  unpinTestimonial,
} from "./actions.js";

export const dynamic = "force-dynamic";

export default async function ManagePage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : "";
  const tokenReady = manageTokenConfigured();
  const unlocked = await isManageAuthenticated();
  const items = unlocked ? await listTestimonials() : [];
  const featuredIds = unlocked ? await getFeaturedIds() : [];
  const featuredSet = new Set(featuredIds);
  const featuredItems = featuredIds
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);
  const others = items.filter((item) => !featuredSet.has(item.id));

  return (
    <main>
      <header className="bar">
        <Link className="mark" href="/">Shipnote</Link>
        <Link className="text-link" href="/embed">Open embed</Link>
      </header>

      <section className="manage">
        <p className="kicker">Embed featured</p>
        <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: "36px", letterSpacing: "-0.03em" }}>
          Manage pinned testimonials
        </h1>
        <p className="manage-note">
          `/embed` shows up to 10 quotes: pinned IDs first (in order), then newest non-pinned.
          The iframe snippet stays `/embed` — pin changes only the data.
        </p>

        {!tokenReady ? (
          <p className="manage-note">
            Set <code>MANAGE_TOKEN</code> on the host (Vercel env), then reload this page.
          </p>
        ) : !unlocked ? (
          <form className="manage-token" action={unlockManage}>
            <label className="sr" htmlFor="token">Manage token</label>
            <input
              id="token"
              name="token"
              type="password"
              autoComplete="current-password"
              placeholder="MANAGE_TOKEN"
              required
            />
            <button type="submit">Unlock</button>
            {error ? <p className="error">{error}</p> : null}
          </form>
        ) : (
          <>
            <div className="manage-actions" style={{ marginTop: 16 }}>
              <form action={lockManage}>
                <button className="button-ghost" type="submit">Lock</button>
              </form>
              <span className="badge">{featuredItems.length} pinned · fill to 10</span>
            </div>
            {error ? <p className="error">{error}</p> : null}

            <h2 className="kicker" style={{ marginTop: 28 }}>Pinned for embed</h2>
            {featuredItems.length === 0 ? (
              <p className="manage-note">None pinned yet. Newest quotes fill the embed until you pin.</p>
            ) : (
              <ol className="manage-list">
                {featuredItems.map((item, index) => (
                  <li className="manage-item pinned" key={item.id}>
                    <p>{item.quote}</p>
                    <p className="meta">
                      {item.name}
                      {item.detail ? ` · ${item.detail}` : ""} · #{index + 1}
                    </p>
                    <div className="manage-actions">
                      <form action={moveFeatured}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button className="button-ghost" type="submit" disabled={index === 0}>
                          Move up
                        </button>
                      </form>
                      <form action={moveFeatured}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          className="button-ghost"
                          type="submit"
                          disabled={index === featuredItems.length - 1}
                        >
                          Move down
                        </button>
                      </form>
                      <form action={unpinTestimonial}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="button-ghost" type="submit">Unpin</button>
                      </form>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <h2 className="kicker" style={{ marginTop: 28 }}>All testimonials</h2>
            {others.length === 0 && featuredItems.length === 0 ? (
              <p className="manage-note">No testimonials yet. Run <code>bun run seed</code> or submit one.</p>
            ) : others.length === 0 ? (
              <p className="manage-note">Every quote is pinned.</p>
            ) : (
              <ul className="manage-list">
                {others.map((item) => (
                  <li className="manage-item" key={item.id}>
                    <p>{item.quote}</p>
                    <p className="meta">
                      {item.name}
                      {item.detail ? ` · ${item.detail}` : ""}
                    </p>
                    <div className="manage-actions">
                      <form action={pinTestimonial}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" disabled={featuredItems.length >= 10}>
                          Pin to embed
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </main>
  );
}
