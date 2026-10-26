import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const n = await getTranslations("Nav");
  const f = await getTranslations("Footer");

  const links = [
    {
      label: n("services"),
      href: "#services",
      children: [
        {
          label: n("service1Title"),
          description: n("service1Text"),
          href: "#services",
        },
        {
          label: n("service2Title"),
          description: n("service2Text"),
          href: "#services",
        },
        {
          label: n("service3Title"),
          description: n("service3Text"),
          href: "#services",
        },
        {
          label: n("service4Title"),
          description: n("service4Text"),
          href: "#services",
        },
        {
          label: n("service5Title"),
          description: n("service5Text"),
          href: "#services",
        },
        {
          label: n("service6Title"),
          description: n("service6Text"),
          href: "#services",
        },
      ],
    },
    { label: n("work"), href: "#work" },
    { label: n("process"), href: "#process" },
    { label: n("contact"), href: "#contact" },
  ];

  const footerLinks = [
    { label: n("home"), href: "/" },
    { label: n("services"), href: "#services" },
    { label: n("work"), href: "#work" },
    { label: n("process"), href: "#process" },
    { label: n("contact"), href: "#contact" },
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

  const meta = [
    { value: t("meta1Value"), label: t("meta1Label") },
    { value: t("meta2Value"), label: t("meta2Label") },
    { value: t("meta3Value"), label: t("meta3Label") },
  ];

  return (
    <>
      <Navbar
        links={links}
        cta={{ label: n("cta"), href: "#contact" }}
        menuLabel={n("menu")}
        closeLabel={n("close")}
      />
      <main>
        <Hero
          eyebrow={t("eyebrow")}
          headline={t("title")}
          text={t("subtitle")}
          primaryCta={{ label: t("primary"), href: "#contact" }}
          secondaryCta={{ label: t("secondary"), href: "#work" }}
          meta={meta}
          caption={t("caption")}
          image={null}
        />
      </main>
      <Footer
        heading={f("heading")}
        cta={{ label: f("cta"), href: "mailto:" + siteConfig.email }}
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
