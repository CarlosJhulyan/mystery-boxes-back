import { db } from '@/config/database';

export async function getAllProducts() {
  return db.product.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
  });
}

export async function getProductById(id: string) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) throw { status: 404, message: 'Producto no encontrado' };
  return product;
}

export async function createProduct(data: {
  name: string;
  image_url?: string;
  tier: string;
  theme: string;
}) {
  return db.product.create({ data });
}

export async function updateProduct(
  id: string,
  data: Partial<{ name: string; image_url: string; tier: string; theme: string; is_active: boolean }>
) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) throw { status: 404, message: 'Producto no encontrado' };
  return db.product.update({ where: { id }, data });
}

export async function removeProduct(id: string) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) throw { status: 404, message: 'Producto no encontrado' };
  return db.product.update({ where: { id }, data: { is_active: false } });
}
