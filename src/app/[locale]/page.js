import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6">
      <span className="rounded-full border border-current px-3 py-1 text-sm opacity-80">
        {t("badge")}
      </span>
      <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="text-lg opacity-70">{t("subtitle")}</p>
      <a
        href="#"
        className="rounded-lg border border-current px-5 py-3 font-medium"
      >
        {t("cta")}
      </a>
    </main>
  );
}
