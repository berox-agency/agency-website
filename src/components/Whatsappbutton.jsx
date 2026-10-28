// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { usePathname } from "next/navigation";

// /* ── Config ─────────────────────────────────────────────── */
// // Dummy number for now. Replace it (international format, digits only,
// // no +, spaces, or dashes) or set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local
// const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201234567890";
// const TEASER_DELAY_MS = 4000;
// const STORAGE_KEY = "wa-teaser-dismissed";
// // Only remember the dismissal in production, so the bubble shows on every reload while developing.
// const PERSIST = process.env.NODE_ENV === "production";

// const COPY = {
//   en: {
//     teaser: "Have a project? Chat with us on WhatsApp.",
//     label: "Chat with us on WhatsApp",
//     close: "Close message",
//     message: "Hi! I'd like to talk about a project.",
//   },
//   ar: {
//     teaser: "هل لديك مشروع؟ تحدث معنا على واتساب.",
//     label: "تحدث معنا على واتساب",
//     close: "إغلاق الرسالة",
//     message: "مرحباً، أرغب في التحدث عن مشروع.",
//   },
// };

// /* Language comes from the URL: /ar/... → Arabic, /en/... → English */
// function localeFromPath(pathname) {
//   const seg = (pathname || "").split("/")[1]?.toLowerCase();
//   return seg === "ar" || seg === "en" ? seg : null;
// }

// /* ── Component ──────────────────────────────────────────── */
// // Optional prop: <WhatsAppButton locale="ar" /> to force a language.
// export default function WhatsAppButton({ locale }) {
//   const pathname = usePathname(); // updates on every client-side navigation
//   const [htmlLang, setHtmlLang] = useState("en"); // fallback if URL has no /en or /ar
//   const [teaser, setTeaser] = useState("hidden"); // 'hidden' | 'open' | 'closing'
//   const [engaged, setEngaged] = useState(false);

//   useEffect(() => {
//     const html = document.documentElement;
//     setHtmlLang(
//       html.lang.toLowerCase().startsWith("ar") || html.dir === "rtl"
//         ? "ar"
//         : "en",
//     );
//   }, [pathname]);

//   // Show the teaser once, a few seconds after load.
//   useEffect(() => {
//     let dismissed = false;
//     try {
//       dismissed = PERSIST && sessionStorage.getItem(STORAGE_KEY) === "1";
//     } catch {}
//     if (dismissed) {
//       setEngaged(true);
//       return;
//     }
//     const t = setTimeout(() => setTeaser("open"), TEASER_DELAY_MS);
//     return () => clearTimeout(t);
//   }, []);

//   const dismiss = useCallback(() => {
//     setEngaged(true);
//     setTeaser("closing");
//     try {
//       sessionStorage.setItem(STORAGE_KEY, "1");
//     } catch {}
//     setTimeout(() => setTeaser("hidden"), 200);
//   }, []);

//   // Esc closes the bubble.
//   useEffect(() => {
//     if (teaser !== "open") return;
//     const onKey = (e) => e.key === "Escape" && dismiss();
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [teaser, dismiss]);

//   const lang = locale ?? localeFromPath(pathname) ?? htmlLang;

//   const t = COPY[lang];
//   const isAr = lang === "ar";
//   const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(t.message)}`;

//   return (
//     <div
//       dir={isAr ? "rtl" : "ltr"}
//       lang={lang}
//       className={[
//         // sizing tokens
//         "[--wa-size:clamp(52px,14vw,60px)] [--wa-gap:clamp(14px,4vw,24px)]",
//         "[@media(max-height:420px)]:[--wa-size:48px] [@media(max-height:420px)]:[--wa-gap:12px]",
//         // placement: a full-width, click-through rail pinned to the bottom (safe-area aware)
//         "fixed inset-x-0 z-[60] pointer-events-none print:hidden",
//         "bottom-[calc(var(--wa-gap)_+_env(safe-area-inset-bottom,0px))]",
//         "pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]",
//       ].join(" ")}
//     >
//       {/* Same container as the navbar, so the button sits on the navbar's edge.
//           items-end follows dir: right in EN, left in AR (like the navbar CTA). */}
//       <div className="mx-auto flex max-w-site flex-col items-end gap-3.5 px-6 md:px-10">
//         {teaser !== "hidden" && (
//           <div
//             role="status"
//             className={[
//               "pointer-events-auto relative",
//               "max-w-[min(280px,calc(100vw_-_var(--wa-gap)_*_2_-_8px))]",
//               "rounded-[20px] bg-[#e3f4ec] text-[#0b1f17]",
//               "ps-[18px] pe-11 py-3.5 max-[380px]:ps-3.5 max-[380px]:pe-10 max-[380px]:py-3",
//               "text-[0.9375rem] leading-[1.4] max-[380px]:text-sm",
//               "rtl:text-base rtl:leading-[1.65] rtl:max-[380px]:text-[0.9375rem]",
//               "shadow-[0_14px_36px_rgba(0,0,0,0.38),0_2px_8px_rgba(0,0,0,0.2)]",
//               "origin-bottom-right rtl:origin-bottom-left",
//               teaser === "closing"
//                 ? "animate-[wa-teaser-out_0.2s_ease-in_forwards]"
//                 : "animate-[wa-teaser-in_0.55s_cubic-bezier(0.34,1.56,0.64,1)_backwards]",
//               "motion-reduce:animate-none",
//             ].join(" ")}
//           >
//             <a
//               href={href}
//               target="_blank"
//               rel="noopener noreferrer"
//               onClick={dismiss}
//               className="block rounded-md text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b1f17]"
//             >
//               {t.teaser}
//             </a>

//             {/* tail pointing at the icon */}
//             <span
//               aria-hidden
//               className="absolute -bottom-1.5 h-4 w-4 rotate-45 rounded-[3px] bg-[#e3f4ec] end-[calc((var(--wa-size)_-_16px)/2)]"
//             />

//             <button
//               type="button"
//               aria-label={t.close}
//               onClick={dismiss}
//               className={[
//                 "absolute end-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full p-0",
//                 "bg-transparent text-[#0b1f17] opacity-55 cursor-pointer",
//                 "transition-[opacity,background-color,rotate] duration-200",
//                 "[-webkit-tap-highlight-color:transparent]",
//                 "focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#0b1f17]",
//                 "[@media(hover:hover)_and_(pointer:fine)]:hover:rotate-90 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#0b1f17]/10 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100",
//               ].join(" ")}
//             >
//               <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3">
//                 <path
//                   d="M1.5 1.5l9 9m0-9l-9 9"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   fill="none"
//                 />
//               </svg>
//             </button>
//           </div>
//         )}

//         <a
//           href={href}
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label={t.label}
//           onClick={() => setEngaged(true)}
//           className={[
//             "group pointer-events-auto relative grid place-items-center rounded-full",
//             "h-[var(--wa-size)] w-[var(--wa-size)]",
//             "bg-[#25d366] text-white no-underline touch-manipulation",
//             "shadow-[0_10px_26px_rgba(37,211,102,0.38),0_2px_6px_rgba(0,0,0,0.45)]",
//             "transition-[translate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
//             "animate-[wa-pop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_0.5s_backwards] motion-reduce:animate-none",
//             "[-webkit-tap-highlight-color:transparent]",
//             "active:scale-[0.93]",
//             "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-white",
//             // hover effects only on devices that really hover (not touch)
//             "[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-[3px] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.07]",
//             "[@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_16px_36px_rgba(37,211,102,0.5),0_3px_8px_rgba(0,0,0,0.45)]",
//           ].join(" ")}
//         >
//           {/* soft pulse rings — only until the visitor engages */}
//           {!engaged && (
//             <>
//               <span
//                 aria-hidden
//                 className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#25d366] opacity-0 animate-[wa-ring_2.8s_ease-out_1.4s_infinite] motion-reduce:hidden"
//               />
//               <span
//                 aria-hidden
//                 className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#25d366] opacity-0 animate-[wa-ring_2.8s_ease-out_2.8s_infinite] motion-reduce:hidden"
//               />
//             </>
//           )}

//           <svg
//             viewBox="0 0 24 24"
//             aria-hidden="true"
//             className="h-[54%] w-[54%] fill-current transition-transform duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:-rotate-[10deg] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.08]"
//           >
//             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
//           </svg>
//         </a>
//       </div>
//     </div>
//   );
// }
