import { Router } from 'express';
import { couponController } from '@/controllers/coupon.controller';
import { requireAuth, requireAdmin } from '@/middlewares/auth.middleware';

const router: import("express").Router = Router();

/**
 * @openapi
 * tags:
 *   name: Coupons
 *   description: Campañas de cupones de influencers
 */

/**
 * @openapi
 * /coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: Listar todas las campañas (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de campañas de cupones
 *       403:
 *         description: Solo administradores
 */
router.get('/', requireAuth, requireAdmin, couponController.getAll);

/**
 * @openapi
 * /coupons/{code}:
 *   get:
 *     tags: [Coupons]
 *     summary: Validar y obtener cupón por código
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: GAMER2026
 *     responses:
 *       200:
 *         description: Cupón válido con porcentaje de descuento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 discount_pct:
 *                   type: number
 *                 influencer_name:
 *                   type: string
 *                 applicable_box_id:
 *                   type: string
 *                   nullable: true
 *                 valid_until:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Cupón no encontrado, inactivo o expirado
 */
router.get('/:code', couponController.getByCode);

/**
 * @openapi
 * /coupons:
 *   post:
 *     tags: [Coupons]
 *     summary: Crear campaña de cupón (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, influencer_name, discount_pct, valid_from, valid_until]
 *             properties:
 *               code:
 *                 type: string
 *                 example: GAMER2026
 *               influencer_name:
 *                 type: string
 *                 example: JuanGamer
 *               discount_pct:
 *                 type: number
 *                 example: 15
 *               max_uses:
 *                 type: integer
 *                 nullable: true
 *                 description: null para usos ilimitados
 *               applicable_box_id:
 *                 type: string
 *                 nullable: true
 *                 description: null para aplicar a toda la tienda
 *               valid_from:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-01T00:00:00Z"
 *               valid_until:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Campaña creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/', requireAuth, requireAdmin, couponController.create);

/**
 * @openapi
 * /coupons/{id}:
 *   put:
 *     tags: [Coupons]
 *     summary: Actualizar campaña (admin)
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
 *             properties:
 *               is_active:
 *                 type: boolean
 *               max_uses:
 *                 type: integer
 *                 nullable: true
 *               valid_until:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Campaña actualizada
 *       404:
 *         description: Cupón no encontrado
 */
router.put('/:id', requireAuth, requireAdmin, couponController.update);

/**
 * @openapi
 * /coupons/{id}:
 *   delete:
 *     tags: [Coupons]
 *     summary: Desactivar campaña (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Campaña desactivada
 *       404:
 *         description: Cupón no encontrado
 */
router.delete('/:id', requireAuth, requireAdmin, couponController.remove);

export default router;
