import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const TITLE = "Woopet | Pet Shop Online — Snacks, Alimento y más para perros y gatos";
const DESCRIPTION =
  "Woopet, tu pet shop online en Chile. Snacks, alimento completo y arena ecológica para perros y gatos. Marcas Wanpy y Cateko. Despacho a todo Chile con Blue Express.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Woopet Pet Shop",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "pet shop", "tienda de mascotas", "snacks para perros", "snacks para gatos",
    "alimento para perros", "alimento para gatos", "arena para gatos",
    "Wanpy", "Cateko", "Woopet", "mascotas Chile", "petshop online",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Woopet Pet Shop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [{ url: "/paw.svg", type: "image/svg+xml" }],
    shortcut: "/paw.svg",
    apple: "/paw.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-full flex flex-col bg-[#FFF6EE]">
        <CartProvider>
          <Navbar />
          <ViewTransition>
            <main className="flex-1">{children}</main>
          </ViewTransition>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
