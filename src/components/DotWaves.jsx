"use client";

import { useEffect, useRef } from "react";
import {
  buildLut,
  clonePalette,
  createRenderer,
  parseColor,
  stepPalette,
} from "@/lib/dot-waves";

const FADE = 0.45;
const FADE_REDUCED = 0.05;

function readPalette(el) {
  const style = getComputedStyle(el);

  return {
    base: parseColor(style.getPropertyValue("--dot")),
    lit: parseColor(style.getPropertyValue("--dot-lit")),
    peak: parseColor(style.getPropertyValue("--dot-peak")),
  };
}

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export default function DotWaves({ spacing = 28, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(
    function () {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return undefined;
      }

      const renderer = createRenderer(makeCanvas);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointer = { x: 0, y: 0, inside: false };

      let current = readPalette(canvas);
      let target = clonePalette(current);
      let width = 0;
      let height = 0;
      let raf = 0;
      let running = false;
      let last = 0;

      renderer.setLut(buildLut(current));

      function paint(dt) {
        return renderer.draw(
          ctx,
          pointer,
          dt,
          reduced.matches ? FADE_REDUCED : FADE,
        );
      }

      function frame(now) {
        const dt = Math.min((now - last) / 1000, 0.1);
        let moving = false;

        last = now;

        if (stepPalette(current, target)) {
          renderer.setLut(buildLut(current));
          moving = true;
        }

        const lit = paint(dt);

        if (lit || moving || pointer.inside) {
          raf = requestAnimationFrame(frame);
        } else {
          running = false;
        }
      }

      function wake() {
        if (running) {
          return;
        }

        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }

      function resize() {
        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        width = rect.width;
        height = rect.height;
        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        renderer.resize(rect.width, rect.height, ratio, spacing);
        paint(0);
        canvas.style.opacity = "1";
      }

      function locate(event) {
        const rect = canvas.getBoundingClientRect();
        const wasInside = pointer.inside;

        if (
          Math.round(rect.width) !== Math.round(width) ||
          Math.round(rect.height) !== Math.round(height)
        ) {
          resize();
        }

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        pointer.x = x;
        pointer.y = y;
        pointer.inside =
          x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

        if (pointer.inside || wasInside) {
          wake();
        }
      }

      function onPointerMove(event) {
        if (event.pointerType === "touch") {
          return;
        }

        locate(event);
      }

      function onPointerDown(event) {
        locate(event);
      }

      function onPointerEnd(event) {
        if (event.pointerType === "touch") {
          pointer.inside = false;
          wake();
        }
      }

      function onPointerLeave() {
        pointer.inside = false;
        wake();
      }

      const themeObserver = new MutationObserver(function () {
        target = readPalette(canvas);

        if (reduced.matches) {
          current = clonePalette(target);
          renderer.setLut(buildLut(current));
          paint(0);
        } else {
          wake();
        }
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      resize();

      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerEnd);
      window.addEventListener("pointercancel", onPointerEnd);
      document.documentElement.addEventListener("pointerleave", onPointerLeave);

      return function () {
        running = false;
        cancelAnimationFrame(raf);
        themeObserver.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerEnd);
        window.removeEventListener("pointercancel", onPointerEnd);
        document.documentElement.removeEventListener(
          "pointerleave",
          onPointerLeave,
        );
      };
    },
    [spacing],
  );

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className={
        "pointer-events-none block transition-opacity duration-1000 " +
        className
      }
    />
  );
}
