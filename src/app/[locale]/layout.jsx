import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import SmoothAnchors from "@/components/SmoothAnchors";
import ScrollRefresh from "@/components/ScrollRefresh";
import Preloader from "@/components/Preloader";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

const themeScript = `
(function () {
  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (error) {}
  var theme = stored;
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.documentElement.setAttribute("data-theme", theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#F3F8F5" : "#08130F");
  }
})();
`;

const preloaderScript = `
(function () {
  try {
    var entries = performance.getEntriesByType("navigation");
    var reloaded = entries.length > 0 && entries[0].type === "reload";
    var seen = sessionStorage.getItem("berox-preloader") === "1";
    if (seen && !reloaded) {
      document.documentElement.setAttribute("data-skip-preloader", "");
    } else {
      sessionStorage.setItem("berox-preloader", "1");
    }
  } catch (error) {}
})();
`;

const noscriptStyles =
  ".preloader{display:none!important}.motion-hide{visibility:visible!important}";

export function generateStaticParams() {
  const params = [];
  for (let i = 0; i < routing.locales.length; i++) {
    params.push({ locale: routing.locales[i] });
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
    applicationName: "Berox",
    appleWebApp: {
      capable: true,
      title: "Berox",
      statusBarStyle: "default",
    },
    robots: siteConfig.indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const loading = await getTranslations({
    locale: locale,
    namespace: "Loading",
  });
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={inter.variable + " " + plexArabic.variable}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#08130F" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noscriptStyles }} />
        </noscript>
      </head>
      <body className="min-h-screen bg-canvas text-content antialiased">
        <OrganizationJsonLd locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <Preloader label={loading("label")} />
          <SmoothAnchors />
          <ScrollRefresh />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
