import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getWorkConfig } from "@/config/work";
import { getChrome } from "@/lib/chrome";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import WorkFilterGrid from "@/components/WorkFilterGrid";
import { ArrowIcon } from "@/components/WorkParts";
import JsonLd from "@/components/JsonLd";
import { pageSchema, projectListNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: "Work" });

  return buildMetadata({
    locale: locale,
    path: "/work",
    title: t("page.metaTitle"),
    description: t("page.metaDescription"),
  });
}

export default async function WorkPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Work");
  const chrome = await getChrome("/" + locale);

  const workItems = t.raw("projects");
  const n = await getTranslations("Nav");
  const projects = [];

  for (let i = 0; i < workItems.length; i++) {
    const config = getWorkConfig(workItems[i].slug);
    projects.push({
      slug: workItems[i].slug,
      name: workItems[i].name,
      badge: workItems[i].badge,
      category: workItems[i].category,
      summary: workItems[i].summary,
      cta: workItems[i].cta,
      imageAlt: workItems[i].imageAlt,
      tags: workItems[i].tags,
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
        data={pageSchema({
          locale: locale,
          path: "/work",
          type: "CollectionPage",
          title: t("page.metaTitle"),
          description: t("page.metaDescription"),
          homeName: n("home"),
          crumbs: [{ name: n("work"), path: "/work" }],
          extraNodes: [projectListNode(locale, workItems)],
        })}
      />
      <Navbar {...chrome.navbar} />
      <main>
        <section className="relative isolate overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-160 max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl md:h-112"
          ></span>

          <div className="mx-auto max-w-site px-6 md:px-10">
            <Reveal className="text-center">
              <p className="motion-hide flex items-center justify-center gap-3 text-lg font-medium uppercase tracking-[0.2em] text-muted rtl:tracking-normal">
                <span className="h-px w-10 bg-primary"></span>
                {t("page.eyebrow")}
                <span className="h-px w-10 bg-primary"></span>
              </p>
              <h1 className="motion-hide mx-auto mt-5 max-w-3xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-tight rtl:leading-[1.3] rtl:tracking-normal">
                {t("page.title")}
              </h1>
              <p className="motion-hide mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg">
                {t("page.text")}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-site px-6 md:px-10">
            <Reveal>
              <WorkFilterGrid
                projects={projects}
                placeholders={t.raw("placeholders")}
                filterAll={t("ui.filterAll")}
                filterLabel={t("ui.filterLabel")}
                liveText={t("ui.live")}
              />
            </Reveal>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="mx-auto max-w-site px-6 md:px-10">
            <Reveal>
              <div className="motion-hide flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-onprimary md:flex-row md:items-center md:justify-between md:p-12">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-semibold tracking-tight rtl:tracking-normal md:text-4xl">
                    {t("page.ctaTitle")}
                  </h2>
                  <p className="mt-3 text-pretty leading-relaxed opacity-90">
                    {t("page.ctaText")}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-canvas px-6 py-3 text-sm font-semibold text-content transition-opacity hover:opacity-90"
                >
                  {t("page.ctaButton")}
                  <ArrowIcon />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer {...chrome.footer} />
    </>
  );
}
