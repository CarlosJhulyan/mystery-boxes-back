import { Router } from 'express';
import { adminController } from '@/controllers/admin.controller';
import { requireAuth, requireAdmin } from '@/middlewares/auth.middleware';

const router: import("express").Router = Router();

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Gestión de usuarios (solo administradores)
 */

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Listar todos los usuarios registrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: Solo administradores
 */
router.get('/users', requireAuth, requireAdmin, adminController.getUsers);

/**
 * @openapi
 * /admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Cambiar rol de un usuario
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
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/users/:id/role', requireAuth, requireAdmin, adminController.updateUserRole);

export default router;
