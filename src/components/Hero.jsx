"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import MagneticButton from "@/components/MagneticButton";

export default function Hero({
  eyebrow,
  headline,
  text,
  primaryCta,
  secondaryCta,
  meta,
  caption,
  image,
}) {
  const rootRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const textRef = useRef(null);
  const actionsRef = useRef(null);
  const frameRef = useRef(null);
  const parallaxRef = useRef(null);
  const metaRef = useRef(null);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const metaItems = metaRef.current.querySelectorAll("[data-meta]");

        gsap.set(headlineRef.current, { autoAlpha: 1 });

        SplitText.create(headlineRef.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: function (self) {
            const tl = gsap.timeline();

            tl.from(
              eyebrowRef.current,
              { autoAlpha: 0, y: 12, duration: 0.7, ease: "power2.out" },
              0,
            );
            tl.from(
              self.lines,
              {
                yPercent: 115,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.14,
              },
              0.1,
            );
            tl.from(
              frameRef.current,
              {
                autoAlpha: 0,
                y: 60,
                scale: 0.96,
                duration: 1.4,
                ease: "power3.out",
              },
              0.4,
            );
            tl.from(
              textRef.current,
              { autoAlpha: 0, y: 18, duration: 0.9, ease: "power2.out" },
              ">-0.2",
            );
            tl.from(
              actionsRef.current,
              { autoAlpha: 0, y: 48, duration: 1, ease: "back.out(1.5)" },
              ">-0.5",
            );
            tl.from(
              metaItems,
              {
                autoAlpha: 0,
                y: 24,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.1,
              },
              ">-0.4",
            );

            return tl;
          },
        });

        gsap.fromTo(
          parallaxRef.current,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top bottom",
              end: "bottom top",
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

  const metaItems = [];

  for (let i = 0; i < meta.length; i++) {
    metaItems.push(
      <div key={i} data-meta className="motion-hide">
        <p className="text-3xl font-semibold tracking-tight rtl:tracking-normal md:text-4xl">
          {meta[i].value}
        </p>
        <p className="mt-2 text-sm text-muted">{meta[i].label}</p>
      </div>,
    );
  }

  const hasImage = image && image.src;

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      <div className="mx-auto w-full max-w-site px-6 pb-16 pt-32 md:px-10 md:pt-40 lg:pb-24">
        <p
          ref={eyebrowRef}
          className="motion-hide mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted rtl:tracking-normal"
        >
          <span className="h-px w-10 bg-primary"></span>
          {eyebrow}
        </p>

        <h1
          ref={headlineRef}
          className="motion-hide max-w-5xl text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-[1.02] tracking-[-0.035em] rtl:leading-tight rtl:tracking-normal"
        >
          {headline}
        </h1>

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12 lg:mt-16">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <p
              ref={textRef}
              className="motion-hide max-w-md text-lg leading-relaxed text-muted md:text-xl"
            >
              {text}
            </p>

            <div
              ref={actionsRef}
              className="motion-hide mt-10 flex flex-wrap items-center gap-6"
            >
              <MagneticButton href={primaryCta.href}>
                {primaryCta.label}
              </MagneticButton>
              <a
                href={secondaryCta.href}
                className="group inline-flex items-center gap-2 text-sm font-medium"
              >
                <span className="border-b border-line pb-1 transition-colors group-hover:border-primary">
                  {secondaryCta.label}
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </div>

          <figure className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-16">
            <div
              ref={frameRef}
              className="motion-hide relative aspect-4/5 overflow-hidden rounded-card border border-line bg-surface"
            >
              <div
                ref={parallaxRef}
                className="absolute inset-x-0 top-[-15%] h-[130%] will-change-transform"
              >
                {hasImage ? (
                  <Image
                    src={image.src}
                    alt={image.alt || ""}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface">
                    <div className="absolute inset-0 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-size-[48px_48px] opacity-60"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,var(--primary)_0%,transparent_52%)] opacity-40"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_72%,var(--accent)_0%,transparent_48%)] opacity-30"></div>
                    <div className="absolute left-[18%] top-[30%] size-40 rounded-full border border-primary/60"></div>
                    <div className="absolute bottom-[28%] right-[16%] size-24 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
            </div>
            <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted rtl:tracking-normal">
              {caption}
            </figcaption>
          </figure>
        </div>

        <div
          ref={metaRef}
          className="mt-16 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-3 lg:mt-24"
        >
          {metaItems}
        </div>
      </div>
    </section>
  );
}
