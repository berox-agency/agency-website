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
