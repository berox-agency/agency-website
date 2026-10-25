"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

export default function ThemeToggle() {
  const t = useTranslations("Theme");
  const [theme, setTheme] = useState("dark");

  useEffect(function () {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);

    try {
      localStorage.setItem("theme", next);
    } catch (error) {}

    setTheme(next);

    gsap.delayedCall(0.45, function () {
      root.classList.remove("theme-transition");
    });
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("label")}
      className="rounded-button border border-line bg-surface px-4 py-2 text-sm font-medium text-content"
    >
      {theme === "dark" ? t("toLight") : t("toDark")}
    </button>
  );
}
