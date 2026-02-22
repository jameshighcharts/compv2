# Backend Compass V2 - Full Project Summary and Scope

## 1. Executive Summary

`backend_compass_v2` is a full-stack analytics dashboard project with:

- A **Next.js frontend** (`/frontend`) that renders 3 dashboard pages and an internal API route for dashboard summary data.
- An **Express backend** (`/backend`) that is designed to read analytics JSON payloads from S3 and expose protected internal API endpoints.
- A **dummy-data mode** currently powering the frontend summary API from local JSON files in `/dummy data`.

Current operating mode:

- Frontend dashboards are live and use **Highcharts** + **@highcharts/react**.
- Dashboard 2 table uses **Highcharts Grid Pro**.
- Frontend summary endpoint currently reads **local dummy files** (not backend endpoints).
- Backend S3 integration exists and is ready to be wired into frontend flow.

---

## 2. Repository Structure

- `/frontend` - Next.js 16 App Router application (React 19, TypeScript, Tailwind 4, shadcn/ui).
- `/backend` - Express 5 TypeScript service (AWS SDK v3 for S3, Zod validation, Helmet, CORS).
- `/dummy data` - Local JSON files used by frontend summary API:
  - `overview_kpis.json`
  - `monthly_sales.json`
  - `yearly_sales.json`
  - `revenue_streams.json`
  - plus workflow artifact JSON.

---

## 3. Frontend Scope

### 3.1 Frontend Routes

- `/` (`/frontend/src/app/page.tsx`)
  - Multi-tab dashboard: `Overview`, `Analytics`, `Reports`, `Notifications`.
  - Overview tab:
    - KPI/stat cards with sparklines.
    - Revenue line mini-chart.
    - Monthly sales area chart.
    - Subscriptions grouped bars.
    - Payments table and Team Members card.
  - Analytics tab:
    - Stat cards and top acquisition channels table.
  - Reports tab:
    - Report list table (frontend-only) with download buttons.
  - Notifications tab:
    - Placeholder content.

- `/dashboard-2` (`/frontend/src/app/dashboard-2/page.tsx`)
  - Stat cards.
  - Revenue grouped column chart.
  - Recent Activity table implemented with **Highcharts Grid Pro**.
  - Visitors donut chart.

- `/dashboard-3` (`/frontend/src/app/dashboard-3/page.tsx`)
  - Consolidated budget chart with Desktop/Mobile toggle.
  - Radial-style visitors chart.
  - Metric cards.
  - Radar area chart.
  - Overview stacked columns.

### 3.2 Frontend API

- `GET /api/dashboard/summary` (`/frontend/src/app/api/dashboard/summary/route.ts`)
  - Loads local dummy payloads via `loadDummyDashboardData`.
  - Transforms to UI summary schema via `buildDashboardSummary`.
  - Returns cache headers:
    - success: `s-maxage=14400, stale-while-revalidate=300`
    - error: `no-store`.
  - Logs success/error with request IDs and latency.

### 3.3 Date Range UX

- Reusable shadcn-based date range picker (`/frontend/src/components/ui/date-picker.tsx`):
  - Start/end selection.
  - Presets: Today, Last 7 Days, Last 30 Days, Month to Date.
  - Apply, Cancel, Clear flow.

### 3.4 Charting Stack (Current)

- **Highcharts core** (`highcharts`) + **React wrapper** (`@highcharts/react`).
- **Highcharts Grid Pro** (`@highcharts/grid-pro`) for Recent Activity grid.
- Shared chart helpers (`/frontend/src/components/ui/highcharts.tsx`):
  - `DashboardHighchart`
  - `createBaseChartOptions`
  - `createSparklineOptions`
  - `mergeSeriesColors`
  - one palette helper `chartColor`.
- Highcharts module init with guard (`/frontend/src/lib/highcharts-init.ts`) for `highcharts-more`.

### 3.5 Current Chart Palette

In order (primary to 5th):

1. `#8087E8`
2. `#A3EDBA`
3. `#F19E53`
4. `#6699A1`
5. `#E1D369`

Applied in `/frontend/src/app/globals.css` and in chart config fallback palette.

---

## 4. Backend Scope

### 4.1 Backend Service

- Express server (`/backend/src/server.ts`) with:
  - `helmet()` security headers.
  - `cors()` enabled.
  - JSON parsing.
  - health endpoint and protected `/api/*` routes.

### 4.2 Backend Endpoints

- `GET /health`
- `GET /api/overview/kpis`
- `GET /api/sales/monthly`
- `GET /api/sales/yearly`
- `GET /api/revenue-streams`

All `/api/*` endpoints require `x-internal-api-key`.

### 4.3 S3 Data Access

- Implemented in `/backend/src/s3.ts`:
  - Reads objects from `S3_BUCKET` and `AWS_REGION`.
  - Validates JSON with Zod schemas.
  - Normalizes errors to structured `DataSourceError` types:
    - missing object/body
    - malformed JSON
    - invalid payload
    - S3 unavailable.

### 4.4 Payload Contracts

Shared schema shape on backend and frontend (`contracts.ts` in each app):

- `kpiPayloadSchema`
- `chartPayloadSchema`
- strict datetime (`asOf`) and numeric validation.

---

## 5. Data Flow (Current vs Target)

### 5.1 Current Live Flow

1. Browser loads frontend route.
2. Frontend page requests `GET /api/dashboard/summary`.
3. Next.js route reads local files from `/dummy data`.
4. Route transforms raw data to dashboard summary.
5. UI renders charts/cards from this summary.

### 5.2 Target Production Flow

1. Browser loads frontend route.
2. Frontend route (or server functions) calls backend endpoints.
3. Backend reads from S3 bucket keys under `dashboard/*`.
4. Backend validates payloads, returns normalized JSON.
5. Frontend builds and serves summary to UI.

---

## 6. Security Posture (Current)

### 6.1 Implemented

- Backend:
  - `helmet()` enabled.
  - Internal API key required on `/api/*`.
  - Structured error responses with request IDs.
  - No-store on backend response payloads.

- Frontend server route:
  - Input/output schema validation via Zod.
  - Controlled cache headers.
  - Request-level error handling and logging.

### 6.2 Gaps / Risks to Address

- Frontend currently uses local dummy data; production backend path is prepared but not active.
- `cors()` uses default open behavior (not restricted origin list yet).
- No user authentication/authorization layer for dashboard UI yet.
- No rate limiting / abuse protection middleware on backend endpoints yet.
- Secrets handling needs environment hardening before production:
  - rotate keys, managed secret store, least-privilege IAM.
- Root `.env.example` includes auth-related variables not currently wired into running code.

---

## 7. Quality and Testing

### 7.1 Frontend

- Lint: `npm run lint`
- Unit tests: `npm run test`
  - Contract schema tests.
  - Dashboard summary transformation tests.
- Build: `npm run build`

### 7.2 Backend

- Build available: `npm run build`
- No dedicated backend lint/test pipeline configured yet.

---

## 8. In-Scope vs Out-of-Scope (Current Snapshot)

### In Scope (Implemented)

- 3 dashboard pages with charted analytics views.
- Highcharts migration across dashboard visualizations.
- Highcharts Grid Pro for Recent Activity table.
- Intuitive date range picker UI component.
- Frontend summary API using dummy data.
- Backend S3 service and protected internal analytics endpoints.

### Out of Scope (Not Yet Implemented)

- End-to-end production wiring from frontend summary route to backend API.
- S3 bucket policy/IAM finalization and production secret management.
- Real downloadable report files in Reports tab (currently frontend-only placeholders).
- Full auth/RBAC for end users.
- Observability stack (central logs, metrics, tracing).
- CI/CD automation and deployment runbooks.

---

## 9. Immediate Next Step (S3 Integration Phase)

To move from demo mode to production data mode, connect frontend summary generation to backend APIs:

1. Enable frontend use of `BACKEND_BASE_URL` + `INTERNAL_API_KEY`.
2. Replace dummy-data loading path in `/frontend/src/app/api/dashboard/summary/route.ts` with backend fetch functions.
3. Confirm backend can read required S3 keys:
   - `dashboard/overview/kpis.json`
   - `dashboard/sales/monthly.json`
   - `dashboard/sales/yearly.json`
   - optionally `dashboard/revenue-streams.json`
4. Validate schema and freshness with real objects.
5. Lock down CORS and API-key handling for deployment environment.

---

## 10. Run Commands

### Backend

```bash
cd /Users/jamesm/projects/backend_compass_v2/backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd /Users/jamesm/projects/backend_compass_v2/frontend
cp .env.example .env.local
npm install
npm run dev
```

---

## 11. Key Files Reference

- Root overview: `/Users/jamesm/projects/backend_compass_v2/README.md`
- Frontend overview: `/Users/jamesm/projects/backend_compass_v2/frontend/README.md`
- Backend overview: `/Users/jamesm/projects/backend_compass_v2/backend/README.md`
- Frontend summary API: `/Users/jamesm/projects/backend_compass_v2/frontend/src/app/api/dashboard/summary/route.ts`
- Summary builder: `/Users/jamesm/projects/backend_compass_v2/frontend/src/lib/dashboard-summary.ts`
- Dummy data loader: `/Users/jamesm/projects/backend_compass_v2/frontend/src/lib/dummy-dashboard-data.ts`
- Backend API server: `/Users/jamesm/projects/backend_compass_v2/backend/src/server.ts`
- Backend S3 reader: `/Users/jamesm/projects/backend_compass_v2/backend/src/s3.ts`
- Shared frontend chart wrapper: `/Users/jamesm/projects/backend_compass_v2/frontend/src/components/ui/highcharts.tsx`
- Highcharts Grid wrapper: `/Users/jamesm/projects/backend_compass_v2/frontend/src/components/ui/highcharts-grid-pro.tsx`
