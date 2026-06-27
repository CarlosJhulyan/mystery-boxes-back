import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando datos de prueba...\n');

  // 1. BoxPrizeHistory (referencia Order y Box)
  const prizes = await db.boxPrizeHistory.deleteMany();
  console.log(`✅ Historial de premios eliminados: ${prizes.count}`);

  // 2. CouponUsage (referencia Order y CouponCampaign)
  const couponUsages = await db.couponUsage.deleteMany();
  console.log(`✅ Usos de cupones eliminados: ${couponUsages.count}`);

  // 3. Resetear contador de usos en todas las campañas
  const couponsReset = await db.couponCampaign.updateMany({
    data: { current_uses: 0 },
  });
  console.log(`✅ Cupones reseteados (current_uses → 0): ${couponsReset.count}`);

  // 4. OrderItem (referencia Order y Box)
  const items = await db.orderItem.deleteMany();
  console.log(`✅ Items de órdenes eliminados: ${items.count}`);

  // 5. Order
  const orders = await db.order.deleteMany();
  console.log(`✅ Órdenes eliminadas: ${orders.count}`);

  console.log('\n🎉 Listo. La base de datos está limpia para órdenes reales.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
