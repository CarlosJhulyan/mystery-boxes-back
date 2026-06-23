import { Request, Response } from 'express';
import { z } from 'zod';
import * as couponService from '@/services/coupon.service';
import { AuthRequest } from '@/types';

function handleError(res: Response, error: unknown): void {
  const err = error as { status?: number; message?: string };
  res.status(err.status ?? 500).json({ error: err.message ?? 'Error interno' });
}

const createSchema = z.object({
  code: z.string().min(1).max(32),
  influencer_name: z.string().min(1),
  discount_pct: z.number().min(0).max(100),
  max_uses: z.number().int().positive().nullable().optional(),
  applicable_box_id: z.string().optional(),
  valid_from: z.string().datetime(),
  valid_until: z.string().datetime(),
});

const updateSchema = z.object({
  is_active: z.boolean().optional(),
  max_uses: z.number().int().positive().nullable().optional(),
  valid_until: z.string().datetime().optional(),
});

export const couponController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const coupons = await couponService.getAllCoupons();
      res.status(200).json(coupons);
    } catch (e) {
      handleError(res, e);
    }
  },

  async getByCode(req: Request, res: Response): Promise<void> {
    try {
      const coupon = await couponService.validateCoupon(req.params['code'] as string);
      res.status(200).json({
        code: coupon.code,
        discount_pct: coupon.discount_pct,
        influencer_name: coupon.influencer_name,
        applicable_box_id: coupon.applicable_box_id,
        valid_until: coupon.valid_until,
      });
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
      const coupon = await couponService.createCoupon(parsed.data);
      res.status(201).json(coupon);
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
      const coupon = await couponService.updateCoupon(req.params['id'] as string, parsed.data);
      res.status(200).json(coupon);
    } catch (e) {
      handleError(res, e);
    }
  },

  async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await couponService.removeCoupon(req.params['id'] as string);
      res.status(204).send();
    } catch (e) {
      handleError(res, e);
    }
  },
};
