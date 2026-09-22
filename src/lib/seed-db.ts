import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { getDb } from "@/db";
import { banners, categories, offers, productImages, products, reels, reviews, siteSettings, users } from "@/db/schema";
import { SEED_BANNERS, SEED_CATEGORIES, SEED_OFFERS, SEED_PRODUCTS, SEED_REELS, SEED_SETTINGS } from "@/lib/seed-data";

type Db = NonNullable<ReturnType<typeof getDb>>;

const SAMPLE_REVIEWS = [
  { userName: "Rohit S.", rating: 5, title: "Best fitting jeans in Jodhpur", comment: "Fabric is premium and fitting is perfect. Store staff helped me pick the right size." },
  { userName: "Amit K.", rating: 5, title: "Combo is value for money", comment: "Got jeans + tee combo at ₹1149. Quality is genuinely good for the price." },
  { userName: "Mohit M.", rating: 4, title: "Trendy boxy tee", comment: "Heavy fabric, nice drop shoulders. Will buy more colours." },
];

export async function runSeed(db: Db) {
  for (const c of SEED_CATEGORIES) {
    await db.insert(categories).values({
      slug: c.slug, name: c.name, audience: c.audience,
      parentSlug: c.parentSlug, image: c.image, description: c.description, sortOrder: c.sortOrder,
    }).onConflictDoNothing({ target: categories.slug });
  }

  for (const p of SEED_PRODUCTS) {
    const existing = await db.select({ id: products.id }).from(products).where(eq(products.slug, p.slug)).limit(1);
    let pid: number;
    if (existing.length) {
      pid = existing[0].id;
    } else {
      const ins = await db.insert(products).values({
        slug: p.slug, name: p.name, shortDesc: p.shortDesc, description: p.description,
        categorySlug: p.categorySlug, audience: p.audience, price: p.price, mrp: p.mrp,
        rating: p.rating, ratingCount: p.ratingCount, tags: p.tags, badges: p.badges,
        fits: p.fits, colors: p.colors, sizes: p.sizes, keywords: p.keywords,
        fabric: p.fabric, fit: p.fit, washCare: "Machine wash cold. Do not bleach. Dry in shade.",
        isNewArrival: p.isNewArrival, isTrending: p.isTrending,
        bestsellerScore: p.bestsellerScore, stockTotal: p.stockTotal,
      }).returning({ id: products.id });
      pid = ins[0].id;
    }
    const hasImage = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.productId, pid)).limit(1);
    if (!hasImage.length) {
      for (let i = 0; i < p.images.length; i++) {
        await db.insert(productImages).values({ productId: pid, url: p.images[i], alt: p.name, sortOrder: i, isPrimary: i === 0 });
      }
    }
  }

  const existingBanners = await db.select({ title: banners.title }).from(banners);
  const bannerTitles = new Set(existingBanners.map((b) => b.title));
  for (const b of SEED_BANNERS) {
    if (bannerTitles.has(b.title)) continue;
    await db.insert(banners).values({
      title: b.title, subtitle: b.subtitle, image: b.image, ctaText: b.ctaText, ctaLink: b.ctaLink, sortOrder: b.sortOrder,
    });
  }

  for (const o of SEED_OFFERS) {
    await db.insert(offers).values({
      slug: o.slug, title: o.title, subtitle: o.subtitle, priceLabel: o.priceLabel,
      description: o.description, image: o.image, badge: o.badge, ctaText: o.ctaText, ctaLink: o.ctaLink, sortOrder: o.sortOrder,
    }).onConflictDoNothing({ target: offers.slug });
  }

  const existingReels = await db.select({ caption: reels.caption }).from(reels);
  const reelCaptions = new Set(existingReels.map((r) => r.caption));
  for (const r of SEED_REELS) {
    if (reelCaptions.has(r.caption)) continue;
    await db.insert(reels).values({
      caption: r.caption, thumbnail: r.thumbnail, productSlug: r.productSlug, views: r.views, instagramUrl: r.instagramUrl,
    });
  }

  for (const [key, value] of Object.entries(SEED_SETTINGS)) {
    await db.insert(siteSettings).values({ key, value }).onConflictDoNothing({ target: siteSettings.key });
  }

  const sampleProducts = await db.select({ id: products.id }).from(products).limit(3);
  for (const pr of sampleProducts) {
    const already = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.productId, pr.id)).limit(1);
    if (already.length) continue;
    for (const rv of SAMPLE_REVIEWS) {
      await db.insert(reviews).values({ productId: pr.id, ...rv });
    }
  }

  const adminEmail = "admin@jaijinendracollection.com";
  const adminPass = process.env.NYC_ADMIN_KEY || "jjc-admin-2026";
  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  if (!existingAdmin.length) {
    await db.insert(users).values({
      name: "JJC Admin",
      email: adminEmail,
      mobile: "9468623457",
      passwordHash: await bcrypt.hash(adminPass, 10),
      role: "admin",
    });
  } else if (existingAdmin[0].role !== "admin") {
    await db.update(users).set({ role: "admin" }).where(eq(users.id, existingAdmin[0].id));
  }

  return { ok: true as const, products: SEED_PRODUCTS.length, categories: SEED_CATEGORIES.length };
}
