import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

// ─── BOXES ───────────────────────────────────────────────────────────────────

const BOXES = [
  // Gaming
  { name: 'Caja Gamer Élite', description: 'Accesorios y merch de los juegos más épicos del momento. Cada caja es una aventura.', price: 149.90, theme: 'Gaming', rarity: 'Épico', image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400' },
  { name: 'Caja Retro Gamer', description: 'Nostalgia pura: items de los clásicos de los 90s y 2000s. Pac-Man, Mario y más.', price: 89.90, theme: 'Gaming', rarity: 'Raro', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' },
  { name: 'Caja FPS Pro', description: 'Para los que viven en el battlefield. Merch de CS, Valorant y Call of Duty.', price: 119.90, theme: 'Gaming', rarity: 'Raro', image_url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400' },
  { name: 'Caja Legendary Gamer', description: 'La caja definitiva para el gamer hardcore. Items de edición limitada y coleccionables.', price: 299.90, theme: 'Gaming', rarity: 'Legendario', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400' },

  // Anime
  { name: 'Caja Otaku Básica', description: 'Entrada al mundo anime con pins, stickers y pósters de los clásicos.', price: 59.90, theme: 'Anime', rarity: 'Común', image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400' },
  { name: 'Caja Shonen Power', description: 'Dragon Ball, Naruto, One Piece — los más icónicos del género shonen.', price: 99.90, theme: 'Anime', rarity: 'Raro', image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400' },
  { name: 'Caja Waifu Edition', description: 'Figuras, dakimakuras mini y merch exclusivo de los animes más populares del año.', price: 189.90, theme: 'Anime', rarity: 'Épico', image_url: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400' },
  { name: 'Caja Anime Legendaria', description: 'Figuras de colección a escala 1:7, artbooks firmados y items de edición limitada.', price: 349.90, theme: 'Anime', rarity: 'Legendario', image_url: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400' },

  // Tech
  { name: 'Caja Tech Starter', description: 'Gadgets y accesorios tech de bajo costo pero mucha utilidad. Perfecta para el curioso.', price: 79.90, theme: 'Tech', rarity: 'Común', image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400' },
  { name: 'Caja Gadget Pro', description: 'Auriculares, cables USB-C de alta velocidad, hubs y más. Todo para el productivo.', price: 129.90, theme: 'Tech', rarity: 'Raro', image_url: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400' },
  { name: 'Caja Smart Life', description: 'Domótica y wearables. Smartwatch, bombillos inteligentes y gadgets para el hogar.', price: 249.90, theme: 'Tech', rarity: 'Épico', image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400' },

  // K-Pop
  { name: 'Caja K-Pop Fan', description: 'Photocards, álbumes y merch oficial de los grupos más populares del K-Pop.', price: 69.90, theme: 'K-Pop', rarity: 'Común', image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Caja K-Pop Premium', description: 'Álbumes firmados, light sticks y merch exclusivo. Para el fan más dedicado.', price: 159.90, theme: 'K-Pop', rarity: 'Épico', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },

  // Deportes
  { name: 'Caja Sport Básica', description: 'Accesorios deportivos esenciales: medias, bandas, botella y más.', price: 49.90, theme: 'Deportes', rarity: 'Común', image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
  { name: 'Caja Fitness Pro', description: 'Suplementos, ropa deportiva y accesorios de gym de marcas reconocidas.', price: 139.90, theme: 'Deportes', rarity: 'Raro', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },

  // Música
  { name: 'Caja Música Indie', description: 'Vinilos, pines de bandas y merch de artistas independientes nacionales e internacionales.', price: 89.90, theme: 'Música', rarity: 'Raro', image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },

  // Moda
  { name: 'Caja Street Style', description: 'Ropa streetwear, gorras y accesorios de marcas urbanas. Tu look, sorpresa.', price: 119.90, theme: 'Moda', rarity: 'Raro', image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Caja Luxury Fashion', description: 'Accesorios de lujo, perfumes y prendas de diseñador en edición limitada.', price: 399.90, theme: 'Moda', rarity: 'Legendario', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
];

// ─── COUPON CAMPAIGNS ─────────────────────────────────────────────────────────

const COUPONS = [
  {
    code: 'GAMER2026',
    influencer_name: 'ElGamerPeru',
    discount_pct: 15,
    max_uses: 200,
    valid_from: new Date('2026-01-01'),
    valid_until: new Date('2026-12-31'),
  },
  {
    code: 'ANIME10',
    influencer_name: 'OtakuLima',
    discount_pct: 10,
    max_uses: 150,
    valid_from: new Date('2026-01-01'),
    valid_until: new Date('2026-09-30'),
  },
  {
    code: 'BIENVENIDO20',
    influencer_name: 'MysteryBoxPeru',
    discount_pct: 20,
    max_uses: null,
    valid_from: new Date('2026-01-01'),
    valid_until: new Date('2026-12-31'),
  },
  {
    code: 'KPOPFAN',
    influencer_name: 'KoreanaLima',
    discount_pct: 12,
    max_uses: 100,
    valid_from: new Date('2026-03-01'),
    valid_until: new Date('2026-08-31'),
  },
  {
    code: 'TECH15',
    influencer_name: 'GadgetsPeru',
    discount_pct: 15,
    max_uses: 80,
    valid_from: new Date('2026-02-01'),
    valid_until: new Date('2026-10-31'),
  },
];

// ─── PRIZE LOGIC ──────────────────────────────────────────────────────────────

const TIER_WEIGHTS = [
  { tier: 'Común', weight: 60, minValue: 10, maxValue: 30 },
  { tier: 'Raro', weight: 25, minValue: 30, maxValue: 100 },
  { tier: 'Épico', weight: 12, minValue: 100, maxValue: 300 },
  { tier: 'Legendario', weight: 3, minValue: 300, maxValue: 1000 },
];

const PRIZE_NAMES: Record<string, string[]> = {
  Común: ['Sticker Pack Exclusivo', 'Pin Coleccionable', 'Llavero Edición Limitada', 'Póster A4', 'Calcomanías Set', 'Libreta Temática', 'Botón Metálico'],
  Raro: ['Figura Vinilo 10cm', 'Camiseta Exclusiva Talla M', 'Set de Tazas', 'Auriculares Retro', 'Mochila Pequeña', 'Álbum Fotográfico', 'Reloj Casual'],
  Épico: ['Figura Vinilo 25cm', 'Mochila Edición Especial', 'Smartwatch Básico', 'Teclado Mecánico TKL', 'Audífonos Bluetooth', 'Cámara Instantánea Mini', 'Tablet 8"'],
  Legendario: ['Consola Portátil Retro', 'Smartphone Gama Media', 'Tablet 10" Premium', 'Cámara Instantánea Pro', 'Monitor Gaming 24"', 'Laptop Chromebook'],
};

function rollTier() {
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

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ─── SEED ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes en orden correcto
  await db.boxPrizeHistory.deleteMany();
  await db.couponUsage.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.couponCampaign.deleteMany();
  await db.box.deleteMany();
  await db.user.deleteMany();
  console.log('🧹 Datos anteriores eliminados');

  // ── Usuarios ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await db.user.create({
    data: { name: 'Admin Mystery Box', email: 'admin@mysterybox.pe', password_hash: passwordHash, role: 'admin' },
  });

  const users = await Promise.all([
    db.user.create({ data: { name: 'Carlos Mendoza', email: 'carlos@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Lucía Torres', email: 'lucia@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Rodrigo Vega', email: 'rodrigo@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Valeria Quispe', email: 'valeria@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Sebastián Cruz', email: 'sebastian@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Daniela Flores', email: 'daniela@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Matías Paredes', email: 'matias@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Isabella Rojas', email: 'isabella@gmail.com', password_hash: passwordHash } }),
  ]);

  console.log(`✅ ${users.length + 1} usuarios creados (1 admin + ${users.length} usuarios)`);

  // ── Boxes ─────────────────────────────────────────────────────────────────
  const boxes = await Promise.all(
    BOXES.map((b) =>
      db.box.create({
        data: { ...b, price: new Prisma.Decimal(b.price) },
      })
    )
  );
  console.log(`✅ ${boxes.length} cajas creadas`);

  // ── Cupones ───────────────────────────────────────────────────────────────
  const coupons = await Promise.all(
    COUPONS.map((c) =>
      db.couponCampaign.create({
        data: { ...c, discount_pct: new Prisma.Decimal(c.discount_pct) },
      })
    )
  );
  console.log(`✅ ${coupons.length} cupones creados`);

  // ── Órdenes ───────────────────────────────────────────────────────────────
  const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'confirmed', 'pending'];
  const startDate = new Date('2026-01-01');
  const endDate = new Date('2026-06-20');

  const ordersData = [
    // Órdenes de usuarios registrados
    { userId: users[0].id, email: users[0].email, boxIndices: [0, 4], status: 'delivered', coupon: null },
    { userId: users[1].id, email: users[1].email, boxIndices: [5, 5], status: 'delivered', coupon: coupons[1] },
    { userId: users[2].id, email: users[2].email, boxIndices: [1], status: 'delivered', coupon: null },
    { userId: users[3].id, email: users[3].email, boxIndices: [11, 12], status: 'shipped', coupon: coupons[3] },
    { userId: users[4].id, email: users[4].email, boxIndices: [8, 9], status: 'confirmed', coupon: coupons[4] },
    { userId: users[5].id, email: users[5].email, boxIndices: [3], status: 'delivered', coupon: null },
    { userId: users[6].id, email: users[6].email, boxIndices: [6, 7], status: 'delivered', coupon: coupons[0] },
    { userId: users[7].id, email: users[7].email, boxIndices: [15, 16], status: 'shipped', coupon: null },
    { userId: users[0].id, email: users[0].email, boxIndices: [2], status: 'delivered', coupon: coupons[0] },
    { userId: users[2].id, email: users[2].email, boxIndices: [10], status: 'confirmed', coupon: null },
    // Órdenes guest
    { userId: null, email: 'guest1@correo.com', boxIndices: [13], status: 'delivered', coupon: null },
    { userId: null, email: 'guest2@correo.com', boxIndices: [4, 5], status: 'delivered', coupon: coupons[2] },
    { userId: null, email: 'guest3@correo.com', boxIndices: [0], status: 'pending', coupon: null },
    { userId: null, email: 'guest4@correo.com', boxIndices: [17], status: 'delivered', coupon: null },
    { userId: users[1].id, email: users[1].email, boxIndices: [14], status: 'pending', coupon: null },
  ];

  const createdOrders = [];

  for (const o of ordersData) {
    const orderBoxes = o.boxIndices.map((i) => boxes[i]);
    let subtotal = new Prisma.Decimal(0);
    for (const b of orderBoxes) subtotal = subtotal.add(b.price);

    let discountAmt = new Prisma.Decimal(0);
    if (o.coupon) {
      discountAmt = subtotal.mul(o.coupon.discount_pct).div(100).toDecimalPlaces(2);
    }

    const total = subtotal.sub(discountAmt);
    const orderDate = randomDate(startDate, endDate);

    const order = await db.order.create({
      data: {
        order_key: crypto.randomUUID(),
        user_id: o.userId,
        guest_email: o.userId ? null : o.email,
        status: o.status,
        total,
        created_at: orderDate,
        items: {
          create: orderBoxes.map((b) => ({
            box_id: b.id,
            quantity: 1,
            unit_price: b.price,
          })),
        },
      },
    });

    if (o.coupon) {
      await db.couponUsage.create({
        data: {
          campaign_id: o.coupon.id,
          order_id: order.id,
          user_email: o.email,
          discount_amt: discountAmt,
          used_at: orderDate,
        },
      });
      await db.couponCampaign.update({
        where: { id: o.coupon.id },
        data: { current_uses: { increment: 1 } },
      });
    }

    createdOrders.push({ order, boxes: orderBoxes });
  }

  console.log(`✅ ${createdOrders.length} órdenes creadas`);

  // ── Historial de premios ───────────────────────────────────────────────────
  const revealableStatuses = ['delivered', 'shipped', 'confirmed'];
  let prizesCreated = 0;

  for (const { order, boxes: orderBoxes } of createdOrders) {
    if (!revealableStatuses.includes(order.status)) continue;

    for (const box of orderBoxes) {
      const tierData = rollTier();
      await db.boxPrizeHistory.create({
        data: {
          box_id: box.id,
          order_id: order.id,
          prize_tier: tierData.tier,
          prize_name: randomPrizeName(tierData.tier),
          prize_value: randomValue(tierData.minValue, tierData.maxValue),
          revealed_at: randomDate(new Date(order.created_at), endDate),
        },
      });
      prizesCreated++;
    }
  }

  console.log(`✅ ${prizesCreated} premios revelados creados`);

  // ── Resumen final ─────────────────────────────────────────────────────────
  console.log('\n🎉 Seed completado exitosamente!\n');
  console.log('Credenciales de acceso:');
  console.log('  Admin:   admin@mysterybox.pe / password123');
  console.log('  Usuario: carlos@gmail.com    / password123');
  console.log('  Usuario: lucia@gmail.com     / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
