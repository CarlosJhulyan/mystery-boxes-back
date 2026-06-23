import { Request, Response } from 'express';
import { createPreference, getPaymentStatus } from '@/services/payment.service';
import { confirmOrderByKey } from '@/services/order.service';
import { logger } from '@/config/logger';

export const paymentController = {
  /**
   * POST /api/v1/payments/preference
   * Crea una preference de MercadoPago Checkout Pro.
   * Body: { items, payer, orderId }
   */
  async createPreference(req: Request, res: Response): Promise<void> {
    try {
      const { items, payer, orderId } = req.body;
      const result = await createPreference(items, payer, orderId);
      res.status(200).json(result);
    } catch (error) {
      logger.error(error, 'Error al crear preferencia de pago');
      res.status(500).json({ error: 'Error al crear preferencia' });
    }
  },

  /**
   * POST /api/v1/payments/webhook
   * Recibe notificaciones de MercadoPago. Siempre retorna 200.
   */
  async webhook(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;

      if (body.type === 'payment') {
        const paymentId = body.data?.id as string;
        if (paymentId) {
          const status = await getPaymentStatus(paymentId);
          logger.info(
            { paymentId, status: status.status, detail: status.status_detail, orderId: status.external_reference },
            'Webhook MercadoPago recibido'
          );

          if (status.status === 'approved' && status.external_reference) {
            const order = await confirmOrderByKey(status.external_reference);
            if (order) {
              logger.info({ orderId: order.id }, 'Orden confirmada y premios revelados');
            }
          }
        }
      }
    } catch (error) {
      // Loggeamos el error pero siempre respondemos 200 a MP
      logger.error(error, 'Error procesando webhook de MercadoPago');
    }

    res.status(200).json({ received: true });
  },

  /**
   * GET /api/v1/payments/status/:paymentId
   * Consulta el estado de un pago por su ID.
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const paymentId = req.params['paymentId'] as string;
      const result = await getPaymentStatus(paymentId);
      res.status(200).json(result);
    } catch (error) {
      logger.error(error, 'Error al obtener estado de pago');
      res.status(500).json({ error: 'Error al obtener estado del pago' });
    }
  },
};
