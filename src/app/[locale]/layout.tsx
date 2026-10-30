import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Inter_Tight, JetBrains_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";
import { I18nProvider } from "@/i18n/client";
import { clientDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MobileQuoteBar } from "@/components/layout/MobileQuoteBar";
import "../globals.css";

const sans = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });

const mono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400", "500"] });

// Arabic faces are only used under :lang(ar), so they are not preloaded on English pages.
const arabicSans = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  preload: false,
});

const arabicDisplay = Noto_Kufi_Arabic({
  variable: "--font-arabic-display",
  subsets: ["arabic"],
  weight: ["300", "400", "600"],
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { dict, market, l } = await getI18n();
  const base = await pageMetadata({ path: "/", title: dict.meta.home.title, description: l(market.seo.description) });
  return {
    ...base,
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.home.title, template: `%s — ${siteConfig.name}` },
    applicationName: siteConfig.name,
    openGraph: {
      ...base.openGraph,
      images: [{ url: "/images/hero/residence-dusk.jpg", width: 2400, height: 1600, alt: dict.hero.imageAlt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#f5f2eb" };

/**
 * Runs before first paint. Hidden "pre-animation" states only apply when this
 * class is present, so visitors without JavaScript — or who prefer reduced
 * motion — always see content. If the motion runtime never boots, the class
 * is removed again as a safety net.
 */
const motionBootstrap = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ready');setTimeout(function(){if(!window.__construktMotion){d.classList.remove('motion-ready')}},3500)}}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const { locale, language, dir, dict } = await getI18n();
  const fonts = [sans, mono, arabicSans, arabicDisplay].map((font) => font.variable).join(" ");

  return (
    <html lang={language} dir={dir} className={fonts} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body>
        <I18nProvider locale={locale} dict={clientDictionary(dict)}>
          <a
            href="#main"
            className="sr-only z-[100] rounded-full bg-orange px-5 py-3 text-sm font-medium text-charcoal focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
          >
            {dict.common.skipToContent}
          </a>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <MobileQuoteBar />
          <MotionProvider />
          <SmoothScroll />
        </I18nProvider>
      </body>
    </html>
  );
}
