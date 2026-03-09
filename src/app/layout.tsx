import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar }            from "@/components/layout/Navbar";
import { Footer }            from "@/components/layout/Footer";
import { WhatsAppFAB }       from "@/components/layout/WhatsAppFAB";
import { MobileBottomCTA }   from "@/components/layout/MobileBottomCTA";
import { GoogleAnalytics, MicrosoftClarity } from "@/components/layout/Analytics";
import { TrialPopup } from "@/components/layout/TrialPopup";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { generateJSONLD, getLocalBusinessJSONLD } from "@/lib/seo";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7gym.com";
const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

export const metadata: Metadata = {
  title: {
    default: "Sector 7 | Premier Gym in Kochi",
    template: "%s | Sector 7 Gym Kochi",
  },
  description:
    "Sector 7 is Kochi's premier gym — elite equipment, certified trainers, and thousands of proven transformations. Book your free trial today.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "Sector 7",
    locale: "en_IN",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Sector 7 Gym Kochi" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
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
  const localBusinessLD = generateJSONLD("LocalBusiness", getLocalBusinessJSONLD());

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        {/* Global JSON-LD: LocalBusiness (every page) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: localBusinessLD }}
        />

        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ScrollProgress />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppFAB />
        <MobileBottomCTA />
        <TrialPopup />

        {/* Analytics — load after interactive, no-op if env vars not set */}
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
