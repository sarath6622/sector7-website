import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar }          from "@/components/layout/Navbar";
import { Footer }          from "@/components/layout/Footer";
import { WhatsAppFAB }     from "@/components/layout/WhatsAppFAB";
import { MobileBottomCTA } from "@/components/layout/MobileBottomCTA";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "optional",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Sector 7 | Premier Gym in Kochi",
    template: "%s | Sector 7 Gym Kochi",
  },
  description:
    "Sector 7 is Kochi's premier gym — elite equipment, certified trainers, and thousands of proven transformations. Book your free trial today.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7gym.com"
  ),
  openGraph: {
    type: "website",
    siteName: "Sector 7",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppFAB />
        <MobileBottomCTA />
      </body>
    </html>
  );
}
