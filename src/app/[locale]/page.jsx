import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const n = await getTranslations("Nav");

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
    </>
  );
}
