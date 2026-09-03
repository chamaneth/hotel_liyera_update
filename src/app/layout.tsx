import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://hotelliyera.com"),
  title: "Hotel Liyera | Luxury Coastal Resort & Spa",
  description: "Experience Hotel Liyera, where modern architectural luxury harmonizes with timeless tranquility.",
  keywords: ["luxury hotel", "resort", "vacation suites", "hotel reservation", "boutique hotel"],
  openGraph: {
    title: "Hotel Liyera | Luxury Coastal Resort & Spa",
    description: "Experience Hotel Liyera, where modern architectural luxury harmonizes with timeless tranquility.",
    images: [{ url: "/images/hero/hero-banner.avif" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-white text-gray-900 selection:bg-yellow-200 selection:text-black min-h-screen flex flex-col">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
