import { db } from '@/config/database';

export async function getPublicPrizeHistory(limit = 50) {
  return db.boxPrizeHistory.findMany({
    orderBy: { revealed_at: 'desc' },
    take: limit,
    select: {
      id: true,
      prize_tier: true,
      prize_name: true,
      prize_value: true,
      revealed_at: true,
      box: { select: { id: true, name: true, theme: true, rarity: true } },
    },
  });
}

export async function getPrizeHistoryByBox(boxId: string, limit = 50) {
  const box = await db.box.findUnique({ where: { id: boxId } });
  if (!box) throw { status: 404, message: 'Caja no encontrada' };

  return db.boxPrizeHistory.findMany({
    where: { box_id: boxId },
    orderBy: { revealed_at: 'desc' },
    take: limit,
    select: {
      id: true,
      prize_tier: true,
      prize_name: true,
      prize_value: true,
      revealed_at: true,
    },
  });
}
