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
