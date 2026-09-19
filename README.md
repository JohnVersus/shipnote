# Shipnote

Collect a testimonial, show a public wall, and embed it.

Demo: https://shipnote-alpha.vercel.app

No account.

- Add a testimonial at `/submit` (quote and name, optional detail). Optional image or short video.
- Submit lands on `/q/{id}`, a public page with a copyable link. The wall and `/embed` show the same quote and any media.
- The public wall is `/`. It copies a ready-to-paste iframe for `/embed`, plus the URL as a second option.
- The same quotes embed at `/embed` (up to 8).

The host needs `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Without them, the wall stays empty and submit fails.

Optional media needs `UPLOADTHING_TOKEN` (UploadThing free). Quote and name still work without it.

Not included: accounts, email, analytics. The repo and demo name are still Shipnote.
