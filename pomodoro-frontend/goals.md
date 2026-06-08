# Low handing fruits 
1. Centralize API URL — create src/config.js with const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080'.
2. Wire login to API calls — after login, send Authorization: Bearer ${token} (or keep using a header, but consistently) on every pomodoro fetch.
3. Show logged-in state — display email/username in the navbar when a token exists.
4. Persist focus duration in localStorage — so settings survive refresh.
5. Add a “Skip break” button — calls cancel + advances streak (small feature, good practice).
6. Fix frontend test — render Timer and assert “Pomodoro Timer” or “Start” appears.
7. Add a root README — how to run backend (mvn spring-boot:run) and frontend (npm start), test credentials (alice@example.com / password123).


# Must-Haves (Harder, But Required for “Real” Software)
These are non-negotiable for production, even if they take longer:

1. Real authentication end-to-end
JWT filter that validates token on protected routes.
Remove permitAll() on pomodoro endpoints (except maybe health check).
Associate sessions with the logged-in user, not a default header.
Registration flow (even a simple one).

2. Persistent database
Replace H2 in-memory with PostgreSQL (or similar) for production.
Use Spring profiles: dev (H2) vs prod (Postgres).
Add database migrations (Flyway or Liquibase) so schema changes are tracked.

3. Environment & secrets
JWT_SECRET from environment variables, never committed.
Frontend REACT_APP_API_URL for production API URL.
Separate application-prod.properties.

4. Deployment pipeline
Backend: Docker image → Railway / Render / Fly.io / AWS.
Frontend: npm run build → Vercel / Netlify / Cloudflare Pages, or serve static files from Spring Boot.
HTTPS everywhere.

5. Error handling & resilience
Frontend: user-visible messages when API fails (not just console.log).
Backend: validate request bodies (@Valid on controller params).
Handle edge cases: double-click Start, tab closed mid-session, clock drift.

6. Testing you can trust
Fix integration tests to match current API contract.
Add tests for pause/resume/complete flows.
Optional: one E2E test (Playwright) for “start timer → pause → resume → complete”.

7. Security basics
Rate limiting on login.
CORS restricted to your production domain (not *).
CSRF strategy if using cookies; if JWT in header, document that choice.

8. Documentation
API docs (Swagger/OpenAPI is one @Configuration away in Spring).
User-facing: what the app does, how Pomodoro cycles work.


# Roadmap: From Prototype → Deployable Product

## Phase 0 — Stabilize (1–2 weeks)
Goal: App works reliably on your machine.


- [ ] Fix bugs listed above (catch, null timer, time units aligned on server)
- [ ] Connect login token to all API calls
- [ ] Remove dead code; add root README
- [ ] Fix backend integration tests
- [ ] Align sessionTime units (recommend seconds everywhere, convert in one place if needed)

## Phase 1 — Complete core Pomodoro UX (1–2 weeks)
Goal: Feels like a finished timer app.


- [ ] Session indicator (“Focus 2 of 4 before long break”)
- [ ] Configurable break / long-break durations (not only focus)
- [ ] Skip break / skip to next session
- [ ] Mute sounds toggle
- [ ] Responsive layout (mobile-friendly clock)
- [ ] Loading & error UI
- [ ] Persist user preferences (localStorage or backend)

## Phase 2 — Auth & users (2–3 weeks)
Goal: Multiple users, each with their own sessions.


- [ ] JWT validation filter
- [ ] Register endpoint + UI
- [ ] Protect all /api/pomodoro/** routes
- [ ] “Logout” clears token
- [ ] Optional: refresh token or session expiry handling

## Phase 3 — Data & history (2 weeks)
Goal: Value beyond a single running timer.


- [ ] Session history endpoint (GET /api/pomodoro/history)
- [ ] Simple stats: pomodoros today, this week, current streak
- [ ] Optional: tasks / labels per focus session

## Phase 4 — Production readiness (2–3 weeks)
Goal: Safe to put on the internet.


- [ ] PostgreSQL + Flyway migrations
- [ ] Spring profiles (dev / prod)
- [ ] Docker Compose for local full stack
- [ ] CI: GitHub Actions runs mvn test + npm test on every push
- [ ] OpenAPI/Swagger docs
- [ ] Health check endpoint (/actuator/health)


## Phase 5 — Deploy (1 week)
Goal: Live URL you can share.


- [ ] Deploy backend (e.g. Render + Postgres)
- [ ] Deploy frontend (e.g. Vercel) with REACT_APP_API_URL
- [ ] Configure CORS for production origin
- [ ] Smoke test: register → login → start pomodoro → refresh page → session still there


## Phase 6 — Nice-to-have polish (ongoing)
PWA (installable app, offline shell)
Dark/light theme toggle
Keyboard shortcuts (Space = pause, etc.)
Pomodoro analytics chart
Email reminders (advanced)