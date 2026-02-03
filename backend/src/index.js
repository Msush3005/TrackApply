const path = require('path');
const dotenv = require('dotenv');

// Try loading .env from backend folder first, otherwise attempt repo root .env
const localEnv = dotenv.config();
if (localEnv.error) {
  const rootEnvPath = path.resolve(__dirname, '../../.env');
  dotenv.config({ path: rootEnvPath });
  console.log(`Loaded environment from ${rootEnvPath}`);
} else {
  console.log('Loaded environment from backend/.env');
}

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 4000;

// Trust proxy if running behind a proxy (e.g., Vercel, Render)
if (process.env.TRUST_PROXY === '1' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Connect DB (no-op if MONGODB_URI not set)
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize()); // remove $ and dots from req.query, req.body, etc.
app.use(xss()); // basic XSS protection on request data
app.use(hpp()); // protect against HTTP parameter pollution
app.use(compression()); // response compression

// Rate limiter (apply to auth routes to mitigate brute-force)
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000), 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10),
  standardHeaders: true,
  legacyHeaders: false,
});

const placementsRoutes = require('./routes/placements');
const errorHandler = require('./middleware/errorHandler');

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/placements', placementsRoutes);

// Root
app.get('/', (req, res) => res.json({ ok: true, message: 'Job Application Tracker API' }));

// Health check (helpful for local debugging)
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Centralized error handler
app.use(errorHandler);

// Process-level handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // In production you might restart the process
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
