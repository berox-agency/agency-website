export const workProjects = [
  {
    slug: "bazaro",
    live: "https://bazaro-market.vercel.app",
    liveLabel: "bazaro-market.vercel.app",
    repo: "",
    cover: "/work/bazaro/home-desktop.webp",
    coverMobile: "/work/bazaro/home-mobile.webp",
    video: "/work/bazaro/demo.mp4",
    poster: "/work/bazaro/demo-poster.webp",
    gallery: [
      { src: "/work/bazaro/shop-desktop.webp", kind: "desktop" },
      { src: "/work/bazaro/product-desktop.webp", kind: "desktop" },
      { src: "/work/bazaro/cart-desktop.webp", kind: "desktop" },
      { src: "/work/bazaro/drawer-mobile.webp", kind: "mobile" },
    ],
  },
  {
    slug: "chatbot",
    live: "",
    liveLabel: "",
    repo: "",
    cover: "/work/chatbot/home-desktop.webp",
    coverMobile: "/work/chatbot/confirmed-mobile.webp",
    video: "/work/chatbot/demo.mp4",
    videoKind: "mobile",
    poster: "/work/chatbot/demo-poster.webp",
    gallery: [
      { src: "/work/chatbot/conversations-desktop.webp", kind: "desktop" },
      { src: "/work/chatbot/bookings-desktop.webp", kind: "desktop" },
      { src: "/work/chatbot/knowledge-desktop.webp", kind: "desktop" },
      { src: "/work/chatbot/home-mobile.webp", kind: "mobile" },
      { src: "/work/chatbot/day-mobile.webp", kind: "mobile" },
      { src: "/work/chatbot/confirmed-mobile.webp", kind: "mobile" },
    ],
  },
  {
    slug: "krakebak",
    live: "",
    liveLabel: "",
    repo: "",
    cover: "/work/krakebak/desktop-1.webp",
    coverMobile: "/work/krakebak/mobile-1.webp",
    video: "/work/krakebak/demo.mp4",
    poster: "/work/krakebak/demo-poster.webp",
    gallery: [
      { src: "/work/krakebak/desktop-2.webp", kind: "desktop" },
      { src: "/work/krakebak/desktop-3.webp", kind: "desktop" },
      { src: "/work/krakebak/desktop-4.webp", kind: "desktop" },
      { src: "/work/krakebak/mobile-2.webp", kind: "mobile" },
      { src: "/work/krakebak/mobile-3.webp", kind: "mobile" },
      { src: "/work/krakebak/mobile-4.webp", kind: "mobile" },
    ],
  },
  {
    slug: "b-food",
    live: "",
    liveLabel: "",
    repo: "",
    cover: "/work/b-food/dashboard-desktop.webp",
    coverMobile: "/work/b-food/menu-mobile.webp",
    video: "/work/b-food/demo.mp4",
    videoKind: "mobile",
    poster: "/work/b-food/demo-poster.webp",
    gallery: [
      { src: "/work/b-food/dashboard-desktop.webp", kind: "desktop" },
      { src: "/work/b-food/menu-desktop.webp", kind: "desktop" },
      { src: "/work/b-food/kitchen-desktop.webp", kind: "desktop" },
      { src: "/work/b-food/tables-desktop.webp", kind: "desktop" },
      { src: "/work/b-food/menu-mobile.webp", kind: "mobile" },
      { src: "/work/b-food/cart-mobile.webp", kind: "mobile" },
      { src: "/work/b-food/tracking-mobile.webp", kind: "mobile" },
    ],
  },
  {
    slug: "stays",
    live: "",
    liveLabel: "",
    repo: "",
    cover: "/work/stays/search-desktop.webp",
    coverMobile: "/work/stays/search-mobile.webp",
    video: "/work/stays/demo.mp4",
    videoKind: "mobile",
    poster: "/work/stays/demo-poster.webp",
    gallery: [
      { src: "/work/stays/search-desktop.webp", kind: "desktop" },
      { src: "/work/stays/listing-desktop.webp", kind: "desktop" },
      { src: "/work/stays/host-desktop.webp", kind: "desktop" },
      { src: "/work/stays/admin-desktop.webp", kind: "desktop" },
      { src: "/work/stays/search-mobile.webp", kind: "mobile" },
      { src: "/work/stays/listing-mobile.webp", kind: "mobile" },
      { src: "/work/stays/booking-mobile.webp", kind: "mobile" },
    ],
  },
];

export function getWorkConfig(slug) {
  for (let i = 0; i < workProjects.length; i++) {
    if (workProjects[i].slug === slug) {
      return workProjects[i];
    }
  }
  return null;
}