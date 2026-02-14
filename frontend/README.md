# Frontend (Next.js)

Next.js App Router dashboard frontend. The UI lives in the app routes and consumes local dummy JSON data through one internal summary endpoint.

## Routes

- `/` - primary dashboard UI
- `/dashboard-2` - alternative dashboard view
- `/dashboard-3` - alternative dashboard view

## Frontend API

- `GET /api/dashboard/summary`

This route reads data from `../dummy data/*.json`, normalizes/validates it, and returns a UI-ready summary for the main dashboard page.

## Environment

```bash
cp .env.example .env.local
```

No required environment variables when using local dummy data.

## Run

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run test
npm run build
```
