import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katalog — B2B Live Catalog",
  description:
    "Premium B2B product discovery platform for wholesale and HORECA products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f7f7f5] font-sans text-neutral-900">
        {children}
      </body>
    </html>
  );
}
