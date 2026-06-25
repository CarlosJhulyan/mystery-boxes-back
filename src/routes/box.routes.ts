import { Router } from 'express';
import { boxController } from '@/controllers/box.controller';
import { requireAuth, requireAdmin } from '@/middlewares/auth.middleware';

const router: import("express").Router = Router();

/**
 * @openapi
 * tags:
 *   name: Boxes
 *   description: Catálogo de mystery boxes
 */

/**
 * @openapi
 * /boxes:
 *   get:
 *     tags: [Boxes]
 *     summary: Listar todas las cajas activas
 *     parameters:
 *       - in: query
 *         name: theme
 *         schema:
 *           type: string
 *         description: Filtrar por tema
 *       - in: query
 *         name: rarity
 *         schema:
 *           type: string
 *         description: Filtrar por rareza
 *     responses:
 *       200:
 *         description: Lista de cajas
 */
router.get('/', boxController.getAll);

/**
 * @openapi
 * /boxes/{id}:
 *   get:
 *     tags: [Boxes]
 *     summary: Obtener una caja por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la caja
 *       404:
 *         description: Caja no encontrada
 */
router.get('/:id', boxController.getById);

/**
 * @openapi
 * /boxes:
 *   post:
 *     tags: [Boxes]
 *     summary: Crear una nueva caja (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, theme, rarity]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Caja Gamer Pro
 *               description:
 *                 type: string
 *                 example: Caja exclusiva con accesorios gaming
 *               price:
 *                 type: number
 *                 example: 99.90
 *               image_url:
 *                 type: string
 *               theme:
 *                 type: string
 *                 example: Gaming
 *               rarity:
 *                 type: string
 *                 example: Épico
 *     responses:
 *       201:
 *         description: Caja creada
 *       403:
 *         description: Solo administradores
 */
router.post('/', requireAuth, requireAdmin, boxController.create);

/**
 * @openapi
 * /boxes/{id}:
 *   put:
 *     tags: [Boxes]
 *     summary: Actualizar una caja (admin)
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Caja actualizada
 *       404:
 *         description: Caja no encontrada
 */
router.put('/:id', requireAuth, requireAdmin, boxController.update);

/**
 * @openapi
 * /boxes/{id}:
 *   delete:
 *     tags: [Boxes]
 *     summary: Desactivar una caja (admin)
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
 *         description: Caja desactivada
 *       404:
 *         description: Caja no encontrada
 */
router.delete('/:id', requireAuth, requireAdmin, boxController.remove);

router.post('/:id/products', requireAuth, requireAdmin, boxController.assignProduct);
router.delete('/:id/products/:productId', requireAuth, requireAdmin, boxController.removeProduct);

export default router;
