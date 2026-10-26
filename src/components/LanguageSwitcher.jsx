"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { gsap, useGSAP } from "@/lib/gsap";

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function LanguageSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef(null);
  const globeRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: rootRef });
  const nextLocale = locale === "en" ? "ar" : "en";

  const spinGlobe = contextSafe(function () {
    if (!motionAllowed()) {
      return;
    }
    gsap.to(globeRef.current, {
      rotate: "+=360",
      duration: 1.1,
      ease: "elastic.out(1, 0.55)",
      overwrite: "auto",
    });
  });

  function switchLocale() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={switchLocale}
      onPointerEnter={spinGlobe}
      aria-label={t("language")}
      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 text-sm font-medium text-content transition duration-300 hover:border-primary hover:ring-4 hover:ring-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
    >
      <svg
        ref={globeRef}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-4.5 w-4.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z" />
      </svg>
      <span dir="ltr" className="flex items-center gap-1.5 tracking-wide">
        <span className={locale === "en" ? "text-primary" : "text-muted"}>
          EN
        </span>
        <span className="text-line">/</span>
        <span className={locale === "ar" ? "text-primary" : "text-muted"}>
          AR
        </span>
      </span>
    </button>
  );
}
