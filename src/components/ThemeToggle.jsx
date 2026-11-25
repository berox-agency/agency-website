"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ThemeToggle() {
  const t = useTranslations("Theme");
  const rootRef = useRef(null);
  const iconRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: rootRef });

  const playSwap = contextSafe(function () {
    if (!motionAllowed()) {
      return;
    }
    gsap.fromTo(
      iconRef.current,
      { rotate: -120, scale: 0.5 },
      {
        rotate: 0,
        scale: 1,
        duration: 0.9,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      },
    );
  });

  const hoverIn = contextSafe(function () {
    if (!motionAllowed()) {
      return;
    }
    gsap.to(iconRef.current, {
      rotate: 20,
      duration: 0.45,
      ease: "back.out(2.5)",
      overwrite: "auto",
    });
  });

  const hoverOut = contextSafe(function () {
    if (!motionAllowed()) {
      return;
    }
    gsap.to(iconRef.current, {
      rotate: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  });

  function toggleTheme() {
    const root = document.documentElement;
    const current =
      root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";

    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", next === "light" ? "#F3F8F5" : "#08130F");
    }

    try {
      localStorage.setItem("theme", next);
    } catch (error) {}

    playSwap();

    gsap.delayedCall(0.45, function () {
      root.classList.remove("theme-transition");
    });
  }

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={toggleTheme}
      onPointerEnter={hoverIn}
      onPointerLeave={hoverOut}
      aria-label={t("label")}
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/60 text-content transition duration-300 hover:border-primary hover:text-primary hover:ring-4 hover:ring-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-90"
    >
      <span ref={iconRef} className="relative block h-5 w-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="block h-5 w-5 [:root[data-theme=light]_&]:hidden"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="hidden h-5 w-5 [:root[data-theme=light]_&]:block"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
