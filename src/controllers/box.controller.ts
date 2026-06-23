import { Request, Response } from 'express';
import { z } from 'zod';
import * as boxService from '@/services/box.service';
import { AuthRequest } from '@/types';

function handleError(res: Response, error: unknown): void {
  const err = error as { status?: number; message?: string };
  res.status(err.status ?? 500).json({ error: err.message ?? 'Error interno' });
}

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image_url: z.string().url().optional(),
  theme: z.string().min(1),
  rarity: z.string().min(1),
});

const updateSchema = createSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const boxController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { theme, rarity } = req.query as { theme?: string; rarity?: string };
      const boxes = await boxService.getAllBoxes({ theme, rarity });
      res.status(200).json(boxes);
    } catch (e) {
      handleError(res, e);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const box = await boxService.getBoxById(req.params['id'] as string);
      res.status(200).json(box);
    } catch (e) {
      handleError(res, e);
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() });
      return;
    }
    try {
      const box = await boxService.createBox(parsed.data);
      res.status(201).json(box);
    } catch (e) {
      handleError(res, e);
    }
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() });
      return;
    }
    try {
      const box = await boxService.updateBox(req.params['id'] as string, parsed.data);
      res.status(200).json(box);
    } catch (e) {
      handleError(res, e);
    }
  },

  async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await boxService.removeBox(req.params['id'] as string);
      res.status(204).send();
    } catch (e) {
      handleError(res, e);
    }
  },
};
