import { db } from '@/config/database';
import { logger } from '@/config/logger';

const TIER_WEIGHTS = [
  { tier: 'Común', weight: 60, minValue: 10, maxValue: 30 },
  { tier: 'Raro', weight: 25, minValue: 30, maxValue: 100 },
  { tier: 'Épico', weight: 12, minValue: 100, maxValue: 300 },
  { tier: 'Legendario', weight: 3, minValue: 300, maxValue: 1000 },
];

const PRIZE_NAMES: Record<string, string[]> = {
  Común: ['Sticker Pack', 'Pin Coleccionable', 'Llavero Edición Limitada', 'Póster A4'],
  Raro: ['Figura Vinilo Pequeña', 'Camiseta Exclusiva', 'Set de Tazas', 'Auriculares Retro'],
  Épico: ['Figura Vinilo Grande', 'Mochila Edición Especial', 'Smartwatch Básico', 'Teclado Mecánico'],
  Legendario: ['Consola Portátil', 'Smartphone Gama Media', 'Tablet Edición Limitada', 'Cámara Instantánea Pro'],
};

function rollTier(): (typeof TIER_WEIGHTS)[number] {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const t of TIER_WEIGHTS) {
    acc += t.weight;
    if (roll < acc) return t;
  }
  return TIER_WEIGHTS[0];
}

function randomPrizeName(tier: string): string {
  const names = PRIZE_NAMES[tier] ?? ['Premio Sorpresa'];
  return names[Math.floor(Math.random() * names.length)];
}

function randomValue(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export async function revealPrizes(orderId: string): Promise<void> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    logger.warn({ orderId }, 'Orden no encontrada para reveal');
    return;
  }

  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      const tierData = rollTier();
      await db.boxPrizeHistory.create({
        data: {
          box_id: item.box_id,
          order_id: orderId,
          prize_tier: tierData.tier,
          prize_name: randomPrizeName(tierData.tier),
          prize_value: randomValue(tierData.minValue, tierData.maxValue),
        },
      });
    }
  }

  logger.info({ orderId }, 'Premios revelados correctamente');
}
