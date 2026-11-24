const PLACEHOLDER_URL = "https://berox.example";

function cleanUrl(value) {
  let url = value;
  while (url.charAt(url.length - 1) === "/") {
    url = url.slice(0, url.length - 1);
  }
  return url;
}

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return cleanUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return "https://" + cleanUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }
  return PLACEHOLDER_URL;
}

const url = getSiteUrl();

export const siteConfig = {
  name: "Berox",
  url: url,
  indexable: process.env.ALLOW_INDEXING === "true" && url !== PLACEHOLDER_URL,
  lastModified: new Date("2026-11-25"),
  email: "beroxagency@gmail.com",
  phone: "+20 101 805 2927",
  whatsapp: "201018052927",
  foundingYear: "2026",
  founders: [
    { name: "Ahmed Alhossiny", role: "Founder & CEO" },
    { name: "Hesham Elshamy", role: "Co-Founder" },
  ],
    socials: [
    {
      name: "Instagram",
      icon: "instagram",
      href: "https://www.instagram.com/beroxagency",
    },
    {
      name: "Facebook",
      icon: "facebook",
      href: "https://www.facebook.com/beroxagency",
    },
    {
      name: "TikTok",
      icon: "tiktok",
      href: "https://www.tiktok.com/@beroxagency",
    },
  ],
  profiles: [],
};
