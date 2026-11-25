"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/*
  Smooth scrolling for in-page links (href="#services" etc.), anywhere on the
  page. Uses the same GSAP ScrollToPlugin as the footer's back-to-top button.
  Respects the target's scroll-margin-top, so the section lands below the
  fixed navbar, and does nothing when the visitor prefers reduced motion.
*/
export default function SmoothAnchors() {
  useEffect(function () {
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const link = event.target.closest("a[href^='#']");

      if (!link) {
        return;
      }

      const hash = link.getAttribute("href");

      if (hash.length < 2) {
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));

      if (!target) {
        return;
      }

      event.preventDefault();

      const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const distance = Math.abs(target.getBoundingClientRect().top - offset);

      gsap.to(window, {
        scrollTo: { y: target, offsetY: offset, autoKill: true },
        duration: Math.min(Math.max(distance / 2200, 0.9), 2.4),
        ease: "power3.inOut",
        overwrite: "auto",
      });

      history.pushState(null, "", hash);
    }

    document.addEventListener("click", onClick);

    return function () {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
