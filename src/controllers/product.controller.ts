import { Request, Response } from 'express';
import { z } from 'zod';
import * as productService from '@/services/product.service';
import { AuthRequest } from '@/types';

function handleError(res: Response, error: unknown): void {
  const err = error as { status?: number; message?: string };
  res.status(err.status ?? 500).json({ error: err.message ?? 'Error interno' });
}

const createSchema = z.object({
  name: z.string().min(1),
  image_url: z.string().optional(),
  tier: z.enum(['Común', 'Raro', 'Épico', 'Legendario']),
  theme: z.string().min(1),
});

const updateSchema = createSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const productController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (e) {
      handleError(res, e);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.getProductById(req.params['id'] as string);
      res.status(200).json(product);
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
      const product = await productService.createProduct(parsed.data);
      res.status(201).json(product);
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
      const product = await productService.updateProduct(req.params['id'] as string, parsed.data);
      res.status(200).json(product);
    } catch (e) {
      handleError(res, e);
    }
  },

  async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await productService.removeProduct(req.params['id'] as string);
      res.status(204).send();
    } catch (e) {
      handleError(res, e);
    }
  },
};
