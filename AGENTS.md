# Slideless Documentation — Agent Navigation Guide

## What is Slideless?

Slideless is a Firebase SaaS product that hosts and shares self-contained HTML presentations. Users upload an `.html` file (≤ 10 MB) via the HTTP API or the dashboard, get back a public `shareUrl`, and send the URL to recipients. Anyone with a browser opens the deck — no install, no login. View counts are tracked per share token. The same URL can be re-published with new content (`updateSharedPresentation`) without breaking the link or losing view counts.

Slideless is a side product by Codika. The backend is a standalone Firebase project (`slideless-ai`, GCP region `europe-west1`), not a satellite of the main Codika platform. The HTTP API has six endpoints. API keys use the `cko_` prefix and are sent in the `X-Process-Manager-Key` header.

The marketplace plugin (`slideless-ai/marketplace`) bundles seven Claude Code skills that wrap the API.

## How to navigate this documentation

Single sidebar tab — **Documentation** — split into six groups.

| Group | Pages | When to read |
|-------|-------|--------------|
| **Getting Started** | `index.mdx`, `quickstart.mdx` | First visit — what Slideless is, end-to-end upload in five steps |
| **Why Slideless** | 3 pages in `why-slideless/` | When you need to articulate the case for HTML over PowerPoint (portability, responsive rendering, terminal-driven publish loop) |
| **Concepts** | 3 pages in `concepts/` | When you need to understand a specific concept (presentations, share tokens, API keys) |
| **Guides** | 3 pages in `guides/` | When building something specific (using Claude marketplace skills, raw API uploads, update-in-place flow) |
| **API Reference** | 8 pages in `api/` | When you need the exact request/response shape for an endpoint |
| **Marketplace Skills** | 1 page in `skills/` | When the user wants Claude to generate, share, or manage decks for them |

### Group: API Reference

| Page | Endpoint | What it covers |
|------|----------|----------------|
| `api/overview.mdx` | — | Base URL, auth, error format, status codes, endpoint index |
| `api/authentication.mdx` | — | `X-Process-Manager-Key` header, key prefixes, scopes, verify-key flow |
| `api/upload-presentation.mdx` | `POST /uploadSharedPresentation` | Create new presentation; returns `shareId`, `token`, `shareUrl` |
| `api/update-presentation.mdx` | `POST /updateSharedPresentation` | Re-publish to existing `shareId`; URL preserved, view count preserved, version bumps |
| `api/list-presentations.mdx` | `GET /listMyPresentationsPublic` | List user's presentations (cap 100) |
| `api/get-presentation.mdx` | `GET /getSharedPresentationInfoPublic/{shareId}` | Full metadata + token list |
| `api/get-shared-presentation.mdx` | `GET /getSharedPresentation/{shareId}?token=…` | Public — raw HTML; increments view counts |
| `api/verify-api-key.mdx` | `POST /verifyApiKey` | Validate a key, return its metadata |

## Terminology

Use these terms consistently:

| Term | Meaning |
|------|---------|
| **presentation** | A Slideless record wrapping HTML + tokens + metadata. Identified by `shareId` (UUIDv7). |
| **share URL** | The user-facing link recipients open: `https://app.slideless.ai/share/{shareId}?token={token}` |
| **fetch URL** | The raw Cloud Function URL that returns HTML: `https://europe-west1-slideless-ai.cloudfunctions.net/getSharedPresentation/{shareId}?token={token}`. Used internally by the viewer iframe. Don't confuse with share URL. |
| **share token** | The 384-bit secret in a share URL. A presentation can have many. Identified by `tokenId`. |
| **API key** | The `cko_…` value sent in `X-Process-Manager-Key`. Created in the dashboard. |
| **scope** | A capability flag on an API key (`presentations:read`, `presentations:write`). |
| **organization** | The org context. In v1 every user has one personal organization, hidden from the UI. |

Avoid: "deck" (use "presentation"), "link" when "URL" is more precise, "auth token" (could mean Firebase Auth — say "share token" or "API key"), "PowerPoint" (use "PowerPoint" only when contrasting in Why Slideless).

## Common pitfalls when answering questions

- **Auth header confusion.** It's `X-Process-Manager-Key`, not `Authorization: Bearer`. The Bearer pattern doesn't work.
- **Share URL vs fetch URL confusion.** Recipients always open the share URL (`/share/...` on the SvelteKit app). The fetch URL is for embedding into custom iframes only.
- **Update vs upload.** `uploadSharedPresentation` always creates a NEW presentation with a new `shareId`. To re-publish to the same URL, use `updateSharedPresentation` with the existing `shareId`.
- **404s look the same.** The `getSharedPresentation` endpoint intentionally returns the same generic 404 for "share doesn't exist", "wrong token", and "archived" — to prevent share-ID enumeration. Don't tell users these are distinguishable.
- **Archived presentations are terminal.** No update, no un-archive in v1.

## Voice and style

Mirror the conventions in `CONTRIBUTING.md`:
- Active voice ("Run the command"), direct address ("you")
- One idea per sentence
- Tables for reference data
- Realistic examples (curl + Node/Python on API pages)
- No real API keys, no real share IDs in examples — use placeholders like `cko_your_key_here`, `0192f1c3-...`

## Useful files for grounding answers

When users ask about specific behavior, ground answers in the actual implementation:

- API endpoint code lives in the `slideless-ai` repo at `functions/src/features/shared-presentations/api-reference/` and `functions/src/features/organization-api-keys/api-reference/`
- Auth middleware: `functions/src/features/organization-api-keys/utils/apiKeyAuthMiddleware.ts`
- Marketplace skills: `slideless-ai/marketplace` repo, `plugins/slideless/skills/<skill-name>/SKILL.md`
