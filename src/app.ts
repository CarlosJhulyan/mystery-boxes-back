import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { router } from '@/routes';
import { swaggerSpec } from '@/config/swagger';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { env } from '@/config/env';

const app: import("express").Express = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],  // needed for swagger-ui
        scriptSrc: ["'self'", "'unsafe-inline'"],  // needed for swagger-ui
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── Rate limiting ─────────────────────────────────────────────────────────────
// General: 120 req / 1 min per IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta en un momento.' },
});

// Auth: 10 attempts / 15 min per IP (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, intenta en 15 minutos.' },
  skipSuccessfulRequests: true,
});

app.use(generalLimiter);
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/register', authLimiter);

// ─── Request parsing ──────────────────────────────────────────────────────────
app.use(compression() as express.RequestHandler);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Logging (solo en dev) ────────────────────────────────────────────────────
if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Swagger (solo en dev) ────────────────────────────────────────────────────
if (env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;
