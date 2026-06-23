import { Request, Response } from 'express';
import { z } from 'zod';
import * as orderService from '@/services/order.service';
import * as paymentService from '@/services/payment.service';
import { AuthRequest } from '@/types';

function handleError(res: Response, error: unknown): void {
  const err = error as { status?: number; message?: string };
  res.status(err.status ?? 500).json({ error: err.message ?? 'Error interno' });
}

const createSchema = z.object({
  items: z.array(
    z.object({
      box_id: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  guest_email: z.string().email().optional(),
  coupon_code: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

export const orderController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (e) {
      handleError(res, e);
    }
  },

  async getMyOrders(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    try {
      const orders = await orderService.getMyOrders(req.user.userId);
      res.status(200).json(orders);
    } catch (e) {
      handleError(res, e);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const order = await orderService.getOrderById(req.params['id'] as string);
      res.status(200).json(order);
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
      const { order, total, email } = await orderService.createOrder({
        ...parsed.data,
        user_id: req.user?.userId,
      });

      const payer = {
        email: email || order.guest_email || 'comprador@test.com',
        name: 'Cliente',
      };

      const mpItems = order.items.map((item) => ({
        title: item.box.name,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        currency_id: 'PEN' as const,
      }));

      // external_reference uses order_key so confirmOrderByKey can find the order
      const preference = await paymentService.createPreference(mpItems, payer, order.order_key);

      res.status(201).json({ order, preference });
    } catch (e) {
      handleError(res, e);
    }
  },

  async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Estado inválido' });
      return;
    }
    try {
      const order = await orderService.updateOrderStatus(req.params['id'] as string, parsed.data.status);
      res.status(200).json(order);
    } catch (e) {
      handleError(res, e);
    }
  },
};
