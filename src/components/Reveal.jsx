"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const pending = [];
let listening = false;
let intervalId = null;
let queued = false;

function runPending() {
  const limit = window.innerHeight * 0.88;

  for (let i = pending.length - 1; i >= 0; i--) {
    const rect = pending[i].node.getBoundingClientRect();

    if (rect.top < limit) {
      const entry = pending[i];
      pending.splice(i, 1);
      entry.play();
    }
  }

  if (pending.length === 0) {
    stopListening();
  }
}

function onScroll() {
  if (queued) {
    return;
  }

  queued = true;
  window.requestAnimationFrame(function () {
    queued = false;
    runPending();
  });
}

function startListening() {
  if (listening) {
    return;
  }

  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  intervalId = window.setInterval(runPending, 400);
}

function stopListening() {
  if (!listening) {
    return;
  }

  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  window.removeEventListener("load", onScroll);
  window.clearInterval(intervalId);
  intervalId = null;
}

function removeEntry(entry) {
  for (let i = 0; i < pending.length; i++) {
    if (pending[i] === entry) {
      pending.splice(i, 1);
      break;
    }
  }

  if (pending.length === 0) {
    stopListening();
  }
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
  y = 32,
}) {
  const rootRef = useRef(null);

  useEffect(
    function () {
      const root = rootRef.current;

      if (!root) {
        return undefined;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return undefined;
      }

      const played = [];

      const entry = {
        node: root,
        play: function () {
          const found = root.querySelectorAll(".motion-hide");
          const items = [];

          for (let i = 0; i < found.length; i++) {
            if (found[i].getAttribute("data-revealed") !== "1") {
              found[i].setAttribute("data-revealed", "1");
              items.push(found[i]);
              played.push(found[i]);
            }
          }

          if (items.length === 0) {
            return;
          }

          gsap.fromTo(
            items,
            { y: y, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              delay: delay,
              ease: "power3.out",
              stagger: stagger,
            },
          );
        },
      };

      pending.push(entry);
      startListening();
      onScroll();

      return function () {
        removeEntry(entry);

        if (played.length > 0) {
          gsap.killTweensOf(played);
        }
      };
    },
    [delay, stagger, y],
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
