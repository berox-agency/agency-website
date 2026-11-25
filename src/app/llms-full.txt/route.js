import { siteConfig } from "@/config/site";
import { buildLlmsFullTxt } from "@/lib/llms";

export function GET() {
  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  };

  if (!siteConfig.indexable) {
    headers["X-Robots-Tag"] = "noindex, nofollow";
  }

  return new Response(buildLlmsFullTxt(), { headers: headers });
}
