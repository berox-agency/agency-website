import { siteConfig } from "@/config/site";

const SCHEMA_CONTEXT = "https://schema.org";

function organizationId() {
  return siteConfig.url + "/#organization";
}

function websiteId() {
  return siteConfig.url + "/#website";
}

function localeBase(locale) {
  return siteConfig.url + "/" + (locale || "en");
}

function pageUrl(locale, path) {
  let cleanPath = path || "";
  if (cleanPath !== "" && cleanPath.charAt(0) !== "/") {
    cleanPath = "/" + cleanPath;
  }
  if (cleanPath === "/") {
    cleanPath = "";
  }
  return localeBase(locale) + cleanPath;
}

function areaServed() {
  return [
    { "@type": "Country", name: "Egypt" },
    { "@type": "Place", name: "Middle East" },
  ];
}

function collectNodes(item, nodes) {
  if (!item) {
    return;
  }
  if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      collectNodes(item[i], nodes);
    }
    return;
  }
  if (item["@graph"]) {
    for (let j = 0; j < item["@graph"].length; j++) {
      collectNodes(item["@graph"][j], nodes);
    }
    return;
  }
  nodes.push(item);
}

function withExtraNodes(baseNodes, extraNodes) {
  const nodes = [];
  for (let i = 0; i < baseNodes.length; i++) {
    nodes.push(baseNodes[i]);
  }
  if (extraNodes) {
    for (let j = 0; j < extraNodes.length; j++) {
      nodes.push(extraNodes[j]);
    }
  }
  return nodes;
}

export function graph(...args) {
  const nodes = [];
  for (let i = 0; i < args.length; i++) {
    collectNodes(args[i], nodes);
  }
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": nodes,
  };
}

export function organizationNode({ locale, description, knowsAbout }) {
  const sameAs = [];

  for (let i = 0; i < siteConfig.socials.length; i++) {
    sameAs.push(siteConfig.socials[i].href);
  }

  for (let i = 0; i < siteConfig.profiles.length; i++) {
    sameAs.push(siteConfig.profiles[i].href);
  }

  const founders = [];

  for (let i = 0; i < siteConfig.founders.length; i++) {
    founders.push({
      "@type": "Person",
      name: siteConfig.founders[i].name,
      jobTitle: siteConfig.founders[i].role,
      worksFor: { "@id": organizationId() },
    });
  }

  return {
    "@type": "ProfessionalService",
    "@id": organizationId(),
    name: "Berox",
    alternateName: ["Berox Agency", "بيروكس"],
    url: localeBase(locale),
    description: description,
    logo: {
      "@type": "ImageObject",
      url: siteConfig.url + "/icons/icon-512.png",
      width: 512,
      height: 512,
    },
    image: siteConfig.url + "/icons/icon-512.png",
    email: siteConfig.email,
    telephone: siteConfig.phone,
    foundingDate: siteConfig.foundingYear,
    founder: founders,
    address: { "@type": "PostalAddress", addressCountry: "EG" },
    areaServed: areaServed(),
    knowsLanguage: ["en", "ar"],
    knowsAbout: knowsAbout,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.email,
        telephone: siteConfig.phone,
        availableLanguage: ["English", "Arabic"],
      },
    ],
    sameAs: sameAs,
  };
}

export function homeSchema({ locale, name, description, extraNodes } = {}) {
  const url = pageUrl(locale, "/");
  return graph(
    withExtraNodes(
      [
        {
          "@type": "WebSite",
          "@id": websiteId(),
          url: url,
          name: name || "Berox",
          description: description,
          inLanguage: locale || "en",
          publisher: { "@id": organizationId() },
        },
        {
          "@type": "WebPage",
          "@id": url + "#webpage",
          url: url,
          name: name || "Berox",
          description: description,
          inLanguage: locale || "en",
          isPartOf: { "@id": websiteId() },
          about: { "@id": organizationId() },
        },
      ],
      extraNodes
    )
  );
}

export function pageSchema({ locale, path, name, description, type, extraNodes } = {}) {
  const url = pageUrl(locale, path);
  return graph(
    withExtraNodes(
      [
        {
          "@type": type || "WebPage",
          "@id": url + "#webpage",
          url: url,
          name: name,
          description: description,
          inLanguage: locale || "en",
          isPartOf: { "@id": websiteId() },
          about: { "@id": organizationId() },
        },
      ],
      extraNodes
    )
  );
}

export function projectListNode(locale, items) {
  const list = [];
  const source = items || [];

  for (let i = 0; i < source.length; i++) {
    const item = source[i];
    const slug = item.slug || "";
    list.push({
      "@type": "ListItem",
      position: i + 1,
      name: item.title || item.name || slug,
      url: pageUrl(locale, "/work/" + slug),
    });
  }

  return {
    "@type": "ItemList",
    "@id": pageUrl(locale, "/work") + "#projects",
    itemListElement: list,
  };
}

export function caseStudySchema({ locale, slug, name, description, image, datePublished, extraNodes } = {}) {
  const url = pageUrl(locale, "/work/" + (slug || ""));
  return graph(
    withExtraNodes(
      [
        {
          "@type": "CreativeWork",
          "@id": url + "#case-study",
          url: url,
          name: name,
          description: description,
          image: image,
          datePublished: datePublished,
          inLanguage: locale || "en",
          author: { "@id": organizationId() },
          publisher: { "@id": organizationId() },
          isPartOf: { "@id": websiteId() },
        },
      ],
      extraNodes
    )
  );
}