# Job Application Tracker (Monorepo) ✅

A lightweight, secure Job Application Tracker built for students and job-seekers.
This repository contains a Next.js frontend and an Express + MongoDB backend with JWT-based authentication using httpOnly cookies.

---

## 🚀 Project overview

The app helps users track placement applications, statuses (Applied / Interview / Rejected / Offer), notes, and dates. It includes authentication, CRUD APIs for placement applications, analytics (status distribution), and a responsive dashboard with charts.

---

## ✨ Features

- User signup / login / logout with JWT in httpOnly cookies
- Create, read, update and delete placement applications (owner-only)
- Analytics endpoint: total applications and counts grouped by status (MongoDB aggregation)
- Responsive dashboard (Next.js + Tailwind) with charts (Chart.js)
- Input validation, sanitization, rate limiting, and centralized error handling

---

## 🧰 Tech stack

- Frontend: Next.js (App Router), React, Tailwind CSS, Chart.js
- Backend: Node.js, Express.js, Mongoose (MongoDB Atlas)
- Auth: JWT stored in httpOnly cookies
- Dev / Deploy: Vercel (frontend), Render/Railway (backend), MongoDB Atlas

---

## 💻 Local setup (development)

1. Clone the repo:

```bash
git clone <repo-url> job-application-tracker
cd job-application-tracker
```

2. Copy the example env file and set values:

```bash
cp .env.example .env
# Edit .env and fill in MONGODB_URI, JWT_SECRET, FRONTEND_URL, NEXT_PUBLIC_API_URL, etc.
```

3. Start services in separate terminals:

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

Frontend runs at http://localhost:3000 and backend at http://localhost:4000 by default.

---

## 🔑 Environment variables

Use `.env.example` as the source of truth. Important variables include:

- Backend
  - `MONGODB_URI` — MongoDB Atlas connection string
  - `JWT_SECRET` — secret for signing tokens
  - `JWT_EXPIRES_IN` — token lifetime (e.g., `7d`)
  - `FRONTEND_URL` — e.g., `http://localhost:3000` (for CORS)
  - `COOKIE_SAMESITE`, `COOKIE_SECURE`, `COOKIE_DOMAIN` — cookie behavior for deployments
  - `AUTH_RATE_LIMIT_MAX`, `LOGIN_RATE_LIMIT_MAX` — rate limiting
- Frontend
  - `NEXT_PUBLIC_API_URL` — base URL for backend API (e.g., `http://localhost:4000`)

---

## 🔌 API routes

Authentication:

- POST `/api/auth/signup` — Create user
  - Body: `{ name, email, password }`
  - Success: sets httpOnly `token` cookie and returns user

- POST `/api/auth/login` — Login
  - Body: `{ email, password }`
  - Success: sets httpOnly `token` cookie and returns user

- POST `/api/auth/logout` — Logout (protected)
  - Clears cookie

- GET `/api/auth/me` — Get current user (protected)

Placement Applications (protected, require auth cookie):

- POST `/api/placements` — Create placement
  - Body: `{ companyName, role, notes?, appliedDate? }`

- GET `/api/placements` — List user's placements

- GET `/api/placements/analytics` — Returns `{ total, byStatus }` aggregated per user

- PUT `/api/placements/:id` — Update status/notes (owner-only)
  - Body: `{ status?, notes? }`

- DELETE `/api/placements/:id` — Delete placement (owner-only)

Notes:
- All protected routes require the httpOnly `token` cookie to be present (server uses it to verify JWT).
- Server validates and sanitizes inputs; errors are returned as JSON.

---

## 🧪 Testing & Security

- Validation is implemented using `express-validator` and centralized via middleware.
- Security middlewares: `helmet`, `express-mongo-sanitize`, `xss-clean`, `hpp`.
- Rate limiting is applied to authentication routes.

---

## 📦 Deployment

See `DEPLOYMENT.md` for step-by-step instructions to deploy the frontend to Vercel and the backend to Render or Railway, plus cookie / SameSite guidance for cross-domain setups.

---

## 🖼️ Screenshots (placeholders)

- Dashboard: `./screenshots/dashboard.png` (placeholder)
- Signup / Login: `./screenshots/auth.png` (placeholder)
- Analytics chart: `./screenshots/analytics.png` (placeholder)

> Tip: Add real screenshots in the `screenshots/` folder before publishing.

---

## 🤝 Contributing

Contributions welcome — open issues or PRs. Please follow standard git workflows and keep changes small and focused.

---

## 📜 License

MIT — see `LICENSE` (add if desired).

