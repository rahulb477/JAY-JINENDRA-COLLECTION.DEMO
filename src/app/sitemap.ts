import type { MetadataRoute } from "next";
import { demoProducts } from "@/lib/demo-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://jaijinendracollection.com";
  const staticPaths = ["", "/men", "/kids", "/shop", "/new-arrivals", "/trending", "/offers", "/store", "/cart", "/wishlist", "/auth", "/info/contact", "/info/shipping", "/info/returns", "/info/size-guide", "/info/faq"];
  const now = new Date();
  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path || "/"}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...demoProducts().map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
