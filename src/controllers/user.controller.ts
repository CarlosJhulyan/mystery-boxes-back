import { Response } from 'express';
import { z } from 'zod';
import * as userService from '@/services/user.service';
import { AuthRequest } from '@/types';

function handleError(res: Response, error: unknown): void {
  const err = error as { status?: number; message?: string };
  res.status(err.status ?? 500).json({ error: err.message ?? 'Error interno' });
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});

export const userController = {
  async register(req: AuthRequest, res: Response): Promise<void> {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() });
      return;
    }
    try {
      const user = await userService.register(parsed.data.name, parsed.data.email, parsed.data.password);
      res.status(201).json(user);
    } catch (e) {
      handleError(res, e);
    }
  },

  async login(req: AuthRequest, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() });
      return;
    }
    try {
      const result = await userService.login(parsed.data.email, parsed.data.password);
      res.status(200).json(result);
    } catch (e) {
      handleError(res, e);
    }
  },

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    try {
      const user = await userService.getProfile(req.user.userId);
      res.status(200).json(user);
    } catch (e) {
      handleError(res, e);
    }
  },

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() });
      return;
    }
    try {
      const user = await userService.updateProfile(req.user.userId, parsed.data);
      res.status(200).json(user);
    } catch (e) {
      handleError(res, e);
    }
  },

  async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    try {
      await userService.deleteAccount(req.user.userId);
      res.status(200).json({ message: 'Cuenta eliminada. Tus datos personales han sido borrados.' });
    } catch (e) {
      handleError(res, e);
    }
  },
};
