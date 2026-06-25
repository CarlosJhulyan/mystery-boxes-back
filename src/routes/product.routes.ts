import { Router } from 'express';
import { productController } from '@/controllers/product.controller';
import { requireAuth, requireAdmin } from '@/middlewares/auth.middleware';

const router: import('express').Router = Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', requireAuth, requireAdmin, productController.create);
router.put('/:id', requireAuth, requireAdmin, productController.update);
router.delete('/:id', requireAuth, requireAdmin, productController.remove);

export default router;
