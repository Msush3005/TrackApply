# Job Application Tracker — Backend (Express)

This folder contains the Express backend skeleton.

Commands:
- Install: `npm install` (run inside `/backend`)
- Dev: `npm run dev` (nodemon)

Notes:
- Database helper (`src/config/db.js`) is included and wired into the server.
- Authentication endpoints for signup, login, and logout have been added (placeholders follow best practices).
- No other business logic implemented — auth only.

API Endpoints (Auth)
- POST /api/auth/signup — { name, email, password } creates user, sets httpOnly cookie
- POST /api/auth/login — { email, password } issues httpOnly cookie
- POST /api/auth/logout — clears auth cookie

API Endpoints (Placement Applications)
- POST /api/placements — Create placement (protected). Body: { companyName, role, notes?, appliedDate? }
- GET /api/placements — Get all placements for the logged-in user (protected)
- GET /api/placements/analytics — Get analytics for the logged-in user: total applications and counts grouped by status (protected)
- PUT /api/placements/:id — Update placement's `status` and/or `notes` (protected, owner-only)
- DELETE /api/placements/:id — Delete placement (protected, owner-only)

Security & Notes:
- Passwords are hashed using bcryptjs.
- JWT is stored in an httpOnly cookie named `token`. Cookie options can be tuned with env vars: `COOKIE_SAMESITE`, `COOKIE_SECURE`, and `COOKIE_DOMAIN` (see `.env.example`).
- For cross-site deployments (frontend and backend on different domains) set `COOKIE_SAMESITE=none` and `COOKIE_SECURE=true` and ensure HTTPS is used.
- Input validation is enforced using `express-validator` and centralized via `middleware/validate.js`.
- Additional protections included:
  - `helmet` for secure headers
  - `express-mongo-sanitize` to prevent NoSQL injection
  - `xss-clean` to sanitize user input against XSS
  - `hpp` to prevent HTTP parameter pollution
  - `compression` for response compression
- Rate limiting is applied to auth routes with a stricter limiter on login to mitigate credential stuffing.
- Centralized error handling is available in `middleware/errorHandler.js` and all controllers forward unexpected errors to this handler.
