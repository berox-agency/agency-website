"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
  y = 32,
}) {
  const rootRef = useRef(null);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const items = rootRef.current.querySelectorAll(".motion-hide");

        gsap.from(items, {
          y: y,
          autoAlpha: 0,
          duration: 0.9,
          delay: delay,
          ease: "power3.out",
          stagger: stagger,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 88%",
            once: true,
          },
        });
      });

      return function () {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
