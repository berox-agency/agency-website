"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Seconds before the very first change, and how long each word rests.
const FIRST_DELAY = 2.4;
const HOLD = 2.4;

const BLUR = "blur(8px)";
const CLEAR = "blur(0px)";

export default function RotatingWord({ words }) {
  const trackRef = useRef(null);
  const wordRefs = useRef([]);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const track = trackRef.current;
        const els = [];

        for (let i = 0; i < words.length; i++) {
          if (wordRefs.current[i]) {
            els.push(wordRefs.current[i]);
          }
        }

        const total = els.length;

        if (total < 2 || !track) {
          return undefined;
        }

        let current = 0;
        let timer = null;
        let tl = null;
        let animating = false;

        function widthOf(el) {
          return el.getBoundingClientRect().width;
        }

        // Keep the wrapper hugging the visible word (also after resize / font load).
        function fit() {
          if (!animating) {
            gsap.set(track, { width: widthOf(els[current]) });
          }
        }

        fit();

        const observer = new ResizeObserver(fit);

        for (let i = 0; i < total; i++) {
          observer.observe(els[i]);
        }

        // The loop never rewinds: `current` only ever moves forward, and the
        // next change is scheduled when the previous one has finished.
        function step() {
          const from = els[current];
          current = (current + 1) % total;
          const to = els[current];

          animating = true;

          tl = gsap.timeline({
            onComplete: function () {
              gsap.set(from, { yPercent: 110, filter: "none" });
              animating = false;
              fit();
              timer = gsap.delayedCall(HOLD, step);
            },
          });

          // width glides to the incoming word
          tl.to(
            track,
            { width: widthOf(to), duration: 0.9, ease: "power3.inOut" },
            0,
          );

          // old word rolls up and out
          tl.to(
            from,
            {
              yPercent: -110,
              autoAlpha: 0,
              filter: BLUR,
              duration: 0.5,
              ease: "power3.in",
            },
            0,
          );

          // new word rolls up from below
          tl.fromTo(
            to,
            { yPercent: 110, autoAlpha: 0, filter: BLUR },
            {
              yPercent: 0,
              autoAlpha: 1,
              filter: CLEAR,
              duration: 0.9,
              ease: "power4.out",
              immediateRender: false,
            },
            0.28,
          );

          tl.set(to, { clearProps: "filter" });
        }

        timer = gsap.delayedCall(FIRST_DELAY, step);

        return function () {
          if (timer) {
            timer.kill();
          }

          if (tl) {
            tl.kill();
          }

          observer.disconnect();
          gsap.set(track, { clearProps: "width" });

          for (let i = 0; i < total; i++) {
            gsap.set(els[i], { clearProps: "all" });
          }
        };
      });

      return function () {
        mm.revert();
      };
    },
    { scope: trackRef },
  );

  if (!words || words.length === 0) {
    return null;
  }

  const items = [];

  for (let i = 0; i < words.length; i++) {
    items.push(
      <span
        key={words[i]}
        ref={function (node) {
          wordRefs.current[i] = node;
        }}
        className={
          "col-start-1 row-start-1 whitespace-nowrap" +
          (i === 0 ? "" : " invisible")
        }
      >
        {words[i]}
      </span>,
    );
  }

  return (
    <>
      <span className="flex justify-center py-[0.1em]">
        <span
          aria-hidden="true"
          className="relative flex overflow-hidden px-[0.1em] py-[0.08em] text-primary"
        >
          <span
            ref={trackRef}
            className="grid shrink-0 grid-cols-[minmax(0,1fr)] justify-items-center"
          >
            {items}
          </span>
        </span>
      </span>
      <span className="sr-only">{words[0]}</span>
    </>
  );
}
