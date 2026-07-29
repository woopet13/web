import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";

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

export const metadata: Metadata = {
  title: "Woopet | Pet Shop Online — Snacks, Alimento y más para perros y gatos",
  description:
    "Woopet, tu pet shop online. Snacks, alimento completo y arena ecológica para perros y gatos. Marcas Wanpy y Cateko. Despacho a todo Chile.",
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
