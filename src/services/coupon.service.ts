import { db } from '@/config/database';
import { Prisma } from '@prisma/client';

export async function getAllCoupons() {
  return db.couponCampaign.findMany({ orderBy: { created_at: 'desc' } });
}

export async function validateCoupon(code: string, boxId?: string) {
  const now = new Date();
  const coupon = await db.couponCampaign.findUnique({ where: { code } });

  if (!coupon || !coupon.is_active) throw { status: 404, message: 'Cupón no encontrado o inactivo' };
  if (coupon.valid_from > now || coupon.valid_until < now) throw { status: 400, message: 'Cupón expirado o no vigente' };
  if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) throw { status: 400, message: 'Cupón agotado' };
  if (coupon.applicable_box_id && boxId && coupon.applicable_box_id !== boxId) {
    throw { status: 400, message: 'Cupón no aplicable a esta caja' };
  }

  return coupon;
}

export async function createCoupon(data: {
  code: string;
  influencer_name: string;
  discount_pct: number;
  max_uses?: number | null;
  applicable_box_id?: string;
  valid_from: string;
  valid_until: string;
}) {
  return db.couponCampaign.create({
    data: {
      code: data.code,
      influencer_name: data.influencer_name,
      discount_pct: new Prisma.Decimal(data.discount_pct),
      max_uses: data.max_uses ?? null,
      applicable_box_id: data.applicable_box_id,
      valid_from: new Date(data.valid_from),
      valid_until: new Date(data.valid_until),
    },
  });
}

export async function updateCoupon(
  id: string,
  data: Partial<{ is_active: boolean; max_uses: number | null; valid_until: string }>
) {
  const coupon = await db.couponCampaign.findUnique({ where: { id } });
  if (!coupon) throw { status: 404, message: 'Cupón no encontrado' };

  return db.couponCampaign.update({
    where: { id },
    data: {
      ...(data.is_active !== undefined && { is_active: data.is_active }),
      ...(data.max_uses !== undefined && { max_uses: data.max_uses }),
      ...(data.valid_until && { valid_until: new Date(data.valid_until) }),
    },
  });
}

export async function removeCoupon(id: string) {
  const coupon = await db.couponCampaign.findUnique({ where: { id } });
  if (!coupon) throw { status: 404, message: 'Cupón no encontrado' };
  return db.couponCampaign.update({ where: { id }, data: { is_active: false } });
}
