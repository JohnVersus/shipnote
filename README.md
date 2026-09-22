# Shipnote

Collect a testimonial, show a public wall, and embed it.

Demo: https://shipnote-alpha.vercel.app

No account.

- Add a testimonial at `/submit` (quote and name required; optional detail).
- Optional media on submit: image (up to 4 MB), short video (up to 128 MB), YouTube URL, or X/Twitter post URL. Shown on `/q/{id}`, the wall, and `/embed`.
- Submit lands on `/q/{id}`, a public page with a copyable link. The wall and `/embed` show the same quote and any media.
- The public wall is `/`. Cards use a freestyle masonry layout (no stretched empty gaps). Share actions are buttons only: “Copy iframe code” and “Copy embed URL” — the raw snippet stays hidden.
- The same quotes embed at `/embed` (up to 10). Featured IDs in KV come first; newest non-featured fill the rest. The iframe path stays `/embed`.
- Curate featured quotes at `/manage` (token check is unlocked in demo mode for hackathon review). No paid deps.
- Seed demo data from `/manage` when unlocked (Seed demo testimonials), or with `bun run seed` (needs KV env). Loads 12 samples with image, YouTube, and X examples, replaces the current KV list, and pins a starter featured set. Uploaded short video is not seeded — that still needs a real UploadThing file.

The host needs `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Without them, the wall stays empty and submit fails.

Optional uploaded media needs `UPLOADTHING_TOKEN` (UploadThing free). Quote and name still work without it. YouTube and X/Twitter links do not need that token.

Optional manage unlock: In production, setting `DEMO_MODE = false` in `lib/manage-auth.js` enforces `MANAGE_TOKEN`. In hackathon demo mode, `/manage` is unlocked for direct review.

Not included: accounts, email, analytics, paid APIs. The repo and demo name are still Shipnote.
