import { db } from '@/config/database';
import { Prisma } from '@prisma/client';

export async function getAllBoxes(filters?: { theme?: string; rarity?: string }) {
  return db.box.findMany({
    where: {
      is_active: true,
      ...(filters?.theme && { theme: filters.theme }),
      ...(filters?.rarity && { rarity: filters.rarity }),
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function getBoxById(id: string) {
  const box = await db.box.findUnique({ where: { id } });
  if (!box) throw { status: 404, message: 'Caja no encontrada' };
  return box;
}

export async function createBox(data: {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  theme: string;
  rarity: string;
}) {
  return db.box.create({
    data: {
      name: data.name,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      image_url: data.image_url,
      theme: data.theme,
      rarity: data.rarity,
    },
  });
}

export async function updateBox(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    image_url: string;
    theme: string;
    rarity: string;
    is_active: boolean;
  }>
) {
  const box = await db.box.findUnique({ where: { id } });
  if (!box) throw { status: 404, message: 'Caja no encontrada' };

  const { price, ...rest } = data;
  return db.box.update({
    where: { id },
    data: {
      ...rest,
      ...(price !== undefined && { price: new Prisma.Decimal(price) }),
    },
  });
}

export async function removeBox(id: string) {
  const box = await db.box.findUnique({ where: { id } });
  if (!box) throw { status: 404, message: 'Caja no encontrada' };
  return db.box.update({ where: { id }, data: { is_active: false } });
}
