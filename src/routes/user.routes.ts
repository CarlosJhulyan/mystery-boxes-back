import { Router } from 'express';
import { userController } from '@/controllers/user.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router: import("express").Router = Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Autenticación y perfil de usuario
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Carlos Hulyan
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carlos@ejemplo.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: secreto123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Email ya registrado
 */
router.post('/register', userController.register);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carlos@ejemplo.com
 *               password:
 *                 type: string
 *                 example: secreto123
 *     responses:
 *       200:
 *         description: Login exitoso — devuelve JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', userController.login);

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 *       401:
 *         description: No autenticado
 */
router.get('/me', requireAuth, userController.getProfile);

/**
 * @openapi
 * /users/me:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       401:
 *         description: No autenticado
 */
router.put('/me', requireAuth, userController.updateProfile);

export default router;
