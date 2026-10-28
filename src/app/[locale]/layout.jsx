import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";
// import WhatsAppButton from "@/components/Whatsappbutton";

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
    title: t("title"),
    description: t("description"),
    applicationName: "Berox",
    appleWebApp: {
      capable: true,
      title: "Berox",
      statusBarStyle: "default",
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
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
      </head>
      <body className="min-h-screen bg-canvas text-content antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          {/* <WhatsAppButton /> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
