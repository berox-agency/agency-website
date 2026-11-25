import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import { graph, organizationNode } from "@/lib/schema";

export default async function OrganizationJsonLd({ locale }) {
  const meta = await getTranslations({ locale: locale, namespace: "Metadata" });
  const nav = await getTranslations({ locale: locale, namespace: "Nav" });
  const knowsAbout = [];

  for (let i = 1; i <= 6; i++) {
    knowsAbout.push(nav("service" + i + "Title"));
  }

  return (
    <JsonLd
      data={graph([
        organizationNode({
          locale: locale,
          description: meta("description"),
          knowsAbout: knowsAbout,
        }),
      ])}
    />
  );
}
