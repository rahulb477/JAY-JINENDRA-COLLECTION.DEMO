import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickView from "@/components/QuickView";
import WhatsAppFab from "@/components/WhatsAppFab";
import { EMAIL, FACEBOOK_URL, INSTAGRAM_URL, PHONE_DISPLAY } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "JAI JINENDRA COLLECTION — Men's Clothing Store, Sarafa Bazaar Jodhpur",
    template: "%s | Jai Jinendra Collection",
  },
  description:
    "Jai Jinendra Collection (JJC) — men's clothing store at Sarafa Bazaar, Jodhpur, Rajasthan. Wholesale & retail shirts, t-shirts, jeans, cargos, trousers, jackets, polos & combo offers. Delivery across India. WhatsApp +91 94686 23457.",
  keywords: [
    "Jai Jinendra Collection",
    "JJC",
    "Sarafa Bazaar Jodhpur",
    "Men's Fashion Jodhpur",
    "Wholesale Men's Clothing",
    "Men's Clothing Online India",
    "mens jeans Jodhpur",
    "check shirts Jodhpur",
    "combo offers menswear",
  ],
  openGraph: {
    title: "JAI JINENDRA COLLECTION — Men's Clothing Store, Jodhpur",
    description: "Men's fashion, wholesale & retail. Sarafa Bazaar, Jodhpur. Delivery across India.",
    type: "website",
    locale: "en_IN",
    siteName: "Jai Jinendra Collection",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Jai Jinendra Collection",
    alternateName: "JJC",
    description: "Men's Clothing Store — wholesale & retail, Sarafa Bazaar, Jodhpur, Rajasthan. Delivery across India.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sarafa Bazaar",
      addressLocality: "Jodhpur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    telephone: "+91-94686-23457",
    email: EMAIL,
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
    priceRange: "₹₹",
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- loaded once for the whole App Router tree via root layout */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="bg-white text-neutral-900 antialiased min-h-screen flex flex-col">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <QuickView />
          <WhatsAppFab />
        </StoreProvider>
      </body>
    </html>
  );
}
