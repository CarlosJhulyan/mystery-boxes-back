import { db } from '@/config/database';

export async function getAllUsers() {
  return db.user.findMany({
    select: { id: true, name: true, email: true, role: true, created_at: true },
    orderBy: { created_at: 'desc' },
  });
}

export async function updateUserRole(userId: string, role: string) {
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) throw { status: 400, message: 'Rol inválido. Usa: user | admin' };

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };

  return db.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
}
