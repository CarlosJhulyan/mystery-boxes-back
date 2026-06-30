import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/config/database';
import { env } from '@/config/env';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  created_at: true,
} as const;

export async function register(name: string, email: string, password: string) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw { status: 409, message: 'Email ya registrado' };

  const password_hash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { name, email, password_hash },
    select: USER_SELECT,
  });
}

export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: 'Credenciales inválidas' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Credenciales inválidas' };

  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '7d' });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function getProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };
  return user;
}

export async function updateProfile(userId: string, data: { name?: string; password?: string }) {
  const updateData: { name?: string; password_hash?: string } = {};
  if (data.name) updateData.name = data.name;
  if (data.password) updateData.password_hash = await bcrypt.hash(data.password, 10);

  return db.user.update({
    where: { id: userId },
    data: updateData,
    select: USER_SELECT,
  });
}

export async function deleteAccount(userId: string): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };

  const emailHash = createHash('sha256').update(user.email).digest('hex').slice(0, 16);

  await db.$transaction(async (tx) => {
    const orders = await tx.order.findMany({
      where: { user_id: userId },
      select: { id: true },
    });
    const orderIds = orders.map((o) => o.id);

    if (orderIds.length > 0) {
      // Anonimizar user_email en CouponUsage antes de tocar órdenes
      await tx.couponUsage.updateMany({
        where: { order_id: { in: orderIds } },
        data: { user_email: emailHash },
      });

      // Desvincular órdenes y borrar PII de envío
      await tx.order.updateMany({
        where: { id: { in: orderIds } },
        data: {
          user_id: null,
          shipping_name: null,
          shipping_dni: null,
          shipping_department: null,
          shipping_province: null,
          shipping_district: null,
          shipping_address: null,
          shipping_reference: null,
        },
      });
    }

    // Borrado físico del registro User
    await tx.user.delete({ where: { id: userId } });
  });
}
