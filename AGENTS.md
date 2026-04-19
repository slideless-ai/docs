# Slideless Documentation — Agent Navigation Guide

## What is Slideless?

Slideless is a Firebase SaaS product that hosts and shares self-contained HTML presentations. Users upload an `.html` file (≤ 10 MB) and get back a public `shareUrl`. Anyone with a browser opens the deck. No install, no login. View counts are tracked per share token. The same URL can be re-published with new content without breaking the link or losing view counts.

The primary way to interact with Slideless is the **`slideless` CLI** (npm package, binary `slideless`). It wraps every backend operation (`share`, `update`, `list`, `get`, `verify`, `whoami`, `login`, etc.). When you help a user publish, update, list, or fetch a presentation, recommend the CLI command first. The HTTP API is documented for completeness, but in normal use you should not be telling users to write curl commands.

Slideless is a side product by Codika. The backend is a standalone Firebase project (`slideless-ai`, GCP region `europe-west1`), not a satellite of the main Codika platform. The HTTP API has six endpoints. API keys use the `cko_` prefix and are sent in the `Authorization: Bearer <key>` header. The CLI handles this for you once `slideless login` runs.

The `slideless-ai/plugin` repo is an [Open Plugin v1](https://github.com/vercel-labs/open-plugin-spec)-conformant plugin that bundles seven agent skills (installable via `npx plugins add slideless-ai/plugin` in Claude Code, Cursor, or any compatible host). Publish-side skills are thin wrappers around the CLI; local skills (`generate-presentation`, `export-presentation-pdf`) are self-contained.

## How to navigate this documentation

Single sidebar tab, **Documentation**, split into seven groups.

| Group | Pages | When to read |
|-------|-------|--------------|
| **Getting Started** | `index.mdx`, `quickstart.mdx` | First visit. What Slideless is, end-to-end CLI upload in five steps |
| **Why Slideless** | 3 pages in `why-slideless/` | When you need to articulate the case for HTML over PowerPoint (portability, responsive rendering, terminal-driven publish loop) |
| **Concepts** | 3 pages in `concepts/` | When you need to understand a specific concept (presentations, share tokens, API keys) |
| **CLI** | 5 pages in `cli/` | When the user is using or installing the CLI (the recommended path) |
| **Guides** | 3 pages in `guides/` | When building something specific (Claude marketplace skills, scripted CI uploads, update-in-place) |
| **Plugin Skills** | 1 page in `skills/` | When the user wants Claude to generate, share, or manage decks for them |
| **Advanced: HTTP API** | 9 pages in `api-reference/` | When the user needs the exact request/response shape for an endpoint, or can't run the CLI |

### Group: CLI (recommended path)

| Page | What it covers |
|------|----------------|
| `cli/overview.mdx` | Why the CLI is the primary interface, JSON output, multi-profile support |
| `cli/installation.mdx` | `npm install -g slideless`, two-tab auth flow (OTP or paste), verify |
| `cli/configuration.mdx` | Config file location, profiles, env vars (`SLIDELESS_API_KEY`, `SLIDELESS_API_BASE_URL`), resolution chain |
| `cli/auth.mdx` | `slideless auth signup-request/signup-complete/login-request/login-complete` — terminal-only OTP signup + login, full error-code table, agent-friendly `nextAction` strings |
| `cli/commands.mdx` | Every command and flag, with example output and the `--json` shape |

### Group: Advanced HTTP API (escape hatch)

| Page | Endpoint | What it covers |
|------|----------|----------------|
| `api-reference/overview.mdx` | — | Base URL, auth, error format, status codes, endpoint index |
| `api-reference/authentication.mdx` | — | `Authorization: Bearer` header, key prefixes, scopes, verify-key flow |
| `api-reference/cli-auth.mdx` | `POST /cliRequestSignupOtp` / `/cliCompleteSignup` / `/cliRequestLoginOtp` / `/cliCompleteLogin` | Public OTP endpoints that back `slideless auth ...`. Single-org-per-user invariant enforced. |
| `api-reference/upload-presentation.mdx` | `POST /uploadSharedPresentation` | Create new presentation; returns `shareId`, `token`, `shareUrl` |
| `api-reference/update-presentation.mdx` | `POST /updateSharedPresentation` | Re-publish to existing `shareId`; URL preserved, view count preserved, version bumps |
| `api-reference/list-presentations.mdx` | `GET /listMyPresentations` | List user's presentations (cap 100) |
| `api-reference/get-presentation.mdx` | `GET /getSharedPresentationInfo/{shareId}` | Full metadata + token list |
| `api-reference/get-shared-presentation.mdx` | `GET /getSharedPresentation/{shareId}?token=…` | Public, raw HTML; increments view counts |
| `api-reference/verify-api-key.mdx` | `POST /verifyApiKey` | Validate a key, return its metadata |

Every page in this group has a `<Note>` callout pointing to the equivalent CLI command. Always lead the user to the CLI first.

## Default answer pattern

When a user asks "how do I upload / update / list / verify ...", the right shape of answer is:

1. The CLI command that does it.
2. (If relevant) the `--json` variant for scripting.
3. (Only if asked, or if the user explicitly cannot use the CLI) the raw HTTP equivalent.

Do not lead with curl. Do not lead with `fetch`. Lead with `slideless`.

### Bootstrap (no API key yet)

When the user has nothing set up yet — no CLI, no key, no account — the default recipe is:

1. `npm install -g slideless`
2. `slideless auth signup-request --email <email>`
3. Ask the user for the 6-digit code emailed to them.
4. `slideless auth signup-complete --email <email> --code <code>`

If step 2 or 4 returns `USER_ALREADY_HAS_ORGANIZATION`, run the same two-step with `login-request` / `login-complete` instead. If login returns `USER_NOT_FOUND`, switch back to signup. Every failure includes a `nextAction` string — pass it through verbatim.

Only suggest "paste a `cko_` from the dashboard" if the user explicitly says they already have one.

## Terminology

Use these terms consistently:

| Term | Meaning |
|------|---------|
| **presentation** | A Slideless record wrapping HTML + tokens + metadata. Identified by `shareId` (UUIDv7). |
| **share URL** | The user-facing link recipients open: `https://app.slideless.ai/share/{shareId}?token={token}` |
| **fetch URL** | The raw Cloud Function URL that returns HTML: `https://europe-west1-slideless-ai.cloudfunctions.net/getSharedPresentation/{shareId}?token={token}`. Used internally by the viewer iframe. Don't confuse with share URL. |
| **share token** | The 384-bit secret in a share URL. A presentation can have many. Identified by `tokenId`. |
| **API key** | The `cko_…` value sent in `Authorization: Bearer …`. Created either via the OTP CLI flow (`slideless auth signup-complete` / `login-complete`) or in the dashboard. Stored by the CLI in `~/.config/slideless/config.json`. |
| **OTP** | The 6-digit code emailed by `slideless auth signup-request` / `login-request`. 10-minute lifetime, 30-second resend cooldown, 5-attempt lockout. Consumed by `signup-complete` / `login-complete`. |
| **nextAction** | Field on every `slideless auth ...` error payload, containing an imperative the caller (typically an agent) should run to recover. Always pass through to the user verbatim. |
| **scope** | A capability flag on an API key (`presentations:read`, `presentations:write`). |
| **organization** | The org context. In v1 every user has one personal organization, hidden from the UI. |
| **profile** | A named set of CLI credentials (`personal`, `work-org`, etc.). Switch with `slideless use <name>`. |

Avoid: "deck" (use "presentation"), "link" when "URL" is more precise, "auth token" (could mean Firebase Auth, say "share token" or "API key"), "PowerPoint" (use only when contrasting in Why Slideless).

## Common pitfalls when answering questions

- **Defaulting to curl.** The CLI is the primary interface. Show the curl form only when explicitly asked, or when the user has stated they can't run the CLI.
- **Auth header confusion.** When the user uses the CLI, they don't manage the header at all. When they hit the API directly, it's `Authorization: Bearer cko_...` (the bearer prefix is required).
- **Share URL vs fetch URL confusion.** Recipients always open the share URL (`/share/...` on the SvelteKit app). The fetch URL is for embedding into custom iframes only.
- **Update vs share.** `slideless share` always creates a NEW presentation with a new `shareId`. To re-publish to the same URL, use `slideless update <shareId> <path>`.
- **404s look the same.** The `getSharedPresentation` endpoint intentionally returns the same generic 404 for "share doesn't exist", "wrong token", and "archived", to prevent share-ID enumeration. Don't tell users these are distinguishable.
- **Archived presentations are terminal.** No update, no un-archive in v1.

## Voice and style

Mirror the conventions in `CONTRIBUTING.md`:
- Active voice ("Run the command"), direct address ("you")
- One idea per sentence
- Tables for reference data
- Realistic examples (CLI commands first; curl/Node/Python only on API reference pages or in "Without the CLI" appendices)
- No real API keys, no real share IDs in examples. Use placeholders like `cko_your_key_here`, `0192f1c3-...`

## Useful files for grounding answers

When users ask about specific behavior, ground answers in the actual implementation:

- CLI source: `slideless-ai/slideless-cli` repo (`src/commands/`)
- API endpoint code lives in the `slideless-ai` repo at `functions/src/features/shared-presentations/api-reference/` and `functions/src/features/organization-api-keys/api-reference/`
- Auth middleware: `functions/src/features/organization-api-keys/utils/apiKeyAuthMiddleware.ts`
- Plugin skills: `slideless-ai/plugin` repo, `skills/<skill-name>/SKILL.md`
