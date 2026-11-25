"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

function pageHeight() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
}

export default function ScrollRefresh() {
  useEffect(function () {
    let active = true;
    let last = pageHeight();
    let timer = null;

    function refresh() {
      timer = null;

      if (!active) {
        return;
      }

      ScrollTrigger.refresh();
      last = pageHeight();
    }

    function schedule() {
      if (!active) {
        return;
      }

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(refresh, 250);
    }

    function check() {
      const height = pageHeight();

      if (height !== last) {
        last = height;
        schedule();
      }
    }

    const interval = window.setInterval(check, 300);

    window.addEventListener("load", schedule);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule);
    }

    return function () {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("load", schedule);

      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return null;
}
