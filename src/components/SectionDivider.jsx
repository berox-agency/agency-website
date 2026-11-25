"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function SectionDivider({ className = "" }) {
  const rootRef = useRef(null);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const lines = rootRef.current.querySelectorAll("[data-line]");
        const mark = rootRef.current.querySelector("[data-mark]");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 92%",
            once: true,
          },
        });

        timeline.from(
          lines,
          { scaleX: 0, duration: 1.1, ease: "power3.out" },
          0,
        );
        timeline.from(
          mark,
          { scale: 0, duration: 0.7, ease: "back.out(2.4)" },
          0.15,
        );
      });

      return function () {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={
        "mx-auto flex max-w-site items-center gap-4 px-6 md:gap-6 md:px-10 " +
        className
      }
    >
      <span
        data-line
        className="h-px flex-1 origin-right bg-[linear-gradient(90deg,rgb(var(--primary-rgb)/0)_0%,rgb(var(--primary-rgb)/0.4)_100%)] rtl:origin-left rtl:bg-[linear-gradient(270deg,rgb(var(--primary-rgb)/0)_0%,rgb(var(--primary-rgb)/0.4)_100%)]"
      ></span>
      <span
        data-mark
        className="block h-2.5 w-2.5 rotate-45 bg-primary shadow-[0_0_14px_rgb(var(--primary-rgb)/0.55)]"
      ></span>
      <span
        data-line
        className="h-px flex-1 origin-left bg-[linear-gradient(90deg,rgb(var(--primary-rgb)/0.4)_0%,rgb(var(--primary-rgb)/0)_100%)] rtl:origin-right rtl:bg-[linear-gradient(270deg,rgb(var(--primary-rgb)/0.4)_0%,rgb(var(--primary-rgb)/0)_100%)]"
      ></span>
    </div>
  );
}
