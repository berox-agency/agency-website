import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSticky from "@/components/ServicesSticky";
import ProcessTimeline from "@/components/ProcessTimeline";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { techStack } from "@/config/tech-stack";
import WhyBerox from "@/components/WhyBerox";
import Faq from "@/components/Faq";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const n = await getTranslations("Nav");
  const f = await getTranslations("Footer");
  const s = await getTranslations("Services");
  const p = await getTranslations("Process");
  const w = await getTranslations("WhyBerox");
  const q = await getTranslations("Faq");

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

  const services = [
    n("service1Title"),
    n("service2Title"),
    n("service3Title"),
    n("service4Title"),
    n("service5Title"),
    n("service6Title"),
  ];

  const servicesProps = {
    eyebrow: s("eyebrow"),
    title: s("title"),
    text: s("text"),
    cta: { label: s("cta"), href: "#contact" },
    items: s.raw("items"),
  };

  const processProps = {
    eyebrow: p("eyebrow"),
    title: p("title"),
    text: p("text"),
    cta: { label: p("cta"), href: "#contact" },
    items: p.raw("items"),
  };

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
          headlineStart={t("titleStart")}
          words={t.raw("words")}
          headlineEnd={t("titleEnd")}
          text={t("subtitle")}
          primaryCta={{ label: t("primary"), href: "#contact" }}
          secondaryCta={{ label: t("secondary"), href: "#work" }}
          services={services}
          servicesLabel={t("servicesLabel")}
        />
        <ServicesSticky id="services" {...servicesProps} />
        <ProcessTimeline id="process" {...processProps} />
        <WhyBerox
          id="why-berox"
          eyebrow={w("eyebrow")}
          title={w("title")}
          text={w("text")}
          features={w.raw("features")}
          stack={{
            label: w("stackLabel"),
            ariaLabel: w("stackAria"),
            items: techStack,
          }}
        />
        <Faq
          id="faq"
          eyebrow={q("eyebrow")}
          title={q("title")}
          text={q("text")}
          allLabel={q("allLabel")}
          tabsLabel={q("tabsLabel")}
          tabs={q.raw("tabs")}
          banner={{
            title: q("banner.title"),
            text: q("banner.text"),
            cta: { label: q("banner.cta"), href: "#contact" },
          }}
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
