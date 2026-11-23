import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

export default async function SiteChrome({ locale, children }) {
  const n = await getTranslations({ locale: locale, namespace: "Nav" });
  const f = await getTranslations({ locale: locale, namespace: "Footer" });
  const base = "/" + locale;

  const serviceItems = [];

  for (let i = 1; i <= 6; i++) {
    serviceItems.push({
      label: n("service" + i + "Title"),
      description: n("service" + i + "Text"),
      href: base + "#services",
    });
  }

  const links = [
    { label: n("services"), href: base + "#services", children: serviceItems },
    { label: n("work"), href: base + "/work" },
    { label: n("process"), href: base + "#process" },
    { label: n("contact"), href: base + "/contact" },
  ];

  const footerLinks = [
    { label: n("home"), href: "/" },
    { label: n("services"), href: "/#services" },
    { label: n("work"), href: "/work" },
    { label: n("process"), href: "/#process" },
    { label: n("contact"), href: "/contact" },
    { label: f("privacy"), href: "/privacy" },
  ];

  const contacts = [
    {
      label: f("email"),
      value: siteConfig.email,
      href: "mailto:" + siteConfig.email,
    },
    {
      label: f("phone"),
      value: siteConfig.phone,
      href: "tel:" + siteConfig.phone.split(" ").join(""),
    },
  ];

  return (
    <>
      <Navbar
        links={links}
        cta={{ label: n("cta"), href: base + "/contact" }}
        menuLabel={n("menu")}
        closeLabel={n("close")}
      />
      <main>{children}</main>
      <Footer
        heading={f("heading")}
        cta={{
          label: f("cta"),
          href: "https://wa.me/" + siteConfig.whatsapp,
          target: "_blank",
          rel: "noopener noreferrer",
        }}
        links={footerLinks}
        socials={siteConfig.socials}
        contacts={contacts}
        copyright={f("rights")}
        year={new Date().getFullYear()}
        backToTopLabel={f("backToTop")}
        navLabel={f("navLabel")}
      />
    </>
  );
}
