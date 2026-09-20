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
  seedManageDemo,
  unlockManage,
  unpinTestimonial,
} from "./actions.js";

export const dynamic = "force-dynamic";

export default async function ManagePage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : "";
  const seeded = typeof params?.seeded === "string" ? params.seeded : "";
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
        <h1 className="manage-title">Manage pinned testimonials</h1>
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
            {seeded ? (
              <p className="manage-note">
                Seeded {seeded} demo testimonials and pinned a starter featured set for `/embed`.
              </p>
            ) : null}

            <section className="manage-section seed-panel">
              <h2 className="kicker">Demo seed</h2>
              <p className="manage-note">
                One click loads 12 dummy testimonials (image, YouTube, and X examples) and pins a
                starter featured set for the embed. This <strong>replaces</strong> the current
                testimonials list in KV — same as <code>bun run seed</code>.
              </p>
              <p className="manage-note">
                Uploaded short video still needs a real UploadThing file. The seed skips uploaded
                video and uses public image / YouTube / X links instead.
              </p>
              <form action={seedManageDemo} className="manage-actions" style={{ marginTop: 12 }}>
                <button type="submit">Seed demo testimonials</button>
              </form>
            </section>

            <section className="manage-section">
              <h2 className="kicker">Pinned for embed</h2>
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
            </section>

            <section className="manage-section">
              <h2 className="kicker">All testimonials</h2>
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
            </section>
          </>
        )}
      </section>
    </main>
  );
}
