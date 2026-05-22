import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alacam Katalog — B2B Ürün Kataloğu",
  description: "B2B wholesale product catalog for HORECA.",
  icons: {
    icon: "/alacam-logo.png",
    apple: "/alacam-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full bg-background font-sans text-[15px] leading-relaxed text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
