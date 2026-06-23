import { Request, Response, NextFunction } from 'express';
import { logger } from '@/config/logger';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  logger.error(err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: isProd ? 'Error interno del servidor' : String(err),
  });
}
