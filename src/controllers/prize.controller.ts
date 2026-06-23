import { Request, Response } from 'express';
import * as prizeService from '@/services/prize.service';

function handleError(res: Response, error: unknown): void {
  const err = error as { status?: number; message?: string };
  res.status(err.status ?? 500).json({ error: err.message ?? 'Error interno' });
}

export const prizeController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query['limit'] ? Number(req.query['limit']) : 50;
      const prizes = await prizeService.getPublicPrizeHistory(limit);
      res.status(200).json(prizes);
    } catch (e) {
      handleError(res, e);
    }
  },

  async getByBox(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query['limit'] ? Number(req.query['limit']) : 50;
      const prizes = await prizeService.getPrizeHistoryByBox(req.params['id'] as string, limit);
      res.status(200).json(prizes);
    } catch (e) {
      handleError(res, e);
    }
  },
};
