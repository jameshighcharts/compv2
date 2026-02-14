# Backend Service

Express + TypeScript service that reads Salesforce dashboard JSON payloads from S3 and exposes internal API endpoints.

## Endpoints

- `GET /health`
- `GET /api/overview/kpis`
- `GET /api/sales/monthly`
- `GET /api/sales/yearly`
- `GET /api/revenue-streams`

All `/api/*` endpoints require `x-internal-api-key`.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The frontend should call this service via `BACKEND_BASE_URL`.
