import { getTranslations, setRequestLocale } from "next-intl/server";
import { getChrome } from "@/lib/chrome";
import { siteConfig } from "@/config/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { pageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: "Contact" });

  return buildMetadata({
    locale: locale,
    path: "/contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = await getTranslations("Contact");
  const n = await getTranslations("Nav");
  const chrome = await getChrome("/" + locale);

  return (
    <>
      <JsonLd
        data={pageSchema({
          locale: locale,
          path: "/contact",
          type: "ContactPage",
          title: c("metaTitle"),
          description: c("metaDescription"),
          homeName: n("home"),
          crumbs: [{ name: n("contact"), path: "/contact" }],
        })}
      />
      <Navbar {...chrome.navbar} />
      <main>
        <div className="pt-16 md:pt-24">
          <ContactSection
            id="contact"
            headingAs="h1"
            eyebrow={c("eyebrow")}
            title={c("title")}
            text={c("text")}
            tabsLabel={c("tabsLabel")}
            modes={c.raw("modes")}
            ui={c.raw("ui")}
            delivery={{
              type: "whatsapp",
              number: siteConfig.whatsapp,
              messages: c.raw("whatsapp"),
            }}
          />
        </div>
      </main>
      <Footer {...chrome.footer} />
    </>
  );
}
