import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

// ─── CATEGORÍAS / TEMAS ───────────────────────────────────────────────────────
// Themes: Gaming | Anime | Tech | K-Pop | Deportes | Música | Moda
// Tiers:  Común  | Raro  | Épico | Legendario

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  // ── Gaming ──────────────────────────────────────────────────────────────────
  { name: 'Sticker Pack Gamer Edition',         tier: 'Común',      theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' },
  { name: 'Pin Coleccionable Arcade',           tier: 'Común',      theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400' },
  { name: 'Camiseta Gaming Oversize',           tier: 'Raro',       theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400' },
  { name: 'Mousepad XL RGB Gaming',             tier: 'Raro',       theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400' },
  { name: 'Figura Kratos 25cm',                 tier: 'Épico',      theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400' },
  { name: 'Teclado Mecánico RGB TKL',           tier: 'Épico',      theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
  { name: 'Nintendo Switch Lite',               tier: 'Legendario', theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400' },
  { name: 'Headset Pro Gaming 7.1 Surround',    tier: 'Legendario', theme: 'Gaming',   image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },

  // ── Anime ───────────────────────────────────────────────────────────────────
  { name: 'Sticker Pack Naruto Shippuden',      tier: 'Común',      theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400' },
  { name: 'Pin Coleccionable Dragon Ball Z',    tier: 'Común',      theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400' },
  { name: 'Figura Goku 15cm Super Saiyan',      tier: 'Raro',       theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400' },
  { name: 'Camiseta One Piece Luffy',           tier: 'Raro',       theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400' },
  { name: 'Figura Nezuko 25cm Premium',         tier: 'Épico',      theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1601850494422-3cf05d43d8af?w=400' },
  { name: 'Artbook Demon Slayer Oficial',       tier: 'Épico',      theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' },
  { name: 'Figura Luffy Gear 5 Ed. Limitada',   tier: 'Legendario', theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { name: 'Set Coleccionista Dragon Ball Z',    tier: 'Legendario', theme: 'Anime',    image_url: 'https://images.unsplash.com/photo-1612198790700-2e9b52e8a3bc?w=400' },

  // ── Tech ────────────────────────────────────────────────────────────────────
  { name: 'Cable USB-C Braided 2m',             tier: 'Común',      theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400' },
  { name: 'Soporte Celular Magnético',          tier: 'Común',      theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400' },
  { name: 'Auriculares Inalámbricos Bluetooth', tier: 'Raro',       theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Hub USB-C 7 en 1',                  tier: 'Raro',       theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400' },
  { name: 'Smartwatch Fitness Pro',             tier: 'Épico',      theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { name: 'Cámara Web HD 1080p',                tier: 'Épico',      theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
  { name: 'Tablet 10" Android 14',             tier: 'Legendario', theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' },
  { name: 'Monitor Gaming 24" 144Hz',           tier: 'Legendario', theme: 'Tech',     image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400' },

  // ── K-Pop ───────────────────────────────────────────────────────────────────
  { name: 'Photocards BTS Set x10',             tier: 'Común',      theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Sticker Pack K-Pop Premium',         tier: 'Común',      theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Álbum Oficial BLACKPINK Born Pink',  tier: 'Raro',       theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Light Stick Mini TWICE',             tier: 'Raro',       theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Álbum Firmado Stray Kids',           tier: 'Épico',      theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Merch Exclusivo TWICE Set',          tier: 'Épico',      theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Set Coleccionista Premium BTS',      tier: 'Legendario', theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Light Stick Oficial BLACKPINK',      tier: 'Legendario', theme: 'K-Pop',    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },

  // ── Deportes ────────────────────────────────────────────────────────────────
  { name: 'Medias Deportivas Nike Pack x3',     tier: 'Común',      theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
  { name: 'Banda para Cabeza Deportiva',        tier: 'Común',      theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
  { name: 'Botella Térmica 1L Acero',           tier: 'Raro',       theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
  { name: 'Guantes Gym Premium Cuero',          tier: 'Raro',       theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
  { name: 'Camiseta Deportiva Dri-FIT Pro',     tier: 'Épico',      theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
  { name: 'Mochila Deportiva 30L Nike',         tier: 'Épico',      theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
  { name: 'Zapatillas Running Premium',         tier: 'Legendario', theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Smartwatch Deportivo GPS Garmin',    tier: 'Legendario', theme: 'Deportes', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },

  // ── Música ──────────────────────────────────────────────────────────────────
  { name: 'Picks Guitarra Set x20 Variados',    tier: 'Común',      theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Sticker Pack Bandas Rock Clásico',   tier: 'Común',      theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Vinilo The Beatles Abbey Road',      tier: 'Raro',       theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Camiseta Banda Rock Classic Tee',    tier: 'Raro',       theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Auriculares Studio Monitor 50mm',    tier: 'Épico',      theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Controlador MIDI Mini 25 Teclas',    tier: 'Épico',      theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Micrófono Condensador USB Pro',      tier: 'Legendario', theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=400' },
  { name: 'Interfaz de Audio 2x2 USB-C',        tier: 'Legendario', theme: 'Música',   image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },

  // ── Moda ────────────────────────────────────────────────────────────────────
  { name: 'Pin Streetwear Set x5',              tier: 'Común',      theme: 'Moda',     image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Calcetines Diseño Exclusivo x3',     tier: 'Común',      theme: 'Moda',     image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
  { name: 'Gorra Snapback Urban Style',         tier: 'Raro',       theme: 'Moda',     image_url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400' },
  { name: 'Camiseta Oversize Premium Drop',     tier: 'Raro',       theme: 'Moda',     image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400' },
  { name: 'Hoodie Premium Streetwear Edition',  tier: 'Épico',      theme: 'Moda',     image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400' },
  { name: 'Zapatillas Diseño Urbano Limited',   tier: 'Épico',      theme: 'Moda',     image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Chaqueta Varsity Diseñador',         tier: 'Legendario', theme: 'Moda',     image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
  { name: 'Set Accesorios Lujo Edición Límitada', tier: 'Legendario', theme: 'Moda',   image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
];

// ─── CAJAS ────────────────────────────────────────────────────────────────────

const BOXES = [
  // Gaming
  { name: 'Caja Gamer Élite',      description: 'Accesorios y merch de los juegos más épicos del momento. Cada caja es una aventura.',            price: 149.90, theme: 'Gaming',   rarity: 'Épico',      stock: 50,  image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400' },
  { name: 'Caja Retro Gamer',      description: 'Nostalgia pura: items de los clásicos de los 90s y 2000s. Pac-Man, Mario y más.',               price: 89.90,  theme: 'Gaming',   rarity: 'Raro',       stock: 80,  image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' },
  { name: 'Caja FPS Pro',          description: 'Para los que viven en el battlefield. Merch de CS, Valorant y Call of Duty.',                   price: 119.90, theme: 'Gaming',   rarity: 'Raro',       stock: 60,  image_url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400' },
  { name: 'Caja Legendary Gamer',  description: 'La caja definitiva para el gamer hardcore. Items de edición limitada y coleccionables.',         price: 299.90, theme: 'Gaming',   rarity: 'Legendario', stock: 20,  image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400' },

  // Anime
  { name: 'Caja Otaku Básica',     description: 'Entrada al mundo anime con pins, stickers y pósters de los clásicos.',                          price: 59.90,  theme: 'Anime',    rarity: 'Común',      stock: 100, image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400' },
  { name: 'Caja Shonen Power',     description: 'Dragon Ball, Naruto, One Piece — los más icónicos del género shonen.',                          price: 99.90,  theme: 'Anime',    rarity: 'Raro',       stock: 70,  image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400' },
  { name: 'Caja Waifu Edition',    description: 'Figuras, dakimakuras mini y merch exclusivo de los animes más populares del año.',              price: 189.90, theme: 'Anime',    rarity: 'Épico',      stock: 40,  image_url: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400' },
  { name: 'Caja Anime Legendaria', description: 'Figuras de colección a escala 1:7, artbooks firmados y items de edición limitada.',             price: 349.90, theme: 'Anime',    rarity: 'Legendario', stock: 15,  image_url: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400' },

  // Tech
  { name: 'Caja Tech Starter',     description: 'Gadgets y accesorios tech de bajo costo pero mucha utilidad. Perfecta para el curioso.',        price: 79.90,  theme: 'Tech',     rarity: 'Común',      stock: 90,  image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400' },
  { name: 'Caja Gadget Pro',       description: 'Auriculares, cables USB-C de alta velocidad, hubs y más. Todo para el productivo.',             price: 129.90, theme: 'Tech',     rarity: 'Raro',       stock: 65,  image_url: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400' },
  { name: 'Caja Smart Life',       description: 'Domótica y wearables. Smartwatch, bombillos inteligentes y gadgets para el hogar.',             price: 249.90, theme: 'Tech',     rarity: 'Épico',      stock: 35,  image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400' },

  // K-Pop
  { name: 'Caja K-Pop Fan',        description: 'Photocards, álbumes y merch oficial de los grupos más populares del K-Pop.',                    price: 69.90,  theme: 'K-Pop',    rarity: 'Común',      stock: 95,  image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Caja K-Pop Premium',    description: 'Álbumes firmados, light sticks y merch exclusivo. Para el fan más dedicado.',                   price: 159.90, theme: 'K-Pop',    rarity: 'Épico',      stock: 45,  image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },

  // Deportes
  { name: 'Caja Sport Básica',     description: 'Accesorios deportivos esenciales: medias, bandas, botella y más.',                              price: 49.90,  theme: 'Deportes', rarity: 'Común',      stock: 110, image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
  { name: 'Caja Fitness Pro',      description: 'Suplementos, ropa deportiva y accesorios de gym de marcas reconocidas.',                        price: 139.90, theme: 'Deportes', rarity: 'Raro',       stock: 55,  image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },

  // Música
  { name: 'Caja Música Indie',     description: 'Vinilos, pines de bandas y merch de artistas independientes nacionales e internacionales.',     price: 89.90,  theme: 'Música',   rarity: 'Raro',       stock: 60,  image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },

  // Moda
  { name: 'Caja Street Style',     description: 'Ropa streetwear, gorras y accesorios de marcas urbanas. Tu look, sorpresa.',                    price: 119.90, theme: 'Moda',     rarity: 'Raro',       stock: 75,  image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Caja Luxury Fashion',   description: 'Accesorios de lujo, perfumes y prendas de diseñador en edición limitada.',                      price: 399.90, theme: 'Moda',     rarity: 'Legendario', stock: 10,  image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
];

// Cada rarity abre el pool hasta su nivel:
//   Común      → sólo Común
//   Raro       → Común + Raro
//   Épico      → Común + Raro + Épico
//   Legendario → todos los tiers
const TIER_POOL: Record<string, string[]> = {
  Común:      ['Común'],
  Raro:       ['Común', 'Raro'],
  Épico:      ['Común', 'Raro', 'Épico'],
  Legendario: ['Común', 'Raro', 'Épico', 'Legendario'],
};

// ─── CUPONES ──────────────────────────────────────────────────────────────────

const COUPONS = [
  { code: 'GAMER2026',    influencer_name: 'ElGamerPeru',    discount_pct: 15, max_uses: 200,  valid_from: new Date('2026-01-01'), valid_until: new Date('2026-12-31') },
  { code: 'ANIME10',      influencer_name: 'OtakuLima',      discount_pct: 10, max_uses: 150,  valid_from: new Date('2026-01-01'), valid_until: new Date('2026-09-30') },
  { code: 'BIENVENIDO20', influencer_name: 'MysteryBoxPeru', discount_pct: 20, max_uses: null, valid_from: new Date('2026-01-01'), valid_until: new Date('2026-12-31') },
  { code: 'KPOPFAN',      influencer_name: 'KoreanaLima',    discount_pct: 12, max_uses: 100,  valid_from: new Date('2026-03-01'), valid_until: new Date('2026-08-31') },
  { code: 'TECH15',       influencer_name: 'GadgetsPeru',    discount_pct: 15, max_uses: 80,   valid_from: new Date('2026-02-01'), valid_until: new Date('2026-10-31') },
];

// ─── PRIZE LOGIC ──────────────────────────────────────────────────────────────

const TIER_WEIGHTS = [
  { tier: 'Común',      weight: 60, minValue: 10,  maxValue: 30   },
  { tier: 'Raro',       weight: 25, minValue: 30,  maxValue: 100  },
  { tier: 'Épico',      weight: 12, minValue: 100, maxValue: 300  },
  { tier: 'Legendario', weight: 3,  minValue: 300, maxValue: 1000 },
];

const PRIZE_NAMES: Record<string, string[]> = {
  Común:      ['Sticker Pack Exclusivo', 'Pin Coleccionable', 'Llavero Edición Limitada', 'Póster A4', 'Calcomanías Set', 'Libreta Temática', 'Botón Metálico'],
  Raro:       ['Figura Vinilo 10cm', 'Camiseta Exclusiva Talla M', 'Set de Tazas', 'Auriculares Retro', 'Mochila Pequeña', 'Álbum Fotográfico', 'Reloj Casual'],
  Épico:      ['Figura Vinilo 25cm', 'Mochila Edición Especial', 'Smartwatch Básico', 'Teclado Mecánico TKL', 'Audífonos Bluetooth', 'Cámara Instantánea Mini', 'Tablet 8"'],
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

  // Limpiar en orden correcto (FK dependency order)
  await db.boxPrizeHistory.deleteMany();
  await db.couponUsage.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.couponCampaign.deleteMany();
  await db.boxProduct.deleteMany();
  await db.box.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();
  console.log('🧹 Datos anteriores eliminados');

  // ── Usuarios ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await db.user.create({
    data: { name: 'Admin Mystery Box', email: 'admin@mysterybox.pe', password_hash: passwordHash, role: 'admin' },
  });

  const users = await Promise.all([
    db.user.create({ data: { name: 'Carlos Mendoza',  email: 'carlos@gmail.com',    password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Lucía Torres',    email: 'lucia@gmail.com',     password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Rodrigo Vega',    email: 'rodrigo@gmail.com',   password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Valeria Quispe',  email: 'valeria@gmail.com',   password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Sebastián Cruz',  email: 'sebastian@gmail.com', password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Daniela Flores',  email: 'daniela@gmail.com',   password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Matías Paredes',  email: 'matias@gmail.com',    password_hash: passwordHash } }),
    db.user.create({ data: { name: 'Isabella Rojas',  email: 'isabella@gmail.com',  password_hash: passwordHash } }),
  ]);

  console.log(`✅ ${users.length + 1} usuarios creados (1 admin + ${users.length} usuarios)`);

  // ── Productos ─────────────────────────────────────────────────────────────
  const products = await Promise.all(
    PRODUCTS.map((p) => db.product.create({ data: p }))
  );

  // Index by theme for quick lookup
  const productsByTheme: Record<string, typeof products> = {};
  for (const p of products) {
    if (!productsByTheme[p.theme]) productsByTheme[p.theme] = [];
    productsByTheme[p.theme].push(p);
  }

  console.log(`✅ ${products.length} productos creados (${Object.keys(productsByTheme).length} temas × 4 tiers × 2 productos)`);

  // ── Cajas ─────────────────────────────────────────────────────────────────
  const boxes = await Promise.all(
    BOXES.map((b) => db.box.create({ data: { ...b, price: new Prisma.Decimal(b.price) } }))
  );
  console.log(`✅ ${boxes.length} cajas creadas`);

  // ── BoxProduct: asignar productos al pool de cada caja ────────────────────
  const boxProductLinks: { box_id: string; product_id: string }[] = [];

  for (const box of boxes) {
    const allowedTiers = TIER_POOL[box.rarity] ?? ['Común'];
    const themeProducts = productsByTheme[box.theme] ?? [];
    const eligible = themeProducts.filter((p) => allowedTiers.includes(p.tier));

    for (const product of eligible) {
      boxProductLinks.push({ box_id: box.id, product_id: product.id });
    }
  }

  await db.boxProduct.createMany({ data: boxProductLinks });
  console.log(`✅ ${boxProductLinks.length} links caja↔producto creados`);

  // ── Cupones ───────────────────────────────────────────────────────────────
  const coupons = await Promise.all(
    COUPONS.map((c) => db.couponCampaign.create({ data: { ...c, discount_pct: new Prisma.Decimal(c.discount_pct) } }))
  );
  console.log(`✅ ${coupons.length} cupones creados`);

  // ── Órdenes ───────────────────────────────────────────────────────────────
  const ordersData = [
    { userId: users[0].id, email: users[0].email, boxIndices: [0, 4],   status: 'delivered', coupon: null         },
    { userId: users[1].id, email: users[1].email, boxIndices: [5, 5],   status: 'delivered', coupon: coupons[1]   },
    { userId: users[2].id, email: users[2].email, boxIndices: [1],      status: 'delivered', coupon: null         },
    { userId: users[3].id, email: users[3].email, boxIndices: [11, 12], status: 'shipped',   coupon: coupons[3]   },
    { userId: users[4].id, email: users[4].email, boxIndices: [8, 9],   status: 'confirmed', coupon: coupons[4]   },
    { userId: users[5].id, email: users[5].email, boxIndices: [3],      status: 'delivered', coupon: null         },
    { userId: users[6].id, email: users[6].email, boxIndices: [6, 7],   status: 'delivered', coupon: coupons[0]   },
    { userId: users[7].id, email: users[7].email, boxIndices: [15, 16], status: 'shipped',   coupon: null         },
    { userId: users[0].id, email: users[0].email, boxIndices: [2],      status: 'delivered', coupon: coupons[0]   },
    { userId: users[2].id, email: users[2].email, boxIndices: [10],     status: 'confirmed', coupon: null         },
    { userId: null,        email: 'guest1@correo.com', boxIndices: [13], status: 'delivered', coupon: null        },
    { userId: null,        email: 'guest2@correo.com', boxIndices: [4, 5], status: 'delivered', coupon: coupons[2] },
    { userId: null,        email: 'guest3@correo.com', boxIndices: [0],  status: 'pending',   coupon: null        },
    { userId: null,        email: 'guest4@correo.com', boxIndices: [17], status: 'delivered', coupon: null        },
    { userId: users[1].id, email: users[1].email, boxIndices: [14],     status: 'pending',   coupon: null         },
  ];

  const startDate = new Date('2026-01-01');
  const endDate   = new Date('2026-06-20');
  const createdOrders: { order: Awaited<ReturnType<typeof db.order.create>>; boxes: typeof boxes }[] = [];

  for (const o of ordersData) {
    const orderBoxes = o.boxIndices.map((i) => boxes[i]);
    let subtotal = new Prisma.Decimal(0);
    for (const b of orderBoxes) subtotal = subtotal.add(b.price);

    let discountAmt = new Prisma.Decimal(0);
    if (o.coupon) {
      discountAmt = subtotal.mul(o.coupon.discount_pct).div(100).toDecimalPlaces(2);
    }

    const orderDate = randomDate(startDate, endDate);

    const order = await db.order.create({
      data: {
        order_key:   crypto.randomUUID(),
        user_id:     o.userId,
        guest_email: o.userId ? null : o.email,
        status:      o.status,
        total:       subtotal.sub(discountAmt),
        created_at:  orderDate,
        items: {
          create: orderBoxes.map((b) => ({ box_id: b.id, quantity: 1, unit_price: b.price })),
        },
      },
    });

    if (o.coupon) {
      await db.couponUsage.create({
        data: { campaign_id: o.coupon.id, order_id: order.id, user_email: o.email, discount_amt: discountAmt, used_at: orderDate },
      });
      await db.couponCampaign.update({
        where: { id: o.coupon.id },
        data:  { current_uses: { increment: 1 } },
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
          box_id:      box.id,
          order_id:    order.id,
          prize_tier:  tierData.tier,
          prize_name:  randomPrizeName(tierData.tier),
          prize_value: randomValue(tierData.minValue, tierData.maxValue),
          revealed_at: randomDate(new Date(order.created_at), endDate),
        },
      });
      prizesCreated++;
    }
  }

  console.log(`✅ ${prizesCreated} premios revelados creados`);

  // ── Resumen ───────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed completado!\n');
  console.log('Temas/Categorías:', Object.keys(productsByTheme).join(', '));
  console.log('Tiers de productos: Común | Raro | Épico | Legendario\n');
  console.log('Credenciales:');
  console.log('  Admin:   admin@mysterybox.pe / password123');
  console.log('  Usuario: carlos@gmail.com    / password123');
  console.log('  Usuario: lucia@gmail.com     / password123');
}

main()
  .catch((e) => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(() => db.$disconnect());
