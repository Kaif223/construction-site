import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { CustomCursor } from "@/components/layout/CustomCursor";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Construction, Architecture & Renovation`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Built with Purpose. Designed to Last.`,
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: "/images/hero/residence-dusk.jpg",
        width: 2400,
        height: 1600,
        alt: "A contemporary two-storey residence lit at dusk beneath a large tree",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#171918",
};

/**
 * Runs before first paint. Hidden "pre-animation" states only apply when this
 * class is present, so visitors without JavaScript — or who prefer reduced
 * motion — always see content. If the motion runtime never boots (e.g. a
 * script fails to load), the class is removed again as a safety net.
 */
const motionBootstrap = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ready');setTimeout(function(){if(!window.__construktMotion){d.classList.remove('motion-ready')}},3500)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.locale}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      // Lets Next disable CSS smooth scrolling while it resets scroll on navigation.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-orange px-5 py-3 text-sm font-medium text-charcoal focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <MotionProvider />
        <CustomCursor />
      </body>
    </html>
  );
}
