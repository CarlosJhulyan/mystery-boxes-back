import { Router } from 'express';
import { prizeController } from '@/controllers/prize.controller';

const router: import("express").Router = Router();

/**
 * @openapi
 * tags:
 *   name: Prizes
 *   description: Historial público de premios revelados
 */

/**
 * @openapi
 * /prizes:
 *   get:
 *     tags: [Prizes]
 *     summary: Historial público de premios revelados
 *     description: Muestra los últimos premios revelados sin datos personales del comprador. Transparencia de la tienda.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad de registros a retornar
 *     responses:
 *       200:
 *         description: Lista de premios revelados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   prize_tier:
 *                     type: string
 *                     enum: [Común, Raro, Épico, Legendario]
 *                   prize_name:
 *                     type: string
 *                   prize_value:
 *                     type: number
 *                   revealed_at:
 *                     type: string
 *                     format: date-time
 *                   box:
 *                     type: object
 */
router.get('/', prizeController.getAll);

/**
 * @openapi
 * /prizes/box/{id}:
 *   get:
 *     tags: [Prizes]
 *     summary: Historial de premios de una caja específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la caja
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Premios revelados de esa caja
 *       404:
 *         description: Caja no encontrada
 */
router.get('/box/:id', prizeController.getByBox);

export default router;
