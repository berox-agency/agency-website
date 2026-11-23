import { routing } from "@/i18n/routing";

const OG_LOCALES = { en: "en_US", ar: "ar_EG" };

export function buildMetadata({ locale, path, title, description, images }) {
  const languages = {};

  for (let i = 0; i < routing.locales.length; i++) {
    languages[routing.locales[i]] = "/" + routing.locales[i] + path;
  }

  languages["x-default"] = "/" + routing.defaultLocale + path;

  const url = "/" + locale + path;
  const suffix = locale === "ar" ? "-ar" : "";
  const alternateLocale = [];

  for (let i = 0; i < routing.locales.length; i++) {
    if (routing.locales[i] !== locale) {
      alternateLocale.push(OG_LOCALES[routing.locales[i]]);
    }
  }

  let openGraphImages = [
    {
      url: "/opengraph-image" + suffix + ".png",
      width: 1200,
      height: 630,
      alt: "Berox | Software Agency",
    },
  ];
  let twitterImages = ["/twitter-image" + suffix + ".png"];

  if (images) {
    openGraphImages = images;
    twitterImages = [images[0].url];
  }

  return {
    title: title,
    description: description,
    alternates: { canonical: url, languages: languages },
    openGraph: {
      title: title,
      description: description,
      siteName: "Berox",
      type: "website",
      url: url,
      locale: OG_LOCALES[locale],
      alternateLocale: alternateLocale,
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: twitterImages,
    },
  };
}
