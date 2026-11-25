import { getLocale, getTranslations } from "next-intl/server";
import SiteChrome from "@/components/SiteChrome";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale: locale, namespace: "NotFound" });
  const base = "/" + locale;

  return (
    <SiteChrome locale={locale}>
      <section className="relative isolate grid min-h-svh place-items-center overflow-hidden px-6 py-24 md:px-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl md:h-[38rem] md:w-[38rem]"
        ></span>

        <Reveal className="mx-auto flex w-full max-w-site flex-col items-center text-center">
          <p
            aria-hidden="true"
            dir="ltr"
            className="motion-hide select-none bg-[linear-gradient(180deg,rgb(var(--primary-rgb)/0.9)_0%,rgb(var(--primary-rgb)/0)_100%)] bg-clip-text text-[clamp(7rem,30vw,17rem)] font-semibold leading-none text-transparent"
          >
            {t("code")}
          </p>
          <p className="motion-hide -mt-2 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted rtl:tracking-normal md:text-base">
            <span className="h-px w-10 bg-primary"></span>
            {t("eyebrow")}
            <span className="h-px w-10 bg-primary"></span>
          </p>
          <h1 className="motion-hide mt-6 max-w-2xl text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-[1.1] tracking-tight rtl:leading-[1.3] rtl:tracking-normal">
            {t("title")}
          </h1>
          <p className="motion-hide mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted md:text-lg">
            {t("text")}
          </p>
          <div className="motion-hide mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <MagneticButton
              href={base}
              variant="primary"
              shape="pill"
              className="w-full sm:w-auto"
            >
              {t("home")}
            </MagneticButton>
            <MagneticButton
              href={base + "/contact"}
              variant="outline"
              shape="pill"
              className="w-full sm:w-auto"
            >
              {t("contact")}
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </SiteChrome>
  );
}
