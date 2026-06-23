import { Request, Response, NextFunction } from 'express';
import { logger } from '@/config/logger';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  logger.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
