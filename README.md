# 1. Clone
git clone https://github.com/crackedhandle/dialysis-dashboard.git
cd dialysis-dashboard

# 2. Backend: install, seed, run
cd backend
npm install
# create .env (see below)
npm run seed
npm run dev

# 3. Frontend: install and run
cd ..\frontend
npm install
npm run dev

# Open in browser:
# Backend OpenAPI: http://localhost:5000/docs
# Frontend:          http://localhost:5173

dialysis-dashboard/
├─ backend/                # Express + TypeScript API
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ clinical.config.ts
│  │  ├─ domain/           # mongoose models (patient, session, schedule)
│  │  ├─ routes/           # patient.routes.ts, schedule.routes.ts, session.routes.ts
│  │  ├─ services/         # anomaly.service.ts (business logic)
│  │  ├─ seed.ts
│  │  ├─ app.ts
│  │  └─ server.ts
│  ├─ package.json
│  └─ tests/               # jest tests (anomaly + api)
├─ frontend/               # Vite + React + TypeScript UI
│  ├─ src/
│  │  ├─ components/
│  │  ├─ api/client.ts     # axios client
│  │  ├─ types/types.ts
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ package.json
│  └─ vitest.config.ts     # UI tests
├─ README.pdf              # project summary (same content)
└─ README.md               # this file

# backend/.env
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/dialysis?retryWrites=true&w=majority"
PORT=5000
backened --commands(Powerswhell)
cd C:\path\to\dialysis-dashboard\backend

# install
npm install

# seed example data (uses seed.ts)
npm run seed

# dev server (hot reload)
npm run dev
# (server listens on port 5000 by default)

feontened commands(powershell)
cd C:\path\to\dialysis-dashboard\frontend

# install
npm install

# run dev UI
npm run dev
# (vite server on port 5173)

API docs

Swagger UI is available after starting backend:
http://localhost:5000/docs

You can test endpoints from the Swagger page or via cURL / PowerShell:
Invoke-RestMethod "http://localhost:5000/schedule/today?unitId=U1" | ConvertTo-Json -Depth 6

Minimal API reference

GET /health — simple health-check

GET /schedule/today?unitId=U1 — returns today's schedule for unit U1

POST /sessions — create a dialysis session

#post/sessions --body(example)
{
  "patientId": "69a3e480493547850cfc773c",
  "unitId": "U1",
  "startTime": "2026-03-01T07:02:25.437Z",
  "endTime": "2026-03-01T11:02:25.437Z",
  "preWeightKg": 74,
  "postWeightKg": 69,
  "systolicBP": 170,
  "diastolicBP": 90,
  "machineId": "M1"
}

## Clinical assumptions & configuration
All thresholds are explicit, centralized in:
backend/src/config/clinical.config.ts

# Example
export const ClinicalConfig = {
  // maximum allowed interdialytic weight gain (percentage of dry weight)
  maxInterdialyticGainPercent: 5,         // 5%

  // high post-dialysis systolic blood pressure threshold (mmHg)
  maxPostDialysisSystolicBP: 160,         // 160 mmHg

  // target session duration (minutes) and tolerance
  targetDurationMinutes: 240,             // 4 hours
  durationTolerancePercent: 0.25,         // +/- 25% => allowed: 180 - 300 minutes
};

## Small dataset / seed script

Seed script: `backend/src/seed.ts` — run the following inside the `backend` folder:
What it creates:
## Small dataset / seed script

Seed script: `backend/src/seed.ts` — run the following inside the `backend` folder:

```bash
npm run seed
```
What it creates:

- Patients:
  - Rahul Sharma
  - Anita Verma
- Schedule entries for today with `unitId = U1`
- One session for Rahul that includes anomalies:
  - Excess interdialytic weight gain
  - High post-dialysis systolic BP

To re-seed later (reset + regenerate sample data), run again:
High post-dialysis systolic BP

To re-seed later (reset + regenerate sample data), run again:
npm run seed
# Architecture overview (one page)

**Goals:** a small, testable, event-driven monitoring system with clear separation of concerns and a single source of truth for clinical logic.

## Layers / Components

- **Domain Models (Mongoose)**
  - `Patient`
  - `Session`
  - `ScheduleEntry`

- **Service Layer**
  - `anomaly.service` — deterministic, pure logic that produces anomaly objects from session inputs and clinical config
  - Unit-testable and isolated from I/O

- **API Layer (Express + TypeScript)**
  - Routes: `/patients`, `/schedule`, `/sessions`
  - JSON responses consumed by frontend

- **Frontend (React + Vite + TypeScript)**
  - Fetches `/schedule/today`
  - Displays scheduled patients and sessions
  - Highlights anomalies
  - Provides modal to create new sessions

- **OpenAPI / Swagger**
  - Auto-exposed at `/docs` for manual testing and documentation
 ASCII diagram

[Browser UI (Vite React)] <--axios--> [Express API (backend)]
        |                                         |
        |                                         v
        |                                   [Mongoose Models]
        |                                         |
        v                                         v
   Session Modal  --POST /sessions-->  detectAnomalies() -> Session document (with anomalies)

   ## Key design decision

- **Anomaly detection is server-side** (single source of truth). Implemented as a pure function in the service layer so it is:
  - Config-driven (no magic numbers in code)
  - Easy to unit test
  - Reusable by any client or automation
- The **frontend is a thin presentation & control layer** that calls the API and renders results.

---

## Known limitations

1. Authentication / authorization not implemented.
2. No role-based access control (nurse vs admin).
3. UI is intentionally simple:
   - No advanced routing
   - No global state management beyond local state
4. No persistence of audit logs for session edits.
5. No background worker for derived metrics, reports or scheduled jobs.
6. No pagination for large schedules; may need pagination or cursoring for scale.

---

## What I would do next (roadmap / improvements)

1. **Security & Access Control**
   - Add JWT-based authentication.
   - Add role-based access control (RBAC) for nurses, admins, auditors.
2. **Resilience & UX**
   - Implement optimistic UI for session creation and improved error recovery.
   - Add frontend validation & better form UX (toasts, inline errors).
3. **CI / Quality**
   - Add GitHub Actions pipeline to run tests and lint on every PR.
   - Add static analysis and test coverage reporting.
4. **Deployment & Dev Experience**
   - Add Dockerfiles and a single `docker-compose.yml` for local dev and CI.
   - Provide a short deployment guide (Render / Railway / Vercel).
5. **Observability & Monitoring**
   - Add structured logging (Pino/Winston) and request tracing.
   - Hook up error monitoring (Sentry) for production.
6. **Scaling & Analytics**
   - Add background workers (e.g., Bull/Redis) for heavy analytics and report generation.
   - Add DB indexes (patientId, scheduledDate, unitId) and pagination for schedule endpoints.
7. **Testing**
   - Expand E2E tests with Cypress (cover create session, anomaly flows).
   - Increase unit test coverage for edge cases in anomaly detection.
8. **Product Features**
   - Add audit log for session changes and user actions.
   - Add notifications (email/SMS) or in-app alerts for critical anomalies.
9.  **Output and Media**
   - **screenshots(frontened/ output)**
   - <img width="1526" height="749" alt="image" src="https://github.com/user-attachments/assets/d0d3c20e-c8db-4d22-8000-82257bb18cb2" />
     -output2
   <img width="1426" height="561" alt="image" src="https://github.com/user-attachments/assets/9e11197f-d9a8-4b27-918e-9bfcd24186e2" />

   **Apidocumentation(Swagger)**
   <img width="1912" height="844" alt="image" src="https://github.com/user-attachments/assets/85ecb87e-147e-4086-83ea-674c45838d4b" />
   -**backened triggering video**
   - https://github.com/user-attachments/assets/735d760e-21b0-42c6-a44c-fbfeef864d89

     ## Example git & release workflow (recommended)

Use small atomic commits while developing:
```bash
git add .
git commit -m "feat(backend): add anomaly detection logic + tests"
git commit -m "feat(seed): add example seed data for U1 unit"
git commit -m "feat(frontend): initial dashboard and session modal"
```

When ready:
```bash
git tag v1.0
git push origin main --tags
```





  
