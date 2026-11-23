export default function manifest() {
  return {
    id: "/",
    name: "Berox | Software Agency",
    short_name: "Berox",
    description:
      "Berox is a software agency from Egypt building websites, web apps and mobile apps for businesses worldwide.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#08130F",
    theme_color: "#08130F",
    lang: "en",
    dir: "ltr",
    categories: ["business", "technology"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Get a free call",
        short_name: "Free call",
        url: "/contact",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
      },
    ],
  };
}
