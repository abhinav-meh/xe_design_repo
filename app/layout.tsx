import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const grotesk = localFont({
  src: "./fonts/OverusedGrotesk-VF.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "300 800",
});

export const metadata: Metadata = {
  title: "Crow — cross-border escrow",
  description: "Escrow with an FX rate-lock — for paying out and getting paid across borders, services or goods.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
