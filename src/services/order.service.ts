import { db } from '@/config/database';
import { Prisma } from '@prisma/client';
import { validateCoupon } from './coupon.service';
import { revealPrizes } from '@/jobs/prize-reveal.job';
import { logger } from '@/config/logger';

export async function getAllOrders() {
  return db.order.findMany({
    include: { items: { include: { box: true } }, user: { select: { id: true, name: true, email: true } } },
    orderBy: { created_at: 'desc' },
  });
}

export async function getMyOrders(userId: string) {
  return db.order.findMany({
    where: { user_id: userId },
    include: { items: { include: { box: true } } },
    orderBy: { created_at: 'desc' },
  });
}

export async function getOrderById(id: string) {
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { box: true } },
      coupon_usages: { include: { campaign: true } },
      prize_history: true,
    },
  });
  if (!order) throw { status: 404, message: 'Pedido no encontrado' };
  return order;
}

export interface OrderItemInput {
  box_id: string;
  quantity: number;
}

export async function createOrder(data: {
  items: OrderItemInput[];
  user_id?: string;
  guest_email?: string;
  coupon_code?: string;
  shipping_name?: string;
  shipping_dni?: string;
  shipping_department?: string;
  shipping_province?: string;
  shipping_district?: string;
  shipping_address?: string;
  shipping_reference?: string;
}) {
  if (!data.user_id && !data.guest_email) {
    throw { status: 400, message: 'Se requiere email de invitado o autenticación' };
  }

  const boxes = await db.box.findMany({
    where: { id: { in: data.items.map((i) => i.box_id) }, is_active: true },
  });

  if (boxes.length !== data.items.length) {
    throw { status: 400, message: 'Una o más cajas no están disponibles' };
  }

  // Validar stock
  for (const item of data.items) {
    const box = boxes.find((b) => b.id === item.box_id)!;
    if (box.stock < item.quantity) {
      throw { status: 400, message: `La caja "${box.name}" no tiene suficiente stock` };
    }
  }

  const boxMap = new Map(boxes.map((b) => [b.id, b]));
  let subtotal = new Prisma.Decimal(0);
  for (const item of data.items) {
    const box = boxMap.get(item.box_id)!;
    subtotal = subtotal.add(box.price.mul(item.quantity));
  }

  let discountAmt = new Prisma.Decimal(0);
  let coupon = null;
  if (data.coupon_code) {
    coupon = await validateCoupon(data.coupon_code);
    discountAmt = subtotal.mul(coupon.discount_pct).div(100).toDecimalPlaces(2);
  }

  const total = subtotal.sub(discountAmt);
  const order_key = crypto.randomUUID();
  const email = data.guest_email ?? (await db.user.findUnique({ where: { id: data.user_id } }))?.email ?? '';

  const order = await db.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        order_key,
        user_id: data.user_id ?? null,
        guest_email: data.guest_email ?? null,
        total,
        status: 'pending',
        shipping_name: data.shipping_name,
        shipping_dni: data.shipping_dni,
        shipping_department: data.shipping_department,
        shipping_province: data.shipping_province,
        shipping_district: data.shipping_district,
        shipping_address: data.shipping_address,
        shipping_reference: data.shipping_reference,
        items: {
          create: data.items.map((item) => ({
            box_id: item.box_id,
            quantity: item.quantity,
            unit_price: boxMap.get(item.box_id)!.price,
          })),
        },
      },
      include: { items: { include: { box: true } } },
    });

    // Decrementar stock de cada caja
    for (const item of data.items) {
      await tx.box.update({
        where: { id: item.box_id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (coupon) {
      await tx.couponUsage.create({
        data: {
          campaign_id: coupon.id,
          order_id: newOrder.id,
          user_email: email,
          discount_amt: discountAmt,
        },
      });
      await tx.couponCampaign.update({
        where: { id: coupon.id },
        data: { current_uses: { increment: 1 } },
      });
    }

    return newOrder;
  });

  return { order, subtotal, discountAmt, total, email };
}

export async function updateOrderStatus(id: string, status: string) {
  const order = await db.order.findUnique({ where: { id } });
  if (!order) throw { status: 404, message: 'Pedido no encontrado' };

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) throw { status: 400, message: 'Estado inválido' };

  const updated = await db.order.update({ where: { id }, data: { status } });

  if (status === 'confirmed') {
    revealPrizes(id).catch((err) => logger.warn(err, 'Error al revelar premios'));
  }

  return updated;
}

export async function confirmOrderByKey(orderKey: string) {
  const order = await db.order.findUnique({ where: { order_key: orderKey } });
  if (!order || order.status !== 'pending') return null;

  const updated = await db.order.update({
    where: { order_key: orderKey },
    data: { status: 'confirmed' },
  });

  revealPrizes(updated.id).catch((err) => logger.warn(err, 'Error al revelar premios'));

  return updated;
}

export async function cancelOrderByKey(orderKey: string) {
  const order = await db.order.findUnique({ where: { order_key: orderKey } });
  if (!order || order.status !== 'pending') return null;

  return db.order.update({
    where: { order_key: orderKey },
    data: { status: 'cancelled' },
  });
}
