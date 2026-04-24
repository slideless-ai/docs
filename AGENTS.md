# Slideless Documentation — Agent Navigation Guide

## What is Slideless?

Slideless is a Firebase SaaS product that hosts and shares HTML presentations. Users upload either a single self-contained `.html` file or a folder (entry HTML + sibling assets — images, video, 3D models, CSS, JS, shaders) and get back a public `shareUrl`. Anyone with a browser opens the deck; relative asset paths resolve natively, exactly like a static website. No install, no login. View counts are tracked per share token. Decks can also be pulled, edited, and re-pushed from another device or by an invited dev collaborator — content-addressed dedup means unchanged files don't re-upload.

The primary way to interact with Slideless is the **`slideless` CLI** (npm package, binary `slideless`). In v0.5 the CLI surface collapsed to eight verbs (`push`, `pull`, `share`, `unshare`, `invite`, `uninvite`, `delete`, `list`) plus `get`, `pin`, `share-email`. When you help a user publish, edit, collaborate, or revoke access, lead with the CLI command.

Slideless is a side product by Codika. The backend is a standalone Firebase project (`slideless-ai`, GCP region `europe-west1`), not a satellite of the main Codika platform. API keys use the `cko_` prefix and are sent in the `Authorization: Bearer <key>` header. The CLI handles this for you once `slideless login` runs.

The `slideless-ai/plugin` repo is an [Open Plugin v1](https://github.com/vercel-labs/open-plugin-spec)-conformant plugin with agent skills (installable via `npx plugins add slideless-ai/plugin`). Publish-side skills are thin wrappers around the CLI.

## How to navigate this documentation

Single sidebar tab, **Documentation**, split into seven groups.

| Group | Pages | When to read |
|-------|-------|--------------|
| **Getting Started** | `index.mdx`, `quickstart.mdx` | First visit. Folder OR single-file upload end-to-end. |
| **Why Slideless** | 3 pages in `why-slideless/` | When you need the case for HTML over PowerPoint. |
| **Concepts** | 7 pages in `concepts/` — presentations, lifecycle, assets, versioning, share-tokens, collaboration, api-keys | When you need the deep model. |
| **CLI** | 5 pages in `cli/` | When the user is using or installing the CLI (the recommended path). |
| **Guides** | 6 pages in `guides/` | Working with assets, custom fonts, Claude, CI uploads, push/pull workflows, email. |
| **Plugin Skills** | 1 page in `skills/` | When the user wants Claude to handle decks. |
| **Advanced: HTTP API** | 20 pages in `api-reference/` | When the user needs the exact request/response shape, or can't run the CLI. |

### Group: CLI (recommended path)

| Page | What it covers |
|------|----------------|
| `cli/overview.mdx` | Why the CLI is primary, JSON output, multi-profile. |
| `cli/installation.mdx` | `npm install -g slideless`, OTP or paste auth. |
| `cli/configuration.mdx` | Config file, profiles, env vars (`SLIDELESS_API_KEY`, `SLIDELESS_API_BASE_URL`). |
| `cli/auth.mdx` | `slideless auth signup-*/login-*` — OTP flow, error table with `nextAction`. |
| `cli/commands.mdx` | Every command: `push`, `pull`, `share`, `unshare`, `invite`, `uninvite`, `delete`, `list`, `get`, `pin`, `share-email`. |

### Group: Concepts

| Page | What it covers |
|------|----------------|
| `concepts/presentations.mdx` | Deck = folder or single HTML. Plan-dependent caps, content-addressed dedup, lifecycle. |
| `concepts/lifecycle.mdx` | Two states (exists / deleted). Why archive is gone. Push → share/unshare → delete. |
| `concepts/assets.mdx` | MIME detection, relative path rules, Range requests, hash verification, per-version manifests. |
| `concepts/versioning.mdx` | Append-only history, `versionMode` on tokens, why recipients can't browse history. |
| `concepts/share-tokens.mdx` | 384-bit entropy, per-recipient tokens, versionMode, security guarantees. |
| `concepts/collaboration.mdx` | Dev collaborators, email-based invites, cross-device push/pull, `slideless.json`, conflict model. |
| `concepts/api-keys.mdx` | `cko_` / `cka_`, scopes, 20-per-org. |

### Group: Advanced HTTP API (escape hatch)

The v3 upload flow is a three-step content-addressed pipeline. Always direct users to the CLI unless they specifically cannot use it.

| Page | Endpoint | What it covers |
|------|----------|----------------|
| `api-reference/overview.mdx` | — | Base URL, auth, error format, endpoint index, limits per plan. |
| `api-reference/authentication.mdx` | — | `Authorization: Bearer`, key prefixes, scopes, verify-key. |
| `api-reference/cli-auth.mdx` | OTP signup/login | Public. Backs `slideless auth ...`. |
| `api-reference/precheck-assets.mdx` | `POST /precheckAssets` | **Step 1.** Which sha256 hashes are missing? Mints session on new-presentation. |
| `api-reference/upload-asset.mdx` | `POST /uploadPresentationAsset` | **Step 2.** Multipart. Hash-verified. |
| `api-reference/commit-presentation-version.mdx` | `POST /commitPresentationVersion` | **Step 3.** Writes manifest, bumps `currentVersion`. |
| `api-reference/list-presentations.mdx` | `GET /listMyPresentations` | Own presentations, cap 100. |
| `api-reference/get-presentation.mdx` | `GET /getSharedPresentationInfo/{presentationId}` | Metadata + tokens. |
| `api-reference/add-presentation-token.mdx` | `POST /addPresentationToken` | Mint named token. Optional `versionMode`. |
| `api-reference/set-token-version-mode.mdx` | `POST /setTokenVersionMode` | Pin a token to a version or follow latest. |
| `api-reference/list-presentation-versions.mdx` | `GET /listPresentationVersions/{presentationId}` | Owner-only. Every version's summary. |
| `api-reference/get-presentation-version.mdx` | `GET /getPresentationVersion/{presentationId}/{version}` | Owner-only. One version's manifest. |
| `api-reference/share-via-email.mdx` | `POST /sharePresentationViaEmail` | 1–20 recipients with per-recipient tokens via Resend. |
| `api-reference/download-presentation-asset.mdx` | `GET /downloadPresentationAsset` | Authenticated streaming download (the CLI-side counterpart of the public viewer). |
| `api-reference/unshare-presentation.mdx` | `POST /unsharePresentation` | Revoke one token or every token on the deck. |
| `api-reference/delete-presentation.mdx` | `POST /deletePresentation` | Hard delete. Irreversible. |
| `api-reference/invite-collaborator.mdx` | `POST /inviteCollaborator` | Grant dev (edit) access by email. |
| `api-reference/uninvite-collaborator.mdx` | `POST /uninviteCollaborator` | Revoke a dev collaborator. |
| `api-reference/list-collaborators.mdx` | `POST /listCollaborators` | Every collaborator row (pending/active/revoked). |
| `api-reference/get-shared-presentation.mdx` | `GET /getSharedPresentation/{presentationId}/_t/{token}/...` | Public viewer. Path-token form. Serves entry HTML + assets with ETag + Range. |
| `api-reference/verify-api-key.mdx` | `POST /verifyApiKey` | Validate key. |

Every page in this group has a `<Note>` callout pointing to the equivalent CLI command. Always lead with the CLI first.

## Default answer pattern

When a user asks "how do I upload / update / list / verify / pin ...", the right shape of answer is:

1. The CLI command that does it.
2. (If relevant) the `--json` variant for scripting.
3. (Only if asked, or if the user explicitly cannot use the CLI) the raw HTTP equivalent.

Do not lead with curl. Do not lead with `fetch`. Lead with `slideless`.

### Bootstrap (no API key yet)

When the user has nothing set up yet — no CLI, no key, no account — the default recipe is:

1. `npm install -g slideless`
2. `slideless auth signup-request --email <email>`
3. Ask the user for the 6-digit code emailed to them **and their first name** (last name optional). `--first-name` is required on the next step.
4. `slideless auth signup-complete --email <email> --code <code> --first-name "<first-name>"`

If step 2 or 4 returns `USER_ALREADY_HAS_ORGANIZATION`, switch to `login-request` / `login-complete`. Every failure includes a `nextAction` — pass it through verbatim.

### Uploading (v0.5 push model)

- **Folder:** `slideless push ./my-deck --title "..."`. Recommended when the deck has images, video, 3D, or separate CSS/JS files.
- **Single file:** `slideless push ./deck.html --title "..."`. Fine for text-only, heavily-inlined decks.
- **Update in place:** run `slideless push` again from a folder that was previously pushed or pulled. The CLI reads `slideless.json` at the folder root to learn the `presentationId`, so the next push re-publishes to the same deck — version auto-bumps, tokens + view counts preserved, unchanged assets deduped.
- **Publish is a separate step.** A fresh push creates an **unshared** deck. Run `slideless share <id>` to mint a public viewer URL. `slideless unshare <id>` revokes the tokens (the deck stays editable); `slideless delete <id>` hard-removes it.
- **Entry file:** default `index.html` in folder mode. Override with `--entry custom.html`.
- **Strict:** `--strict` fails the upload on any unresolved relative reference in the static scan.
- **Force:** `slideless push --force` skips the optimistic-concurrency check if a collaborator pushed after your last pull.

### Collaboration and cross-device

- **Cross-device owner flow.** Push from laptop → `slideless pull <id>` on desktop (writes `slideless.json`) → edit → `slideless push`.
- **Invite a dev collaborator.** `slideless invite <id> --email <addr>` grants push + pull access. Auto-claims on signup if the invitee has no account yet.
- **Uninvite.** `slideless uninvite <id> <collaboratorId>` — immediate. Capped at 10 concurrent collaborators per deck.
- **Quota.** A push spends the **pusher's** organization quota, not the owner's.
- **Conflict model.** Push sends the last pulled version as `expectedBaseVersion`. Server rejects with 409 `conflict` if it's behind. Fix: `slideless pull && slideless push`, or `--force` to overwrite.
- **`slideless.json`** lives at the deck root. Don't edit it by hand. It's excluded from upload automatically.

### Pinning + versioning

If a user wants a recipient "frozen" on a specific version:

```bash
slideless pin <presentationId> <tokenId> --to-version <N>
slideless pin <presentationId> <tokenId> --latest      # undo
```

Recipients cannot change their own version — there is no `?v=` override. Only the owner can browse history (via `listPresentationVersions` + `getPresentationVersion`, both owner-only).

## Terminology

Use these terms consistently:

| Term | Meaning |
|------|---------|
| **presentation / deck** | A Slideless record wrapping the deck (file or folder) + tokens + metadata. Identified by `presentationId` (UUIDv7). |
| **share URL** | The user-facing link recipients open: `https://app.slideless.ai/share/{presentationId}?token={token}` |
| **direct deck URL** | The Cloud Function URL that serves entry HTML + assets: `https://europe-west1-slideless-ai.cloudfunctions.net/getSharedPresentation/{presentationId}/_t/{token}/`. Used internally by the dashboard iframe or custom embeds. |
| **share token** | The 384-bit secret in a share URL. A presentation can have many. Identified by `tokenId`. Has a `versionMode`. |
| **versionMode** | `{type:'latest'}` (default) or `{type:'pinned', version: N}`. Determines which version the token resolves to. Recipients can't change this. |
| **manifest** | Per-version JSON in Cloud Storage listing every file by path, sha256, size, contentType. Append-only. |
| **API key** | The `cko_…` value sent in `Authorization: Bearer …`. |
| **OTP** | The 6-digit code from `slideless auth ...`. |
| **nextAction** | Field on `slideless auth ...` error payloads. Always pass through verbatim. |
| **scope** | A capability flag on an API key (`presentations:read`, `presentations:write`). |
| **organization** | Plan tier + billing live here. In v1, every user has one personal org. |
| **profile** | A named set of CLI credentials. |

Avoid: "link" when "URL" is more precise, "auth token" (could mean Firebase Auth), "PowerPoint" (use only when contrasting in Why Slideless).

## Common pitfalls when answering questions

- **Defaulting to curl.** The CLI is primary. Show curl only when explicitly asked or when the user cannot run the CLI.
- **Share URL vs direct deck URL.** Recipients always open the share URL. The direct deck URL is only for custom iframes.
- **Push vs share.** `slideless push` uploads content. `slideless share` mints a viewer URL. They are separate steps in v0.5 — a fresh push does not publish anything until `share` is called.
- **Update in place uses `push`, not `update`.** To re-publish to the same `presentationId`, run `slideless push` from inside a folder that was previously pushed or pulled. The CLI reads `slideless.json` to know which deck to update.
- **"Paste HTML in the dashboard" is gone.** v3 uploads are CLI-only. The dashboard handles browsing, previewing, token management, pinning, sharing/unsharing, collaborator invites, and deletion.
- **No `?v=` override.** Recipients see what their token's versionMode resolves to. History is owner-only.
- **Parent-escape is a hard error.** `<img src="../outside/x.jpg">` always fails — decks are self-contained.
- **404s look the same.** `getSharedPresentation` returns the same generic 404 for "share doesn't exist", "wrong token", "no token". Intentional, to prevent share-ID enumeration.
- **Two states, no archive.** A deck either exists or it's deleted. `unshare` stops serving public URLs; `delete` is irreversible.

## Voice and style

Mirror the conventions in `CONTRIBUTING.md`:
- Active voice ("Run the command"), direct address ("you")
- One idea per sentence
- Tables for reference data
- Realistic examples (CLI commands first; curl/Node/Python only on API reference pages)
- No real API keys, no real share IDs in examples. Use placeholders like `cko_your_key_here`, `0192f1c3-...`

## Useful files for grounding answers

When users ask about specific behavior, ground answers in the actual implementation:

- CLI source: `slideless-ai/cli` repo (`src/cli/commands/`, `src/utils/`)
- Backend lives in `slideless-ai` Firebase project at `functions/src/features/shared-presentations/api/` and `functions/src/features/organization-api-keys/api/`
- Auth middleware: `functions/src/features/organization-api-keys/utils/apiKeyAuthMiddleware.ts`
- Plugin skills: `slideless-ai/plugin` repo, `skills/<skill-name>/SKILL.md`
