import { getTranslations, setRequestLocale } from "next-intl/server";
import SiteChrome from "@/components/SiteChrome";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/MagneticButton";
import { siteConfig } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import { pageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: "Privacy" });

  return buildMetadata({
    locale: locale,
    path: "/privacy",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");
  const n = await getTranslations("Nav");
  const f = await getTranslations("Footer");
  const sections = t.raw("sections");

  const toc = [];
  const body = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const parts = [];

    for (let j = 0; j < section.blocks.length; j++) {
      const block = section.blocks[j];

      if (block.type === "list") {
        const items = [];

        for (let k = 0; k < block.items.length; k++) {
          items.push(<li key={k}>{block.items[k]}</li>);
        }

        parts.push(
          <ul
            key={j}
            className="list-disc space-y-2 ps-6 text-muted marker:text-primary"
          >
            {items}
          </ul>,
        );
      } else {
        parts.push(
          <p key={j} className="text-pretty leading-relaxed text-muted">
            {block.text}
          </p>,
        );
      }
    }

    toc.push(
      <li key={section.id}>
        <a
          href={"#" + section.id}
          className="flex gap-3 py-1.5 text-sm text-muted transition-colors duration-300 hover:text-content focus-visible:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="w-6 shrink-0 font-medium text-primary">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{section.title}</span>
        </a>
      </li>,
    );

    body.push(
      <section
        key={section.id}
        id={section.id}
        className="scroll-mt-28 border-t border-line pt-8 first:border-t-0 first:pt-0"
      >
        <h2 className="flex items-baseline gap-4 text-xl font-semibold tracking-tight rtl:tracking-normal md:text-2xl">
          <span className="text-sm font-medium text-primary">
            {String(i + 1).padStart(2, "0")}
          </span>
          {section.title}
        </h2>
        <div className="mt-4 space-y-4">{parts}</div>
      </section>,
    );
  }

  toc.push(
    <li key="contact-us">
      <a
        href="#contact-us"
        className="flex gap-3 py-1.5 text-sm text-muted transition-colors duration-300 hover:text-content focus-visible:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="w-6 shrink-0 font-medium text-primary">
          {String(sections.length + 1).padStart(2, "0")}
        </span>
        <span>{t("contactTitle")}</span>
      </a>
    </li>,
  );

  return (
    <>
      <JsonLd
        data={pageSchema({
          locale: locale,
          path: "/privacy",
          type: "WebPage",
          title: t("metaTitle"),
          description: t("metaDescription"),
          homeName: n("home"),
          crumbs: [{ name: f("privacy"), path: "/privacy" }],
        })}
      />
      <SiteChrome locale={locale}>
        <div className="mx-auto max-w-site px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            text={t("intro")}
          >
            <p className="motion-hide mt-6 text-sm text-muted">
              {t("updatedLabel")}:{" "}
              <span className="text-content">{t("updated")}</span>
            </p>
          </SectionHeading>

          <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-20">
            <nav
              aria-label={t("tocLabel")}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted rtl:tracking-normal">
                {t("tocLabel")}
              </p>
              <ul>{toc}</ul>
            </nav>

            <article className="max-w-3xl space-y-10">
              {body}

              <section
                id="contact-us"
                className="scroll-mt-28 border-t border-line pt-8"
              >
                <h2 className="flex items-baseline gap-4 text-xl font-semibold tracking-tight rtl:tracking-normal md:text-2xl">
                  <span className="text-sm font-medium text-primary">
                    {String(sections.length + 1).padStart(2, "0")}
                  </span>
                  {t("contactTitle")}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted">
                  {t("contactText")}
                </p>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href={"mailto:" + siteConfig.email}
                      className="font-medium text-content underline decoration-primary underline-offset-4 transition-colors duration-300 hover:text-primary"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={"tel:" + siteConfig.phone.split(" ").join("")}
                      dir="ltr"
                      className="inline-block font-medium text-content underline decoration-primary underline-offset-4 transition-colors duration-300 hover:text-primary"
                    >
                      {siteConfig.phone}
                    </a>
                  </li>
                </ul>
              </section>

              <div className="pt-4">
                <MagneticButton
                  href={"/" + locale}
                  variant="outline"
                  shape="pill"
                >
                  {t("back")}
                </MagneticButton>
              </div>
            </article>
          </div>
        </div>
      </SiteChrome>
    </>
  );
}
