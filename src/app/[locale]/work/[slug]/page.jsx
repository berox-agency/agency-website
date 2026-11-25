import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { workProjects, getWorkConfig } from "@/config/work";
import { getChrome } from "@/lib/chrome";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import SectionDivider from "@/components/SectionDivider";
import Reveal from "@/components/Reveal";
import {
  BrowserFrame,
  PhoneFrame,
  ArrowIcon,
  ExternalIcon,
} from "@/components/WorkParts";
import JsonLd from "@/components/JsonLd";
import { caseStudySchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const CONTAINER = "mx-auto max-w-site px-6 md:px-10";
const SECTION = "py-20 md:py-28";
const MOCKUP_GLOW =
  "bg-[linear-gradient(135deg,rgb(var(--primary-rgb)/0.16)_0%,rgb(var(--primary-rgb)/0.02)_100%)]";
const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-onprimary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-content transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const LABEL =
  "text-xs font-semibold uppercase tracking-[0.16em] text-primary rtl:tracking-normal";

function findProject(items, slug) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].slug === slug) {
      return items[i];
    }
  }
  return null;
}

export function generateStaticParams() {
  const params = [];
  for (let i = 0; i < routing.locales.length; i++) {
    for (let j = 0; j < workProjects.length; j++) {
      params.push({ locale: routing.locales[i], slug: workProjects[j].slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale: locale, namespace: "Work" });
  const project = findProject(t.raw("projects"), slug);
  const config = getWorkConfig(slug);

  if (!project || !config) {
    return {};
  }

  return buildMetadata({
    locale: locale,
    path: "/work/" + slug,
    title: project.name + " | " + t("ui.caseStudy") + " | Berox",
    description: project.summary,
    images: [{ url: config.cover, alt: project.imageAlt }],
  });
}

export default async function CaseStudyPage({ params }) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("Work");
  const project = findProject(t.raw("projects"), slug);
  const config = getWorkConfig(slug);

  if (!project || !config) {
    notFound();
  }

  const n = await getTranslations("Nav");

  const chrome = await getChrome("/");

  const tags = [];
  for (let i = 0; i < project.tags.length; i++) {
    tags.push(
      <li
        key={project.tags[i]}
        className="rounded-full border border-line px-3 py-1 text-xs text-muted"
      >
        {project.tags[i]}
      </li>,
    );
  }

  const factItems = [
    { label: t("ui.services"), value: project.services },
    { label: t("ui.team"), value: project.team },
    { label: t("ui.timeline"), value: project.timeline },
    { label: t("ui.year"), value: project.year },
  ];
  const facts = [];
  for (let i = 0; i < factItems.length; i++) {
    facts.push(
      <div
        key={factItems[i].label}
        className="motion-hide border-t border-line pt-4"
      >
        <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted rtl:tracking-normal">
          {factItems[i].label}
        </dt>
        <dd className="mt-2 text-base font-medium">{factItems[i].value}</dd>
      </div>,
    );
  }

  const stats = [];
  for (let i = 0; i < project.stats.length; i++) {
    stats.push(
      <li
        key={project.stats[i].label}
        className="motion-hide rounded-2xl border border-line bg-surface p-6"
      >
        <p className="text-4xl font-semibold tracking-tight text-primary rtl:tracking-normal">
          {project.stats[i].value}
        </p>
        <p className="mt-2 text-sm text-muted">{project.stats[i].label}</p>
      </li>,
    );
  }

  const storyItems = [
    { label: t("ui.overview"), text: project.overview },
    { label: t("ui.challenge"), text: project.challenge },
    { label: t("ui.solution"), text: project.solution },
  ];
  const story = [];
  for (let i = 0; i < storyItems.length; i++) {
    story.push(
      <div
        key={storyItems[i].label}
        className="motion-hide grid gap-3 border-t border-line py-8 md:grid-cols-[1fr_2fr] md:gap-10"
      >
        <h3 className={LABEL}>{storyItems[i].label}</h3>
        <p className="text-pretty text-lg leading-relaxed md:text-xl">
          {storyItems[i].text}
        </p>
      </div>,
    );
  }

  const features = [];
  for (let i = 0; i < project.features.length; i++) {
    features.push(
      <li
        key={project.features[i].title}
        className="motion-hide rounded-3xl border border-line bg-surface p-6"
      >
        <p className="text-sm font-semibold text-primary">{"0" + (i + 1)}</p>
        <h3 className="mt-4 text-lg font-semibold">
          {project.features[i].title}
        </h3>
        <p className="mt-2 text-pretty leading-relaxed text-muted">
          {project.features[i].text}
        </p>
      </li>,
    );
  }

  const gallery = [];
  const desktopGallery = [];
  const mobileGallery = [];
  let mobileCount = 0;
  let desktopCount = 0;
  for (let i = 0; i < config.gallery.length; i++) {
    if (config.gallery[i].kind === "mobile") {
      mobileCount++;
    } else {
      desktopCount++;
    }
  }
  const splitGallery = mobileCount > 1;
  let desktopSeen = 0;
  for (let i = 0; i < config.gallery.length; i++) {
    const item = config.gallery[i];
    const caption = project.gallery[i] ? project.gallery[i].caption : "";
    let shot = null;

    if (item.kind === "mobile") {
      shot = (
        <div className="mx-auto w-[min(100%,15rem)]">
          <PhoneFrame>
            <Image
              src={item.src}
              alt={caption}
              fill
              sizes="240px"
              className="object-cover object-top"
            />
          </PhoneFrame>
        </div>
      );
    } else {
      shot = (
        <BrowserFrame url={config.liveLabel}>
          <Image
            src={item.src}
            alt={caption}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </BrowserFrame>
      );
    }

    let figureClass = "motion-hide";
    if (item.kind !== "mobile") {
      desktopSeen++;
      if (
        splitGallery &&
        desktopCount % 2 === 1 &&
        desktopSeen === desktopCount
      ) {
        figureClass =
          "motion-hide md:col-span-2 md:mx-auto md:w-[calc(50%-1rem)]";
      }
    }

    const figure = (
      <figure key={item.src} className={figureClass}>
        {shot}
        <figcaption className="mt-4 text-center text-sm text-muted">
          {caption}
        </figcaption>
      </figure>
    );

    if (!splitGallery) {
      gallery.push(figure);
    } else if (item.kind === "mobile") {
      mobileGallery.push(figure);
    } else {
      desktopGallery.push(figure);
    }
  }

  const stack = [];
  for (let i = 0; i < project.stack.length; i++) {
    const chips = [];
    for (let j = 0; j < project.stack[i].items.length; j++) {
      chips.push(
        <li
          key={project.stack[i].items[j]}
          className="rounded-full border border-line px-3 py-1 text-xs text-muted"
        >
          {project.stack[i].items[j]}
        </li>,
      );
    }
    stack.push(
      <li
        key={project.stack[i].group}
        className="motion-hide rounded-2xl border border-line bg-surface p-5"
      >
        <h3 className="text-sm font-semibold">{project.stack[i].group}</h3>
        <ul className="mt-4 flex flex-wrap gap-2">{chips}</ul>
      </li>,
    );
  }

  return (
    <>
      <JsonLd
        data={caseStudySchema({
          locale: locale,
          slug: slug,
          project: project,
          config: config,
          homeName: n("home"),
          workName: n("work"),
          caseStudyLabel: t("ui.caseStudy"),
        })}
      />
      <Navbar {...chrome.navbar} />
      <main>
        <section className="pb-16 pt-32 md:pb-24 md:pt-40">
          <div className={CONTAINER}>
            <Reveal>
              <Link
                href="/work"
                className="motion-hide inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
              >
                <ArrowIcon className="rotate-180" />
                {t("ui.back")}
              </Link>

              <div className="motion-hide mt-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  {project.badge}
                </span>
                <span className={LABEL}>{project.category}</span>
              </div>

              <h1 className="motion-hide mt-6 text-5xl font-semibold tracking-tight rtl:tracking-normal md:text-7xl">
                {project.name}
              </h1>
              <p className="motion-hide mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-muted">
                {project.summary}
              </p>
              <ul className="motion-hide mt-6 flex flex-wrap gap-2">{tags}</ul>

              {config.live || config.repo ? (
                <div className="motion-hide mt-8 flex flex-wrap gap-3">
                  {config.live ? (
                    <a
                      href={config.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={BTN_PRIMARY}
                    >
                      {t("ui.live")}
                      <ExternalIcon />
                    </a>
                  ) : null}
                  {config.repo ? (
                    <a
                      href={config.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={BTN_OUTLINE}
                    >
                      {t("ui.code")}
                      <ExternalIcon />
                    </a>
                  ) : null}
                </div>
              ) : project.demoButton ? (
                <div className="motion-hide mt-8 flex flex-wrap gap-3">
                  <Link href="/contact" className={BTN_PRIMARY}>
                    {project.demoButton}
                    <ArrowIcon />
                  </Link>
                </div>
              ) : null}

              <dl className="mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                {facts}
              </dl>
            </Reveal>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className={CONTAINER}>
            <Reveal>
              <div
                className={
                  "motion-hide rounded-3xl p-4 sm:p-10 md:p-14 " + MOCKUP_GLOW
                }
              >
                <div className="relative pb-[8%] pe-[16%]">
                  <BrowserFrame url={config.liveLabel}>
                    <Image
                      src={config.cover}
                      alt={project.imageAlt}
                      fill
                      priority
                      sizes="(min-width: 1280px) 1000px, 90vw"
                      className="object-cover object-top"
                    />
                  </BrowserFrame>
                  <PhoneFrame className="absolute bottom-0 inset-e-0 w-[22%] min-w-[90px]">
                    <Image
                      src={config.coverMobile}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover object-top"
                    />
                  </PhoneFrame>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className={CONTAINER}>
            <Reveal>
              {stats.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-3">{stats}</ul>
              ) : null}
              <div className={stats.length > 0 ? "mt-14" : ""}>{story}</div>
            </Reveal>
          </div>
        </section>

        <SectionDivider />

        <section className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeading
              align="center"
              eyebrow={t("ui.featuresEyebrow")}
              title={project.featuresTitle}
            />
            <Reveal className="mt-14">
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {features}
              </ul>
            </Reveal>
          </div>
        </section>

        {config.video ? (
          <>
            <SectionDivider />
            <section className={SECTION}>
              <div className={CONTAINER}>
                <SectionHeading
                  align="center"
                  eyebrow={t("ui.videoEyebrow")}
                  title={project.videoTitle}
                  text={project.videoText}
                />
                <Reveal className="mt-14">
                  {config.videoKind === "mobile" ? (
                    <div className="motion-hide mx-auto w-[min(100%,17rem)]">
                      <PhoneFrame>
                        <video
                          className="absolute inset-0 h-full w-full object-cover object-top"
                          src={config.video}
                          poster={config.poster}
                          controls
                          muted
                          loop
                          playsInline
                          preload="none"
                        ></video>
                      </PhoneFrame>
                    </div>
                  ) : (
                    <div className="motion-hide mx-auto max-w-4xl">
                      <BrowserFrame url={config.liveLabel}>
                        <video
                          className="absolute inset-0 h-full w-full object-cover object-top"
                          src={config.video}
                          poster={config.poster}
                          controls
                          muted
                          loop
                          playsInline
                          preload="none"
                        ></video>
                      </BrowserFrame>
                    </div>
                  )}
                </Reveal>
              </div>
            </section>
          </>
        ) : null}

        <SectionDivider />

        <section className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeading
              align="center"
              eyebrow={t("ui.galleryEyebrow")}
              title={project.galleryTitle}
            />
            <Reveal className="mt-14">
              {splitGallery ? (
                <>
                  <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    {desktopGallery}
                  </div>
                  <div className="mt-14 grid gap-8 sm:grid-cols-3 sm:items-start">
                    {mobileGallery}
                  </div>
                </>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                  {gallery}
                </div>
              )}
            </Reveal>
          </div>
        </section>

        <SectionDivider />

        <section className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeading
              align="center"
              eyebrow={t("ui.stackEyebrow")}
              title={project.stackTitle}
            />
            <Reveal className="mt-14">
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stack}
              </ul>
              <div className="motion-hide mt-8 rounded-2xl border border-dashed border-line p-6">
                <p className={LABEL}>{t("ui.noteLabel")}</p>
                <p className="mt-3 text-pretty leading-relaxed text-muted">
                  {project.note}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className={CONTAINER}>
            <Reveal>
              <div className="motion-hide flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-onprimary md:flex-row md:items-center md:justify-between md:p-12">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-semibold tracking-tight rtl:tracking-normal md:text-4xl">
                    {project.ctaTitle || t("ui.ctaTitle")}
                  </h2>
                  <p className="mt-3 text-pretty leading-relaxed opacity-90">
                    {project.ctaText || t("ui.ctaText")}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-canvas px-6 py-3 text-sm font-semibold text-content transition-opacity hover:opacity-90"
                >
                  {t("ui.ctaButton")}
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
