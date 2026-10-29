"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import MagneticButton from "@/components/MagneticButton";
import SecondaryButton from "@/components/SecondaryButton";
import RotatingWord from "@/components/RotatingWord";
import DotWaves from "@/components/DotWaves";
import ServicesMarquee from "@/components/ServicesMarquee";

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="cta-nudge h-4 w-4 rtl:-scale-x-100"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function Line({ children }) {
  return (
    <span className="my-[-0.16em] block overflow-hidden py-[0.16em]">
      <span data-line className="block">
        {children}
      </span>
    </span>
  );
}

export default function Hero({
  eyebrow,
  eyebrowLocation,
  headlineStart,
  words,
  headlineEnd,
  text,
  primaryCta,
  secondaryCta,
  services,
  servicesLabel,
}) {
  const rootRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const textRef = useRef(null);
  const actionsRef = useRef(null);
  const marqueeRef = useRef(null);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const lines = headlineRef.current.querySelectorAll("[data-line]");
        const tl = gsap.timeline();

        gsap.set(headlineRef.current, { autoAlpha: 1 });

        tl.from(
          eyebrowRef.current,
          { autoAlpha: 0, y: 12, duration: 0.7, ease: "power2.out" },
          0,
        );
        tl.from(
          lines,
          {
            yPercent: 130,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.14,
          },
          0.1,
        );
        tl.from(
          textRef.current,
          { autoAlpha: 0, y: 18, duration: 0.9, ease: "power2.out" },
          ">-0.7",
        );
        tl.from(
          actionsRef.current,
          { autoAlpha: 0, y: 40, duration: 1, ease: "back.out(1.5)" },
          ">-0.6",
        );
        tl.from(
          marqueeRef.current,
          { autoAlpha: 0, y: 24, duration: 0.9, ease: "power2.out" },
          ">-0.6",
        );
      });

      return function () {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="flex h-svh flex-col overflow-hidden pt-20"
    >
      <div className="relative isolate flex min-h-0 flex-1 items-center justify-center px-6 md:px-10">
        <DotWaves className="dots-mask absolute inset-0 -z-10 h-full w-full" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,var(--primary),transparent)] opacity-[0.09]"
        ></div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <p
            ref={eyebrowRef}
            className="motion-hide mb-[clamp(0.75rem,3svh,2rem)] flex items-center justify-center gap-3 text-[clamp(1rem,2svh,1rem)] font-medium uppercase tracking-[0.2em] text-muted rtl:tracking-normal"
          >
            <span className="h-px w-8 bg-primary md:w-10"></span>
            <span>
              {eyebrow}
              <span className="hidden sm:inline">{eyebrowLocation}</span>
            </span>
            <span className="h-px w-8 bg-primary md:w-10"></span>
          </p>

          <h1
            ref={headlineRef}
            className="motion-hide max-w-4xl text-balance text-[clamp(2.125rem,min(8.75vw,8.65svh),5.75rem)] font-semibold leading-[1.08] tracking-[-0.035em] rtl:leading-[1.3] rtl:tracking-normal"
          >
            <Line>{headlineStart}</Line>
            <Line>
              <RotatingWord words={words} />
            </Line>
            <Line>{headlineEnd}</Line>
          </h1>

          <p
            ref={textRef}
            className="motion-hide mt-[clamp(0.75rem,3.2svh,2rem)] max-w-2xl text-pretty text-[clamp(1rem,min(2.2vw,2.6svh),1.25rem)] leading-relaxed text-muted [@media(max-height:580px)]:hidden"
          >
            {text}
          </p>

          <div
            ref={actionsRef}
            className="motion-hide mt-[clamp(1rem,4.2svh,2.75rem)] flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <MagneticButton
              href={primaryCta.href}
              size="hero"
              attention
              className="w-full sm:w-auto"
            >
              {primaryCta.label}
              <Arrow />
            </MagneticButton>
            <SecondaryButton href={secondaryCta.href}>
              {secondaryCta.label}
            </SecondaryButton>
          </div>
        </div>
      </div>

      <div ref={marqueeRef} className="motion-hide shrink-0">
        <ServicesMarquee items={services} label={servicesLabel} />
      </div>
    </section>
  );
}
