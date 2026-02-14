# Backend Compass V2

Repository is split into two top-level projects:

- `frontend/` - Next.js dashboard app (UI + dashboard summary API for backend data)
- `backend/` - Express service (reads S3 JSON and serves internal API endpoints)

## Quick Start

1. Start backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

2. Start frontend in a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` and should point to backend via `BACKEND_BASE_URL`.
