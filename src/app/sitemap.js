import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { workProjects } from "@/config/work";

export default function sitemap() {
  const pages = [
    { path: "", priority: 1, frequency: "monthly" },
    { path: "/work", priority: 0.8, frequency: "monthly" },
    { path: "/contact", priority: 0.7, frequency: "yearly" },
  ];

  for (let i = 0; i < workProjects.length; i++) {
    pages.push({
      path: "/work/" + workProjects[i].slug,
      priority: 0.6,
      frequency: "monthly",
    });
  }

  pages.push({ path: "/privacy", priority: 0.3, frequency: "yearly" });

  const entries = [];

  for (let p = 0; p < pages.length; p++) {
    const languages = {};

    for (let l = 0; l < routing.locales.length; l++) {
      const locale = routing.locales[l];
      languages[locale] = siteConfig.url + "/" + locale + pages[p].path;
    }

    languages["x-default"] =
      siteConfig.url + "/" + routing.defaultLocale + pages[p].path;

    for (let l = 0; l < routing.locales.length; l++) {
      const locale = routing.locales[l];

      entries.push({
        url: siteConfig.url + "/" + locale + pages[p].path,
        lastModified: siteConfig.lastModified,
        changeFrequency: pages[p].frequency,
        priority: pages[p].priority,
        alternates: { languages: languages },
      });
    }
  }

  return entries;
}
