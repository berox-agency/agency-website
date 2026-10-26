"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import MagneticButton from "@/components/MagneticButton";
import CurrentYear from "@/components/CurrentYear";
import FullLogo from "./FullLogo";

const icons = {
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
};

const springEase = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

const braceClass =
  "pointer-events-none absolute text-sm font-semibold text-primary opacity-0 transition-[opacity,translate] duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 " +
  springEase;

const navLinkClass =
  "group relative inline-flex cursor-pointer items-center px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-content focus-visible:text-content focus-visible:outline-none rtl:tracking-normal";

const socialClass =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/60 text-content transition duration-500 hover:-translate-y-1 hover:scale-105 hover:border-primary hover:bg-primary hover:text-onprimary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  springEase;

function SocialIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {icons[name]}
    </svg>
  );
}

export default function Footer({
  heading,
  cta,
  links,
  socials,
  contacts,
  copyright,
  year,
  backToTopLabel,
  navLabel,
  background = null,
}) {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const topRef = useRef(null);
  const headingRef = useRef(null);
  const actionsRef = useRef(null);
  const bottomRef = useRef(null);

  const { contextSafe } = useGSAP(
    function () {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        let tl = null;
        let played = false;

        gsap.set(headingRef.current, { autoAlpha: 1 });

        SplitText.create(headingRef.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: function (self) {
            tl = gsap.timeline({ paused: true });
            tl.from(self.lines, {
              yPercent: 115,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.12,
            });
            tl.from(
              actionsRef.current,
              { autoAlpha: 0, y: 40, duration: 0.9, ease: "back.out(1.5)" },
              ">-0.4",
            );

            if (played) {
              tl.progress(1);
            }

            return tl;
          },
        });

        ScrollTrigger.create({
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
          onEnter: function () {
            played = true;
            if (tl) {
              tl.play();
            }
          },
        });

        gsap.from(topRef.current.querySelectorAll("[data-fade]"), {
          autoAlpha: 0,
          y: 16,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: topRef.current,
            start: "top 95%",
            once: true,
          },
        });

        gsap.from(bottomRef.current.querySelectorAll("[data-fade]"), {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top 92%",
            once: true,
          },
        });

        gsap.fromTo(
          bgRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      });

      return function () {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  const scrollToTop = contextSafe(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, 0);
      return;
    }

    const distance = window.scrollY;

    gsap.to(window, {
      scrollTo: { y: 0, autoKill: true },
      duration: Math.min(Math.max(distance / 2200, 0.9), 2.4),
      ease: "power3.inOut",
      overwrite: "auto",
    });
  });

  const navItems = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    const inner = (
      <>
        <span
          aria-hidden="true"
          dir="ltr"
          className={
            braceClass +
            " left-0.5 translate-x-2 group-hover:translate-x-0 group-focus-visible:translate-x-0"
          }
        >
          {"{"}
        </span>
        <span className="relative">{link.label}</span>
        <span
          aria-hidden="true"
          dir="ltr"
          className={
            braceClass +
            " right-0.5 -translate-x-2 group-hover:translate-x-0 group-focus-visible:translate-x-0"
          }
        >
          {"}"}
        </span>
      </>
    );

    navItems.push(
      <span key={link.label} data-fade className="motion-hide inline-flex">
        {link.href.charAt(0) === "#" ? (
          <a href={link.href} className={navLinkClass}>
            {inner}
          </a>
        ) : (
          <Link href={link.href} className={navLinkClass}>
            {inner}
          </Link>
        )}
      </span>,
    );
  }

  const socialItems = [];

  for (let j = 0; j < socials.length; j++) {
    const social = socials[j];

    socialItems.push(
      <span key={social.name} data-fade className="motion-hide inline-flex">
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className={socialClass}
        >
          <SocialIcon name={social.icon} />
        </a>
      </span>,
    );
  }

  const contactItems = [];

  for (let k = 0; k < contacts.length; k++) {
    const contact = contacts[k];

    contactItems.push(
      <div key={contact.label} data-fade className="motion-hide lg:col-span-3">
        <p className="text-sm text-muted">{contact.label}</p>
        <a
          href={contact.href}
          dir="ltr"
          className="mt-1 inline-block cursor-pointer text-lg font-medium transition-colors duration-300 hover:text-primary md:text-xl"
        >
          {contact.value}
        </a>
      </div>,
    );
  }

  const hasBackground = background && background.src;

  return (
    <footer
      id="contact"
      ref={rootRef}
      className="relative isolate overflow-hidden border-t border-line bg-canvas"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 mask-[linear-gradient(180deg,transparent_0%,black_22%,black_78%,transparent_100%)]"
      >
        <div ref={bgRef} className="absolute inset-x-0 inset-y-[-10%]">
          {hasBackground ? (
            <>
              <Image
                src={background.src}
                alt={background.alt || ""}
                fill
                sizes="100vw"
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--canvas)_0%,transparent_35%,transparent_65%,var(--canvas)_100%)]"></div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[repeating-radial-gradient(ellipse_130%_80%_at_15%_115%,transparent_0px,transparent_17px,var(--line)_18px,transparent_19px)]"></div>
              <div className="absolute inset-0 bg-[repeating-radial-gradient(ellipse_100%_70%_at_88%_125%,transparent_0px,transparent_21px,var(--primary)_22px,transparent_23px)] opacity-[0.12]"></div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-site px-6 md:px-10">
        <div
          ref={topRef}
          className="flex flex-col gap-5 border-b border-line py-6 md:flex-row md:items-center md:justify-between"
        >
          <nav
            aria-label={navLabel}
            className="flex flex-wrap items-center justify-evenly"
          >
            {navItems}
          </nav>
          <div className="flex items-center justify-center gap-2.5">
            {socialItems}
          </div>
        </div>

        <div className="relative py-24 text-center md:px-16 md:py-32 lg:py-40">
          <h2
            ref={headingRef}
            className="motion-hide mx-auto max-w-4xl text-[clamp(2rem,min(5vw,9dvh),4.25rem)] font-semibold leading-[1.08] tracking-tight rtl:leading-[1.3] rtl:tracking-normal"
          >
            {heading}
          </h2>

          <div
            ref={actionsRef}
            className="motion-hide mt-10 flex items-center justify-center gap-2"
          >
            <MagneticButton
              href={cta.href}
              shape="pill"
              className="uppercase tracking-[0.08em] rtl:tracking-normal"
            >
              {cta.label}
            </MagneticButton>
            <MagneticButton
              href={cta.href}
              shape="pill"
              size="icon"
              aria-label={cta.label}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              >
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </MagneticButton>
          </div>

          <div className="mt-12 flex justify-center md:absolute md:inset-e-0 md:top-1/2 md:mt-0 md:-translate-y-1/2">
            <button
              type="button"
              onClick={scrollToTop}
              aria-label={backToTopLabel}
              className="group inline-flex cursor-pointer flex-row items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-primary focus-visible:text-primary focus-visible:outline-none md:flex-col rtl:tracking-normal"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={
                  "h-5 w-5 transition-transform duration-500 group-hover:-translate-y-1.5 " +
                  springEase
                }
              >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
              <span className="md:rotate-180 md:[writing-mode:vertical-rl]">
                {backToTopLabel}
              </span>
            </button>
          </div>
        </div>

        <div
          ref={bottomRef}
          className="grid grid-cols-1 gap-8 pb-10 pt-4 sm:grid-cols-2 lg:shrink-0 lg:grid-cols-12 lg:items-center"
        >
          <div data-fade className="motion-hide sm:col-span-2 lg:col-span-3">
            <Link
              href="/"
              aria-label="Berox"
              className="inline-flex cursor-pointer"
            >
              <FullLogo className="h-10 md:h-12" />
            </Link>
          </div>

          <p
            data-fade
            className="motion-hide order-last text-sm text-muted sm:col-span-2 lg:order-0 lg:col-span-3"
          >
            © <CurrentYear initial={year} /> {copyright}
          </p>

          {contactItems}
        </div>
      </div>
    </footer>
  );
}
