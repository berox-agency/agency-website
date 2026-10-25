import { getTranslations, setRequestLocale } from "next-intl/server";
import ThemeToggle from "@/components/ThemeToggle";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-site items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">Berox</span>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex max-w-site flex-col items-start gap-6 px-6 py-section">
        <span className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-primary">
          {t("badge")}
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg text-muted">{t("subtitle")}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#"
            className="rounded-button bg-primary px-6 py-3 font-medium text-onprimary"
          >
            {t("cta")}
          </a>
          <a
            href="#"
            className="rounded-button border border-line bg-surface px-6 py-3 font-medium"
          >
            {t("secondary")}
          </a>
        </div>
        <div className="mt-8 h-2 w-full max-w-md rounded-full bg-[linear-gradient(90deg,var(--primary)_0%,var(--accent)_100%)]"></div>
      </main>
    </div>
  );
}
