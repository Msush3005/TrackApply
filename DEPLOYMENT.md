Deployment Guide — Job Application Tracker

Overview
- Frontend: Next.js (deploy to Vercel)
- Backend: Express (deploy to Render, Railway, or similar)
- Database: MongoDB Atlas

Quick checklist
1. Create a MongoDB Atlas cluster and obtain the connection string (replace <password>, <dbname>). Copy the resulting connection URI.
2. Add environment variables in each hosting platform (see mapping below).
3. Deploy backend service and use its URL as the frontend API base (set as `NEXT_PUBLIC_API_URL` on Vercel).
4. Configure cookie settings for cross-site cookies if backend and frontend are on different domains.

Environment variables (required)
- MONGODB_URI — MongoDB Atlas connection string
- JWT_SECRET — strong secret for signing tokens
- JWT_EXPIRES_IN — (optional) e.g. '7d'
- PORT — (backend) defaults to 4000
- FRONTEND_URL — (backend) e.g. https://your-frontend.vercel.app (used for CORS)
- NEXT_PUBLIC_API_URL — (frontend) e.g. https://your-backend.onrender.com

Cookie & cross-site notes
- Browsers require `SameSite=None` and `Secure` for cross-site cookies. If your frontend and backend are on different domains (e.g., Vercel + Render), set:
  - COOKIE_SAMESITE=none
  - COOKIE_SECURE=true
  - Ensure your backend is served over HTTPS.
- Optionally set COOKIE_DOMAIN to scope cookies to a parent domain (e.g., .example.com) if both services are subdomains.

Vercel — Frontend
1. In your Vercel dashboard, import the `frontend/` folder or connect the monorepo and set the project root to `/frontend`.
2. Set build command: `npm run build` (Vercel detects Next automatically).
3. Set the environment variable `NEXT_PUBLIC_API_URL` to your backend URL (e.g., `https://api-yourapp.onrender.com`).
4. Deploy.

Render — Backend (example)
1. Create a new Web Service on Render and connect your repository.
2. Set the root to the repository root and the start command to `npm start --prefix backend` or let Render run `npm start` in the backend folder.
   - Example start command: `cd backend && npm install && npm start`
3. Set the required environment variables in the Render dashboard (MONGODB_URI, JWT_SECRET, FRONTEND_URL, COOKIE_SAMESITE, COOKIE_SECURE).
4. Deploy. Render provides an HTTPS URL you can use as `NEXT_PUBLIC_API_URL` on Vercel.

Railway — Backend (alternative)
1. Create a new project and link the repo.
2. Add service pointing to backend; set the `start` command to `npm start` in the `backend` folder.
3. Add the same environment variables as above.

Testing after deploy
- Sign up / log in from the frontend; check that the httpOnly cookie is set (in browser devtools -> Application -> Cookies).
- If cookies are not being set during cross-site requests, ensure:
  - backend `COOKIE_SAMESITE=none`
  - backend `COOKIE_SECURE=true`
  - requests use `credentials: 'include'` (already implemented in frontend lib)
  - both frontend and backend are served over HTTPS

Troubleshooting
- CORS errors: ensure `FRONTEND_URL` on the backend matches the URL served by Vercel and `credentials: true` is enabled.
- MongoDB connection: verify IP access list in Atlas (allow 0.0.0.0/0 for quick testing or specific IPs for production).

Security notes
- Keep `JWT_SECRET` secret and rotate if compromised.
- Use strong, unique secrets; consider using a secrets manager.
- Use TLS (HTTPS) everywhere in production.

If you want, I can:
- Add a `vercel.json` with redirects or rewrites if you want serverless (optional), or
- Add a Render `render.yaml` template to the repo for a one-click deploy.

Deployment templates added
- `render.yaml` — a minimal Render template to deploy both backend and frontend. It contains placeholder env vars you should set in Render's dashboard (do NOT commit secrets).
- `railway.env.example` — variables you can paste into Railway's project settings.

Note: For security, these templates do not include secret values. Always set secrets directly in the host's dashboard or use a secrets manager.