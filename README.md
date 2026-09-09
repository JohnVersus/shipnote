# Shipnote

Collect a testimonial, show a public wall, and embed it.

Demo: https://shipnote-alpha.vercel.app

No account.

- Add a testimonial at `/submit` (quote and name, optional detail).
- Submit lands on `/q/{id}`, a public page with a copyable link. The wall and `/embed` point at that same page.
- The public wall is `/`.
- The same quotes embed at `/embed` (up to 8).

The host needs `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Without them, the wall stays empty and submit fails.

Not included: accounts, email, analytics. The repo and demo name are still Shipnote.
