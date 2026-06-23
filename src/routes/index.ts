import { Router } from 'express';
import boxRouter from './box.routes';
import couponRouter from './coupon.routes';
import orderRouter from './order.routes';
import userRouter from './user.routes';
import paymentRouter from './payment.routes';
import prizeRouter from './prize.routes';
import adminRouter from './admin.routes';

export const router: import("express").Router = Router();

router.use('/boxes', boxRouter);
router.use('/coupons', couponRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);
router.use('/payments', paymentRouter);
router.use('/prizes', prizeRouter);
router.use('/admin', adminRouter);
