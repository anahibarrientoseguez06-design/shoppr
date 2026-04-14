import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Providers from "./providers";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoppr — Marketplace Boliviano",
  description:
    "Comprá del exterior desde Bolivia. Conectamos compradores con viajeros internacionales que traen tus productos.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shoppr",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-gray-900">
        <Providers>{children}</Providers>
        <PWAInstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
