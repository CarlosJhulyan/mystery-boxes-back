import { Router } from 'express';
import { orderController } from '@/controllers/order.controller';
import { requireAuth, requireAdmin, optionalAuth } from '@/middlewares/auth.middleware';

const router: import("express").Router = Router();

/**
 * @openapi
 * tags:
 *   name: Orders
 *   description: Gestión de pedidos
 */

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Listar todos los pedidos (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       403:
 *         description: Solo administradores
 */
router.get('/', requireAuth, requireAdmin, orderController.getAll);

/**
 * @openapi
 * /orders/me:
 *   get:
 *     tags: [Orders]
 *     summary: Mis pedidos (usuario autenticado)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       401:
 *         description: No autenticado
 */
router.get('/me', requireAuth, orderController.getMyOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del pedido con items y premios revelados
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', orderController.getById);

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crear un pedido
 *     description: Crea el pedido y devuelve la URL de pago de MercadoPago. Soporta guest checkout.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [box_id, quantity]
 *                   properties:
 *                     box_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               guest_email:
 *                 type: string
 *                 format: email
 *                 description: Requerido si no hay token JWT
 *               coupon_code:
 *                 type: string
 *                 example: GAMER2026
 *     responses:
 *       201:
 *         description: Pedido creado con URL de pago
 *       400:
 *         description: Datos inválidos o caja no disponible
 */
router.post('/', optionalAuth, orderController.create);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Actualizar estado del pedido (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Estado actualizado — si confirmed se revelan los premios
 *       404:
 *         description: Pedido no encontrado
 */
router.patch('/:id/status', requireAuth, requireAdmin, orderController.updateStatus);

export default router;
