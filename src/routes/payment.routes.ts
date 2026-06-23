import { Router } from 'express';
import { paymentController } from '@/controllers/payment.controller';

const router: import("express").Router = Router();

/**
 * @openapi
 * tags:
 *   name: Payments
 *   description: Integración con MercadoPago
 */

/**
 * @openapi
 * /payments/preference:
 *   post:
 *     tags: [Payments]
 *     summary: Crear preferencia de pago en MercadoPago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, payer, orderId]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     unit_price:
 *                       type: number
 *                     currency_id:
 *                       type: string
 *                       example: PEN
 *               payer:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Preferencia creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 init_point:
 *                   type: string
 *                 sandbox_init_point:
 *                   type: string
 *                 preference_id:
 *                   type: string
 *       500:
 *         description: Error al crear preferencia
 */
router.post('/preference', paymentController.createPreference);

/**
 * @openapi
 * /payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Webhook de notificaciones de MercadoPago
 *     description: Recibe notificaciones de pago de MercadoPago. Siempre retorna 200.
 *     responses:
 *       200:
 *         description: Notificación recibida
 */
router.post('/webhook', paymentController.webhook);

/**
 * @openapi
 * /payments/status/{paymentId}:
 *   get:
 *     tags: [Payments]
 *     summary: Consultar estado de un pago por ID
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado del pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 status_detail:
 *                   type: string
 *                 external_reference:
 *                   type: string
 *       500:
 *         description: Error al consultar estado
 */
router.get('/status/:paymentId', paymentController.getStatus);

export default router;
