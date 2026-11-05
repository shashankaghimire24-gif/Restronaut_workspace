# Restronaut Sales Workspace

A restaurant prospecting and outreach workspace built to organize discovery, evidence-backed research, draft preparation, and follow-ups.

## What it does

- Discover restaurant listings by Bay Area city, street, and selected districts using OpenStreetMap/Overpass.
- Review publicly published website contacts and save research observations with sources.
- Manage restaurant records, CSV imports/exports, duplicate detection, sales stages, and follow-ups.
- Prepare tailored draft emails from a reviewed observation and campaign idea.
- Queue research batches and retain drafts and activity in a user-scoped database.
- Track customer status and user-entered account value.

## Architecture

React and TypeScript UI, Next.js-compatible routes through Vinext/Vite, Cloudflare Workers and D1, Drizzle schema/migrations, Tailwind, and shadcn components.

`app/` contains views and API routes; `lib/` contains business logic, geography and public listing snapshots; `db/` and `drizzle/` contain database definitions; `build/` and `scripts/` contain the hosting/build integration.

## Development

Requires Node.js 22.13 or newer and npm.

```sh
npm run install:ci
npm run dev
```

The source targets the Sites/Cloudflare runtime, not GitHub Pages. Development uses the portable execution profile and local mock authentication. Local database setup must apply the supplied migration to the DB binding. Build with `npm run build`; validate types with `npx tsc --noEmit` after installing dependencies.

## Deployment and authentication

The original application uses a trusted Sites authentication gateway and a provisioned D1 database. This source export deliberately omits the original Site project identity and runtime data. A new deployment needs its own hosting identity, database binding, migrations, and authentication setup.

The authentication helper reads identity headers provided by the trusted gateway. Do not expose those handlers on an untrusted origin that accepts visitor-supplied identity headers. Mock authentication is for local development only.

Publishing this repository does not make the original hosted workspace public or create a public demo. The existing hosted workspace remains private.

## Scope and limitations

Discovery coverage is partial; listings and historical snapshots require verification. Template drafting and research queues do not invoke an AI API by themselves. Email sending and reply tracking are manual; this source does not include a connected mailbox or CRM integration. No sales or conversion results are claimed.

## Data and attribution

This export includes code, schema, migration, assets, lockfile, and public OpenStreetMap listing snapshots. It excludes live customer records, private call notes, mailbox data, credentials, local tool state, and source Git history.

OpenStreetMap data © OpenStreetMap contributors, licensed under the Open Database License: https://www.openstreetmap.org/copyright . Preserve attribution and source links when reusing the listing snapshots. Third-party component and build-helper license notices are retained. No new license for the application code has been selected.
