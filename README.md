# Slideless Documentation

Public documentation site for [Slideless](https://app.slideless.ai) — host and share self-contained HTML presentations with public links, view tracking, and update-in-place.

Built on [Mintlify](https://mintlify.com). Deployed from this repo's `main` branch.

## Structure

- `index.mdx`, `quickstart.mdx` — landing + getting-started
- `why-slideless/` — product positioning (portable, dynamic, shareable)
- `concepts/` — presentations, share tokens, API keys
- `guides/` — end-to-end flows (with Claude, via API, update in place)
- `api-reference/` — per-endpoint reference with request/response schemas
- `skills/` — Claude Code marketplace skill index
- `AGENTS.md` — AI agent navigation guide (required reading before editing)
- `llms.txt`, `robots.txt` — SEO + LLM indexing
- `docs.json` — Mintlify configuration (nav, branding, fonts, colors)

## Local preview

```bash
npm i -g mint
mint dev       # http://localhost:3000
mint broken-links
```

## Publishing

Push to `main` — Mintlify's GitHub app auto-deploys to `docs.slideless.ai` (once the domain is wired up in the Mintlify dashboard).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
