import { createHmac, timingSafeEqual } from 'crypto';
import { Request, Response } from 'express';
import { createPreference, getPaymentStatus } from '@/services/payment.service';
import { confirmOrderByKey, cancelOrderByKey } from '@/services/order.service';
import { logger } from '@/config/logger';
import { env } from '@/config/env';

/**
 * Verifica la firma HMAC-SHA256 que MercadoPago envía en el header x-signature.
 * Formato: "ts=<timestamp>,v1=<hex_hmac>"
 * Manifest firmado: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 */
function verifyMpSignature(req: Request, paymentId: string): boolean {
  const secret = env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // si no hay secret configurado, saltar (dev sin configurar)

  const xSignature = req.headers['x-signature'] as string | undefined;
  const xRequestId = req.headers['x-request-id'] as string | undefined;

  if (!xSignature || !xRequestId) {
    logger.warn({ xSignature, xRequestId }, 'Webhook sin headers de firma');
    return false;
  }

  // Extraer ts y v1 del header "ts=...,v1=..."
  const parts = Object.fromEntries(xSignature.split(',').map((p) => p.split('=')));
  const ts = parts['ts'];
  const v1 = parts['v1'];

  if (!ts || !v1) {
    logger.warn({ xSignature }, 'Header x-signature con formato inválido');
    return false;
  }

  const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

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
   * Recibe notificaciones de MercadoPago. Siempre retorna 200 para evitar reintentos.
   */
  async webhook(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;

      if (body.type === 'payment') {
        const paymentId = String(body.data?.id ?? '');
        if (paymentId) {
          if (!verifyMpSignature(req, paymentId)) {
            logger.warn({ paymentId }, 'Webhook rechazado: firma inválida');
            res.status(200).json({ received: true });
            return;
          }

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
          } else if (
            (status.status === 'rejected' || status.status === 'cancelled') &&
            status.external_reference
          ) {
            const order = await cancelOrderByKey(status.external_reference);
            if (order) {
              logger.info({ orderId: order.id, mpStatus: status.status }, 'Orden cancelada por pago rechazado');
            }
          }
        }
      }
    } catch (error) {
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
