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
import WorkSection from "@/components/WorkSection";
import SectionDivider from "@/components/SectionDivider";
import { getWorkConfig } from "@/config/work";
import JsonLd from "@/components/JsonLd";
import { homeSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: "Metadata" });

  return buildMetadata({
    locale: locale,
    path: "",
    title: t("title"),
    description: t("description"),
  });
}

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
  const k = await getTranslations("Work");
  const meta = await getTranslations("Metadata");

  const base = "/" + locale;
  const workHref = base + "/work";
  const contactHref = base + "/contact";

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
    { label: n("work"), href: workHref },
    { label: n("process"), href: "#process" },
    { label: n("contact"), href: contactHref },
  ];

  const footerLinks = [
    { label: n("home"), href: "/" },
    { label: n("services"), href: "#services" },
    { label: n("work"), href: "/work" },
    { label: n("process"), href: "#process" },
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
    cta: { label: s("cta"), href: contactHref },
    items: s.raw("items"),
  };

  const processProps = {
    eyebrow: p("eyebrow"),
    title: p("title"),
    text: p("text"),
    cta: { label: p("cta"), href: contactHref },
    items: p.raw("items"),
  };

  const workItems = k.raw("projects");
  const projects = [];
  for (let i = 0; i < workItems.length && i < 3; i++) {
    const config = getWorkConfig(workItems[i].slug);
    projects.push({
      ...workItems[i],
      href: "/work/" + workItems[i].slug,
      live: config ? config.live : "",
      liveLabel: config ? config.liveLabel : "",
      cover: config ? config.cover : "",
      coverMobile: config ? config.coverMobile : "",
    });
  }

  return (
    <>
      <JsonLd
        data={homeSchema({
          locale: locale,
          title: meta("title"),
          description: meta("description"),
          serviceItems: s.raw("items"),
        })}
      />
      <Navbar
        links={links}
        cta={{ label: n("cta"), href: contactHref }}
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
          primaryCta={{ label: t("primary"), href: contactHref }}
          secondaryCta={{ label: t("secondary"), href: "#work" }}
          services={services}
          servicesLabel={t("servicesLabel")}
        />
        <ServicesSticky id="services" {...servicesProps} />
        <SectionDivider />
        <WorkSection
          id="work"
          eyebrow={k("eyebrow")}
          title={k("title")}
          text={k("text")}
          cta={{ label: k("cta"), href: contactHref }}
          viewAll={{ label: k("ui.viewAll"), href: workHref }}
          placeholders={k.raw("placeholders")}
          projects={projects}
          liveText={k("ui.live")}
        />
        <SectionDivider />
        <ProcessTimeline id="process" {...processProps} />
        <SectionDivider />
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
        <SectionDivider />
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
            cta: { label: q("banner.cta"), href: contactHref },
          }}
        />
      </main>
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
