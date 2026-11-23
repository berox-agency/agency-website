import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

export async function getChrome(base) {
  const n = await getTranslations("Nav");
  const f = await getTranslations("Footer");
  const prefix = base === "/" ? "" : base;

  const serviceLinks = [];
  for (let i = 1; i <= 6; i++) {
    serviceLinks.push({
      label: n("service" + i + "Title"),
      description: n("service" + i + "Text"),
      href: base + "#services",
    });
  }

  const links = [
    { label: n("services"), href: base + "#services", children: serviceLinks },
    { label: n("work"), href: prefix + "/work" },
    { label: n("process"), href: base + "#process" },
    { label: n("contact"), href: prefix + "/contact" },
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

  return {
    navbar: {
      links: links,
      cta: { label: n("cta"), href: prefix + "/contact" },
      menuLabel: n("menu"),
      closeLabel: n("close"),
    },
    footer: {
      heading: f("heading"),
      cta: {
        label: f("cta"),
        href: "https://wa.me/" + siteConfig.whatsapp,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      links: footerLinks,
      socials: siteConfig.socials,
      contacts: contacts,
      copyright: f("rights"),
      year: new Date().getFullYear(),
      backToTopLabel: f("backToTop"),
      navLabel: f("navLabel"),
    },
  };
}
