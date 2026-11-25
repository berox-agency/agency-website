import { siteConfig } from "@/config/site";

const AI_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export default function robots() {
  if (!siteConfig.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  const rules = [{ userAgent: "*", allow: "/" }];

  for (let i = 0; i < AI_BOTS.length; i++) {
    rules.push({ userAgent: AI_BOTS[i], allow: "/" });
  }

  return {
    rules: rules,
    sitemap: siteConfig.url + "/sitemap.xml",
  };
}
