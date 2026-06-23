import { Request, Response } from 'express';
import { z } from 'zod';
import * as adminService from '@/services/admin.service';

function handleError(res: Response, error: unknown): void {
  const err = error as { status?: number; message?: string };
  res.status(err.status ?? 500).json({ error: err.message ?? 'Error interno' });
}

const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin']),
});

export const adminController = {
  async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json(users);
    } catch (e) {
      handleError(res, e);
    }
  },

  async updateUserRole(req: Request, res: Response): Promise<void> {
    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Rol inválido. Usa: user | admin' });
      return;
    }
    try {
      const user = await adminService.updateUserRole(req.params['id'] as string, parsed.data.role);
      res.status(200).json(user);
    } catch (e) {
      handleError(res, e);
    }
  },
};
