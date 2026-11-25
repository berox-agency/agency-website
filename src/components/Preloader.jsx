"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import Logo from "@/components/Logo";

const MIN_TIME = 900;
const MAX_TIME = 6000;
const FADE_TIME = 700;
const SKIP_ATTRIBUTE = "data-skip-preloader";

const useBeforePaint =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

let alreadyShown = false;

export default function Preloader({ label }) {
  const [phase, setPhase] = useState(function () {
    return alreadyShown ? "gone" : "show";
  });

  useBeforePaint(
    function () {
      if (phase !== "show") {
        return;
      }

      if (document.documentElement.hasAttribute(SKIP_ATTRIBUTE)) {
        alreadyShown = true;
        setPhase("gone");
        return;
      }

      gsap.globalTimeline.pause();

      return function () {
        gsap.globalTimeline.resume();
      };
    },
    [phase],
  );

  useEffect(
    function () {
      if (phase !== "show") {
        return;
      }

      if (document.documentElement.hasAttribute(SKIP_ATTRIBUTE)) {
        return;
      }

      let finished = false;
      let loaded = document.readyState === "complete";
      let fontsReady = false;
      let minDone = false;

      function finish() {
        if (finished) {
          return;
        }

        finished = true;
        alreadyShown = true;
        setPhase("leave");
      }

      function tryFinish() {
        if (loaded && fontsReady && minDone) {
          finish();
        }
      }

      function onLoad() {
        loaded = true;
        tryFinish();
      }

      if (!loaded) {
        window.addEventListener("load", onLoad);
      }

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          fontsReady = true;
          tryFinish();
        });
      } else {
        fontsReady = true;
      }

      const minTimer = setTimeout(function () {
        minDone = true;
        tryFinish();
      }, MIN_TIME);

      const maxTimer = setTimeout(finish, MAX_TIME);

      return function () {
        finished = true;
        window.removeEventListener("load", onLoad);
        clearTimeout(minTimer);
        clearTimeout(maxTimer);
      };
    },
    [phase],
  );

  useEffect(
    function () {
      if (phase !== "leave") {
        return;
      }

      const timer = setTimeout(function () {
        setPhase("gone");
      }, FADE_TIME);

      return function () {
        clearTimeout(timer);
      };
    },
    [phase],
  );

  if (phase === "gone") {
    return null;
  }

  return (
    <div
      data-phase={phase}
      role="status"
      aria-live="polite"
      className={
        "preloader fixed inset-0 z-200 flex flex-col items-center justify-center bg-canvas transition-[opacity,visibility] duration-700 ease-out " +
        (phase === "leave" ? "pointer-events-none invisible opacity-0" : "")
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-primary/10 blur-3xl md:h-96 md:w-96"
      ></span>

      <div className="relative flex flex-col items-center gap-8">
        <span className="preloader-logo">
          <Logo className="h-9 md:h-12" />
        </span>
        <span
          aria-hidden="true"
          className="block h-0.75 w-40 overflow-hidden rounded-full bg-line md:w-52"
        >
          <span className="preloader-bar block h-full w-full rounded-full bg-primary"></span>
        </span>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
